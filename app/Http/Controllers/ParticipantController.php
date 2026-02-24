<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ParticipantController extends Controller
{
    public function verify(Request $request, $id)
    {
        // Validasi ID (hanya huruf, angka, dan karakter khusus yang umum di ID)
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|string|regex:/^[a-zA-Z0-9\-_]+$/|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Format ID tidak valid. Gunakan format seperti STD-2024-8892'
            ], 400);
        }

        // Cari peserta berdasarkan participant_id (case-insensitive)
        $participant = Participant::where('participant_id', strtoupper(trim($id)))->first();

        if (!$participant) {
            return response()->json([
                'error' => 'ID Peserta tidak ditemukan. Pastikan ID yang Anda masukkan benar.'
            ], 404);
        }

        // Format tanggal ke bahasa Indonesia
        $date = \Carbon\Carbon::parse($participant->date);
        $months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        $formattedDate = $date->format('d') . ' ' . $months[$date->format('n') - 1] . ' ' . $date->format('Y');

        return response()->json([
            'id' => $participant->participant_id,
            'name' => $participant->name,
            'program' => $participant->program,
            'grade' => $participant->grade,
            'status' => $participant->status,
            'date' => $formattedDate,
            'instructor' => 'Budi Santoso, M.M.', // Bisa dikembangkan untuk disimpan di DB
            'certificate' => $participant->certificate ? 'Sertifikat Tersedia' : 'Tidak Tersedia',
            'hours' => '120 Jam Pelajaran', // Bisa dikembangkan untuk disimpan di DB
            'has_certificate' => !!$participant->certificate,
            'certificate_url' => $participant->certificate ? asset('storage/' . $participant->certificate) : null,
        ]);
    }
}