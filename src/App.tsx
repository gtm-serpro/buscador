// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SearchPage from '@/pages/SearchPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}