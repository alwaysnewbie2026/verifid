import React, { useState, useRef, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import FrontendLayout from '@/Layouts/FrontendLayout';
import HeroSection from '@/Components/Frontend/HeroSection';
import AboutSection from '@/Components/Frontend/AboutSection';
import ContactSection from '@/Components/Frontend/ContactSection';

export default function Welcome() {
  const [searchId, setSearchId] = useState('');
  const [searchStatus, setSearchStatus] = useState('idle'); // idle, loading, success, error
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const searchInputRef = useRef(null);

  // Auto-focus input saat halaman pertama kali dimuat
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      setErrorMessage('Silakan masukkan ID Peserta');
      setSearchStatus('error');
      return;
    }

    setSearchStatus('loading');
    setErrorMessage('');
    setSearchResult(null);

    try {
      // ✅ Panggil API backend yang sebenarnya
      const response = await axios.get(`/api/verify/${encodeURIComponent(searchId.trim())}`);
      
      setSearchResult(response.data);
      setSearchStatus('success');
      
      // Scroll ke hasil verifikasi
      document.querySelector('.verification-result')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    } catch (error) {
      if (error.response?.status === 404) {
        setErrorMessage(error.response.data.error || 'ID Peserta tidak ditemukan. Pastikan ID yang Anda masukkan benar.');
      } else if (error.response?.status === 400) {
        setErrorMessage(error.response.data.error || 'Format ID tidak valid. Gunakan format seperti STD-2024-8892');
      } else {
        setErrorMessage('Terjadi kesalahan saat memverifikasi. Silakan coba lagi beberapa saat lagi.');
      }
      setSearchStatus('error');
    }
  };

  const resetSearch = () => {
    setSearchStatus('idle');
    setSearchId('');
    setSearchResult(null);
    setErrorMessage('');
    if (searchInputRef.current) searchInputRef.current.focus();
  };

  return (
    <FrontendLayout>
      <Head title="Verifikasi Sertifikat Digital - VerifID" />
      
      <HeroSection 
        searchId={searchId}
        setSearchId={setSearchId}
        searchStatus={searchStatus}
        searchResult={searchResult}
        errorMessage={errorMessage}
        handleSearch={handleSearch}
        resetSearch={resetSearch}
        searchInputRef={searchInputRef}
      />

      <AboutSection />

      <ContactSection />
    </FrontendLayout>
  );
}