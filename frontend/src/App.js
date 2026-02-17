import React, { useState } from 'react';
import { Menu, Award, Image, MessageSquare, X, Lock, FileText, Camera, ScrollText} from 'lucide-react';

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
    { id: 'home', label: 'Story', icon: ScrollText },
    { id: 'paintings', label: 'Paintings', icon: Image },
    { id: 'award-photos', label: 'Photo Gallery', icon: Camera },
    { id: 'guestbook', label: 'Guestbook', icon: MessageSquare },
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'admin', label: 'Admin', icon: Lock }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <nav style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'white', 
        borderBottom: '1px solid #e5e7eb',
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                fontSize: '1.75rem', 
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #c17a4a 0%, #8b5a3c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                A
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', letterSpacing: '0.05em' }}>
                NARAPPA
              </div>
            </div>

            {/* Desktop Navigation - Centered */}
            <div style={{ display: 'none', gap: '2rem', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} className="desktop-nav">
              {pages.filter(p => p.id !== 'admin').map(page => {
                return (
                  <button
                    key={page.id}
                    onClick={() => setCurrentPage(page.id)}
                    style={{
                      padding: '0.5rem 0',
                      background: 'none',
                      border: 'none',
                      color: currentPage === page.id ? '#c17a4a' : '#6b7280',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      position: 'relative',
                      transition: 'color 0.2s',
                      borderBottom: currentPage === page.id ? '2px solid #c17a4a' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page.id) e.currentTarget.style.color = '#1f2937';
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page.id) e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    {page.label}
                  </button>
                );
              })}
            </div>

            {/* Right side icons */}
            <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
              <button style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.5rem' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <button 
                onClick={() => setCurrentPage('admin')}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.5rem' }}
              >
                <Lock size={20} />
              </button>
              <button style={{ 
                background: 'none', 
                border: 'none', 
                color: '#6b7280', 
                cursor: 'pointer', 
                padding: '0.5rem',
                position: 'relative'
              }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 3h18v18H3z"/>
                  <path d="m9 11 3 3 3-3"/>
                </svg>
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: '#c17a4a',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>0</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              style={{ display: 'block', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
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
                      background: currentPage === page.id ? '#fef3e7' : 'transparent',
                      color: currentPage === page.id ? '#c17a4a' : '#6b7280',
                      border: 'none',
                      cursor: 'pointer'
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
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem', paddingTop: 'calc(80px + 2rem)' }}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'paintings' && <PaintingsPage />}
        {currentPage === 'award-photos' && <AwardPhotosPage />}
        {currentPage === 'guestbook' && <GuestbookPage />}
        {currentPage === 'admin' && <AdminPage isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
        {currentPage === 'pages' && <PagesListPage />}
      </main>

      <footer style={{ background: '#1f2937', color: 'white', padding: '2rem 0', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.95rem' }}>A loving tribute to an extraordinary artist</p>
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