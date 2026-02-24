<!DOCTYPE html>
<html>
<head>
    <title>Data Peserta</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>Laporan Data Peserta</h2>
        <p>Dicetak pada: {{ date('d-m-Y H:i') }}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Nama</th>
                <th>ID Peserta</th>
                <th>Program</th>
                <th>Nilai</th>
                <th>Status</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($participants as $index => $p)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $p->name }}</td>
                <td>{{ $p->participant_id }}</td>
                <td>{{ $p->program }}</td>
                <td>{{ $p->grade }}</td>
                <td>{{ $p->status }}</td>
                <td>{{ $p->date }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>