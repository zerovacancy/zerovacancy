
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResendTestPage from './pages/ResendTest';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resend-test" element={<ResendTestPage />} />
        <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
