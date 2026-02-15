import React, { useState } from 'react';
import { Menu, Award, Image, MessageSquare, X, Lock, FileText} from 'lucide-react';

import HomePage from './pages/HomePage';
import AwardPhotosPage from './pages/AwardPhotosPage';
import PaintingsPage from './pages/PaintingsPage';
import GuestbookPage from './pages/GuestbookPage';
import AdminPage from './pages/AdminPage';
import PagesListPage from './components/PagesListPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const pages = [
    { id: 'home', label: 'Journey & Awards', icon: Award },
    { id: 'paintings', label: 'Paintings', icon: Image },
    { id: 'award-photos', label: 'Award Photos', icon: Award },
    { id: 'guestbook', label: 'Guestbook', icon: MessageSquare },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'admin', label: 'Admin', icon: Lock }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f1f5f9, #cbd5e1)' }}>
      <nav style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to right, #1e293b, #0f172a)', 
        color: 'white', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Narappa Chintha</h1>

            <div style={{ display: 'none', gap: '0.25rem' }} className="desktop-nav">
              {pages.map(page => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => setCurrentPage(page.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s',
                      background: currentPage === page.id ? 'white' : 'transparent',
                      color: currentPage === page.id ? '#1e293b' : 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page.id) e.target.style.background = '#475569';
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page.id) e.target.style.background = 'transparent';
                    }}
                  >
                    <Icon size={18} />
                    <span>{page.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              style={{ display: 'block', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div style={{ paddingBottom: '1rem' }}>
              {pages.map(page => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      setCurrentPage(page.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderRadius: '0.5rem',
                      marginBottom: '0.25rem',
                      background: currentPage === page.id ? 'white' : 'transparent',
                      color: currentPage === page.id ? '#1e293b' : 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page.id) e.target.style.background = '#475569';
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page.id) e.target.style.background = 'transparent';
                    }}
                  >
                    <Icon size={18} />
                    <span>{page.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Added padding-top to account for fixed navbar */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem', paddingTop: 'calc(4rem + 2rem)' }}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'paintings' && <PaintingsPage />}
        {currentPage === 'award-photos' && <AwardPhotosPage />}
        {currentPage === 'guestbook' && <GuestbookPage />}
        {currentPage === 'admin' && <AdminPage isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
        {currentPage === 'pages' && <PagesListPage />}
      </main>

      <footer style={{ background: '#0f172a', color: 'white', padding: '1.5rem 0', marginTop: '3rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', margin: 0 }}>A loving tribute to an extraordinary artist</p>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}} />
    </div>
  );
}