import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, Award, Image, MessageSquare, X, Lock, FileText, Camera, ScrollText, LogIn} from 'lucide-react';

import HomePage from './pages/HomePage';
import { LanguageProvider, LANGUAGES, useLanguage } from './context/LanguageContext';
import LanguageSwitcher from './components/custom/LanguageSwitcher';
import BioPage from './pages/BioPage';
import AwardPhotosPage from './pages/AwardPhotosPage';
import PaintingsPage from './pages/PaintingsPage';
import GuestbookPage from './pages/GuestbookPage';
import AdminPage from './pages/AdminPage';
import PagesListPage from './components/PagesListPage';
import AwardsPage from './pages/AwardsPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import Footer from './components/Footer';
import './mobile-fix.css';

// Inline language switcher for mobile menu
function MobileLanguageSwitcher({ onSelect }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div style={{ display: 'flex', gap: '0.5rem', paddingLeft: '0.25rem', flexWrap: 'wrap' }}>
      {LANGUAGES.map(lang => {
        const isActive = lang.flag === language;
        return (
          <button
            key={lang.flag}
            onClick={() => { setLanguage(lang.flag); onSelect(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              border: `2px solid ${isActive ? '#2563eb' : '#e5e7eb'}`,
              borderRadius: '0.5rem',
              background: isActive ? '#2563eb' : 'white',
              color: isActive ? 'white' : '#374151',
              cursor: 'pointer', fontSize: '0.875rem', fontWeight: isActive ? '700' : '400',
              transition: 'all 0.15s',
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '20px', height: '20px',
              background: isActive ? 'white' : '#1f2937',
              color: isActive ? '#2563eb' : 'white',
              borderRadius: '3px', fontSize: '0.65rem', fontWeight: '700',
            }}>
              {lang.flag}
            </span>
            {lang.nativeLabel}
            {isActive && <span style={{ fontSize: '0.75rem' }}>✓</span>}
          </button>
        );
      })}
    </div>
  );
}

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const pages = [
    { path: '/',  icon: ScrollText },
    { path: '/bio', label: 'Bio', icon: FileText },
    { path: '/awards', label: 'Awards & Shows', icon: Award },
    { path: '/paintings', label: 'Paintings', icon: Image },
    { path: '/award-photos', label: 'Photo Gallery', icon: Camera },
    { path: '/guestbook', label: 'Guestbook', icon: MessageSquare },
    { path: '/admin', label: 'Admin', icon: Lock }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      background: 'white', borderBottom: '1px solid #e5e7eb', zIndex: 1000
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* <img src="http://localhost:8080/uploads/logo.png" style={{ width: '35px', height: '35px' }} alt="logo" /> */}
            <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937', letterSpacing: '0.05em' }}>
              NARAPPA CHINTHA
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: 'none', gap: '2rem', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} className="desktop-nav">
            {pages.filter(p => p.path !== '/admin').map(page => {
              const active = isActive(page.path);
              return (
                <Link key={page.path} to={page.path} style={{
                  padding: '0.5rem 0', textDecoration: 'none',
                  color: active ? '#c17a4a' : '#6b7280',
                  fontSize: '0.95rem', fontWeight: '500',
                  borderBottom: active ? '2px solid #c17a4a' : 'none', transition: 'color 0.2s'
                }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#1f2937'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#6b7280'; }}
                >
                  {page.label}
                </Link>
              );
            })}
          </div>

          <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="desktop-nav">
            <LanguageSwitcher />
            <Link to="/admin" style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}>
              <LogIn size={20} />
            </Link>
          </div>

          <button style={{ display: 'block', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
            className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div style={{ paddingBottom: '1rem' }}>
            {pages.map(page => {
              const Icon = page.icon;
              const active = isActive(page.path);
              return (
                <Link key={page.path} to={page.path} onClick={() => setMobileMenuOpen(false)} style={{
                  width: '100%', textAlign: 'left', padding: '0.75rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  borderRadius: '0.5rem', marginBottom: '0.25rem',
                  background: active ? '#fef3e7' : 'transparent',
                  color: active ? '#c17a4a' : '#6b7280', textDecoration: 'none'
                }}>
                  <Icon size={18} />
                  <span>{page.label}</span>
                </Link>
              );
            })}

            {/* ── Language switcher row for mobile ── */}
            <div style={{
              marginTop: '0.5rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid #f3f4f6',
              paddingBottom: '0.25rem'
            }}>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: '600',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
                Language
              </p>
              <MobileLanguageSwitcher onSelect={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <LanguageProvider>
    <Router>
      {/* Outer wrapper: full viewport height, column flex so footer sticks to bottom */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
        <NavBar />

        {/* Main content grows to fill space — footer is pushed to bottom naturally */}
        <main style={{
          flex: 1,
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem',
          paddingTop: 'calc(80px + 2rem)'
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/bio" element={<BioPage />} />
            <Route path="/awards" element={<AwardsPage />} />
            <Route path="/paintings" element={<PaintingsPage />} />
            <Route path="/award-photos" element={<AwardPhotosPage />} />
            <Route path="/guestbook" element={<GuestbookPage />} />
            <Route path="/admin" element={<AdminPage isAdmin={isAdmin} setIsAdmin={setIsAdmin} />} />
            <Route path="/pages" element={<PagesListPage />} />
          </Routes>
        </main>

        {/* Footer sits directly after main — no gap, sticks to bottom on short pages */}
        <Footer onPrivacyClick={() => setShowPrivacy(true)} />

        {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}

        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 768px) {
            .desktop-nav { display: flex !important; }
            .mobile-menu-btn { display: none !important; }
          }
        `}} />
      </div>
    </Router>
    </LanguageProvider>
  );
}