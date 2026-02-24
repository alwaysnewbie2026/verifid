<?php

namespace App\Exports;

use App\Models\Participant;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ParticipantsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    public function collection()
    {
        return Participant::orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Lengkap',
            'ID Peserta',
            'Program',
            'Nilai',
            'Status',
            'Tanggal'
        ];
    }

    public function map($participant): array
    {
        static $i = 0;
        $i++;
        return [
            $i,
            $participant->name,
            $participant->participant_id,
            $participant->program,
            $participant->grade,
            $participant->status,
            $participant->date,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => true]], // Header dibold
        ];
    }
}