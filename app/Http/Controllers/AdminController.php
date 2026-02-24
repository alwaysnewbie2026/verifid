<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Participant;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ParticipantsExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function index()
{
    $participants = Participant::orderBy('created_at', 'desc')->get();
    
    // ✅ KIRIM SEMUA LOG (tanpa take(20)) untuk pagination client-side
    $logs = ActivityLog::orderBy('created_at', 'desc')->get()->map(function($log) {
        return [
            'id' => $log->id,
            'action' => $log->action,
            'user' => $log->user ?? 'Admin Utama',
            'time' => $log->created_at->format('Y-m-d H:i'),
            'type' => $log->type,
        ];
    });

    return Inertia::render('AdminPanel', [
        'dbParticipants' => $participants,
        'dbLogs' => $logs // ✅ Semua log dikirim ke frontend
    ]);
}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'participant_id' => 'required|string|unique:participants',
            'program' => 'required|string',
            'grade' => 'required|string',
            'status' => 'required|string',
            'date' => 'required|date|date_format:Y-m-d|before_or_equal:today',
            'certificate' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('certificate')) {
            $path = $request->file('certificate')->store('certificates', 'public');
            $validated['certificate'] = $path;
        }

        $validated['user'] = Auth::user()->name ?? 'Admin Utama';
        Participant::create($validated);

        ActivityLog::create([
            'action' => "Tambah Peserta: {$validated['name']}",
            'type' => 'create',
            'user' => $validated['user']
        ]);

        return redirect()->back()->with('message', 'Data berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $participant = Participant::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'participant_id' => 'required|string|unique:participants,participant_id,'.$id,
            'program' => 'required|string',
            'grade' => 'required|string',
            'status' => 'required|string',
            'date' => 'required|date',
            'certificate' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('certificate')) {
            // Hapus file lama jika ada
            if ($participant->certificate) {
                Storage::disk('public')->delete($participant->certificate);
            }
            // Simpan file baru
            $path = $request->file('certificate')->store('certificates', 'public');
            $validated['certificate'] = $path;
        } else {
            // ✅ KUNCI PERBAIKAN: Buang 'certificate' dari array validasi 
            // jika tidak ada file baru yang diunggah, agar data lama tidak tertimpa null.
            unset($validated['certificate']);
        }

        $validated['user'] = Auth::user()->name ?? 'Admin Utama';
        $participant->update($validated);

        ActivityLog::create([
            'action' => "Update Data: {$validated['name']}",
            'type' => 'update',
            'user' => $validated['user']
        ]);

        return redirect()->back()->with('message', 'Data berhasil diupdate');
    }

    public function destroy($id)
    {
        $participant = Participant::findOrFail($id);
        
        if ($participant->certificate) {
            Storage::disk('public')->delete($participant->certificate);
        }
        
        $name = $participant->name;
        $participant->delete();

        ActivityLog::create([
            'action' => "Hapus Peserta: {$name}",
            'type' => 'delete',
            'user' => Auth::user()->name ?? 'Admin Utama'
        ]);

        return redirect()->back()->with('message', 'Data berhasil dihapus');
    }

    public function downloadTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="Template_Data_Peserta.csv"',
        ];

        $callback = function () {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Nama Lengkap', 'ID Peserta', 'Program', 'Nilai', 'Status', 'Tanggal (YYYY-MM-DD)']);
            fputcsv($file, ['Sarah Amanda', 'STD-2024-9001', 'Digital Marketing', 'A', 'Lulus', '2024-05-20']);
            fputcsv($file, ['Budi Santoso', 'STD-2024-9002', 'Fullstack Dev', 'B+', 'Proses', '2024-06-15']);
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importCsv(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|mimes:csv,txt|max:5120',
            ]);

            $file = $request->file('file');
            $handle = fopen($file->path(), 'r');

            if (!$handle) {
                throw new \Exception('Gagal membuka file CSV');
            }

            fgetcsv($handle); // Skip header
            $insertData = [];
            $now = now();
            $count = 0;
            $duplicateCount = 0;
            $errors = [];

            // Ambil ID dari DB
            $existingIds = Participant::pluck('participant_id')->toArray();
            
            // ✅ TAMBAHAN: Array untuk melacak ID di dalam file CSV itu sendiri
            $processedIdsInCsv = []; 

            while (($row = fgetcsv($handle, 1000, ',')) !== false) {
                if (!isset($row[1]) || empty(trim($row[1]))) continue;
                
                $participantId = trim($row[1]);

                // ✅ PERBAIKAN LOGIKA: Cek di DB ATAU cek di baris CSV yang sudah terbaca sebelumnya
                if (in_array($participantId, $existingIds) || in_array($participantId, $processedIdsInCsv)) {
                    $duplicateCount++;
                    continue; 
                }

                $dateValue = $row[5] ?? $now->format('Y-m-d');
                $formattedDate = $this->parseDate($dateValue);

                if (!$formattedDate) {
                    $errors[] = "Baris ID {$participantId}: Format tanggal tidak valid";
                    continue;
                }

                $insertData[] = [
                    'name' => trim($row[0] ?? '-'),
                    'participant_id' => $participantId,
                    'program' => trim($row[2] ?? '-'),
                    'grade' => trim($row[3] ?? '-'),
                    'status' => trim($row[4] ?? 'Lulus'),
                    'date' => $formattedDate,
                ];
                
                // ✅ TAMBAHAN: Catat ID ini agar baris bawahnya yang kembar ditolak
                $processedIdsInCsv[] = $participantId; 
                $count++;
            }

            fclose($handle);

            if (empty($insertData) && $duplicateCount > 0) {
                return redirect()->back()->with('error', "Semua data ({$duplicateCount} baris) sudah ada di database atau duplikat di file. Tidak ada data baru.");
            } elseif (empty($insertData)) {
                return redirect()->back()->with('error', 'File CSV kosong atau format salah!');
            }

            session()->put('import_all_data', $insertData);

            session()->flash('import_preview', [
                'total' => $count,
                'duplicates' => $duplicateCount,
                'preview' => array_slice($insertData, 0, 5),
                'errors' => $errors,
            ]);

            return redirect()->back();

        } catch (\Exception $e) {
            \Log::error('Import CSV Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error: '.$e->getMessage());
        }
    }

    public function confirmImport(Request $request)
    {
        try {
            // ✅ Ambil raw data yang kita simpan tadi
            $importData = session('import_all_data');
            
            if (empty($importData)) {
                return redirect()->back()->with('error', 'Data import kedaluwarsa. Silakan upload ulang CSV.');
            }

            $now = now();
            $chunks = array_chunk($importData, 500);
            $totalInserted = 0;

            foreach ($chunks as $chunk) {
                $chunkWithTimestamps = array_map(function($item) use ($now) {
                    return array_merge($item, [
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }, $chunk);
                
                Participant::insertOrIgnore($chunkWithTimestamps);
                $totalInserted += count($chunk);
            }

            // ✅ Clear session setelah berhasil
            session()->forget('import_all_data');
            session()->forget('import_preview');

            ActivityLog::create([
                'action' => 'Import '.$totalInserted.' Peserta via CSV',
                'type' => 'create',
                'user' => Auth::user()->name ?? 'Admin Utama'
            ]);

            return redirect()->back()->with('message', $totalInserted.' Data berhasil diimport!');

        } catch (\Exception $e) {
            \Log::error('Confirm Import Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error: '.$e->getMessage());
        }
    }

    private function parseDate($dateString)
    {
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateString)) {
            return $dateString;
        }
        if (preg_match('/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/', $dateString, $matches)) {
            return "{$matches[3]}-" . str_pad($matches[1], 2, '0', STR_PAD_LEFT) . "-" . str_pad($matches[2], 2, '0', STR_PAD_LEFT);
        }
        $timestamp = strtotime($dateString);
        if ($timestamp) {
            return date('Y-m-d', $timestamp);
        }
        return false;
    }

    public function bulkDelete(Request $request)
    {
        try {
            $request->validate([
                'ids' => 'required|array|min:1',
                'ids.*' => 'string'
            ]);
            
            $ids = array_filter(array_map('trim', $request->ids));

            if (empty($ids)) {
                return redirect()->back()->with('error', 'Tidak ada ID yang valid untuk dihapus!');
            }

            // ✅ UBAH: Gunakan 'participant_id', karena user menginput STD-XXXX
            $deletedCount = Participant::whereIn('participant_id', $ids)->delete();

            if ($deletedCount > 0) {
                ActivityLog::create([
                    'action' => "Hapus Massal {$deletedCount} Peserta",
                    'type' => 'delete',
                    'user' => Auth::user()->name ?? 'Admin Utama'
                ]);
                return redirect()->back()->with('message', "{$deletedCount} Data berhasil dihapus secara massal");
            }

            // Jika tidak ada yang terhapus, kembalikan error
            return redirect()->back()->with('error', 'Tidak ada data yang cocok dengan ID tersebut!');
            
        } catch (\Exception $e) {
            \Log::error('Bulk Delete Error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error: '.$e->getMessage());
        }
    }

    public function exportExcel()
    {
        ActivityLog::create([
            'action' => 'Export Data Peserta ke Excel',
            'type' => 'read',
            'user' => Auth::user()->name ?? 'Admin Utama'
        ]);

        return Excel::download(new ParticipantsExport, 'Data_Peserta_'.date('Ymd_His').'.xlsx');
    }

    public function exportPdf()
    {
        $participants = Participant::orderBy('created_at', 'desc')->get();
        
        ActivityLog::create([
            'action' => 'Export Data Peserta ke PDF',
            'type' => 'read',
            'user' => Auth::user()->name ?? 'Admin Utama'
        ]);

        $pdf = Pdf::loadView('exports.participants-pdf', compact('participants'));
        
        // return $pdf->stream(); // Jika ingin preview di browser
        return $pdf->download('Data_Peserta_'.date('Ymd_His').'.pdf'); 
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required', 'string', 'email', 'max:255', 
                Rule::unique('users')->ignore($user->id) // Hindari error unik jika email tidak diganti
            ],
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        ActivityLog::create([
            'action' => 'Memperbarui Profil Admin',
            'type' => 'update',
            'user' => $user->name
        ]);

        return redirect()->back()->with('message', 'Profil berhasil diperbarui!');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|current_password', // Bawaan Laravel untuk cek password lama
            'password' => 'required|string|min:8|confirmed', // Harus ada input 'password_confirmation'
        ]);

        $user = Auth::user();
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        ActivityLog::create([
            'action' => 'Mengubah Password Admin',
            'type' => 'auth',
            'user' => $user->name
        ]);

        return redirect()->back()->with('message', 'Password berhasil diubah!');
    }

    
}