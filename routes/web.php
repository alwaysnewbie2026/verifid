<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ParticipantController; // ✅ Import controller baru

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Route untuk verifikasi peserta (PUBLIC - tidak perlu auth)
Route::get('/api/verify/{id}', [ParticipantController::class, 'verify'])->name('api.verify');

// ⚠️ PENTING: Bungkus SEMUA route admin dengan middleware 'auth'
Route::middleware(['auth'])->group(function () {
    Route::get('/admin-panel', [AdminController::class, 'index'])->name('admin.index');
    
    // ✅ 1. Taruh route statis DI ATAS route parameter dinamis
    Route::get('/admin-panel/participants/template', [AdminController::class, 'downloadTemplate'])->name('admin.participants.template');
    Route::post('/admin-panel/participants/import', [AdminController::class, 'importCsv'])->name('admin.participants.import');
    Route::post('/admin-panel/participants/confirm-import', [AdminController::class, 'confirmImport'])->name('admin.participants.confirmImport');
    Route::post('/admin-panel/participants/bulk-delete', [AdminController::class, 'bulkDelete'])->name('admin.participants.bulkDelete');

    // ✅ 2. Taruh route dinamis ({id}) DI BAWAH
    Route::post('/admin-panel/participants', [AdminController::class, 'store'])->name('admin.participants.store');
    Route::post('/admin-panel/participants/{id}', [AdminController::class, 'update'])->name('admin.participants.update');
    Route::delete('/admin-panel/participants/{id}', [AdminController::class, 'destroy'])->name('admin.participants.destroy');

    Route::get('/admin-panel/participants/export/excel', [AdminController::class, 'exportExcel'])->name('admin.participants.export.excel');
    Route::get('/admin-panel/participants/export/pdf', [AdminController::class, 'exportPdf'])->name('admin.participants.export.pdf');

    Route::post('/admin-panel/settings/profile', [AdminController::class, 'updateProfile'])->name('admin.settings.profile');
    Route::post('/admin-panel/settings/password', [AdminController::class, 'updatePassword'])->name('admin.settings.password');
});

require __DIR__.'/auth.php';