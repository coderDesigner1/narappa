import React, {useState} from 'react';
import { Lock, Upload, Plus, Award, Image, Edit } from 'lucide-react';
import AuthService from '../services/AuthService';

import ManagePaintings from '../components/ManagePaintings';
import ManageAwards from '../components/ManageAwards';
import ManagePhotos from '../components/ManagePhotos';
import PageBuilder from '../components/PageBuilder';
import ManagePages from '../components/ManagePages';


const AdminPage = ({ isAdmin, setIsAdmin }) => {
  const [view, setView] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:8080/api';

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', { username, password });
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.token) {
        console.log('Login successful!', data);
        AuthService.setToken(data.token);
        setIsAdmin(true);
        setView('dashboard');
        setError('');
      } else {
        console.log('Login failed:', data);
        setError(data.error || data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed: ' + err.message);
    }
  };

  const handleLogout = () => {
    AuthService.removeToken();
    setIsAdmin(false);
    setView('login');
    setUsername('');
    setPassword('');
  };

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock style={{ marginRight: '0.5rem' }} size={32} />
            Admin Login
          </h2>
          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#334155', fontWeight: '500', marginBottom: '0.5rem' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                style={{ width: '80%', padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }}
                placeholder="Enter username"
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#334155', fontWeight: '500', marginBottom: '0.5rem' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                style={{ width: '80%', padding: '0.5rem 1rem', border: '1px solid #cbd5e1', borderRadius: '0.5rem' }}
                placeholder="Enter password"
              />
            </div>
            <button
              onClick={handleLogin}
              style={{ width: '80%', background: '#1e293b', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'background 0.3s' }}
              onMouseEnter={(e) => e.target.style.background = '#334155'}
              onMouseLeave={(e) => e.target.style.background = '#1e293b'}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b' }}>Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{ background: '#dc2626', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
          onMouseEnter={(e) => e.target.style.background = '#b91c1c'}
          onMouseLeave={(e) => e.target.style.background = '#dc2626'}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setView('paintings')}
          style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            transition: 'all 0.3s',
            background: view === 'paintings' ? '#2563eb' : 'white',
            color: view === 'paintings' ? 'white' : '#1e293b',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => view !== 'paintings' && (e.currentTarget.style.background = '#f8fafc')}
          onMouseLeave={(e) => view !== 'paintings' && (e.currentTarget.style.background = 'white')}
        >
          <Image size={32} style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Manage Paintings</h3>
        </button>

        <button
          onClick={() => setView('awards')}
          style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            transition: 'all 0.3s',
            background: view === 'awards' ? '#2563eb' : 'white',
            color: view === 'awards' ? 'white' : '#1e293b',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => view !== 'awards' && (e.currentTarget.style.background = '#f8fafc')}
          onMouseLeave={(e) => view !== 'awards' && (e.currentTarget.style.background = 'white')}
        >
          <Award size={32} style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Manage Awards</h3>
        </button>

        <button
          onClick={() => setView('photos')}
          style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            transition: 'all 0.3s',
            background: view === 'photos' ? '#2563eb' : 'white',
            color: view === 'photos' ? 'white' : '#1e293b',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => view !== 'photos' && (e.currentTarget.style.background = '#f8fafc')}
          onMouseLeave={(e) => view !== 'photos' && (e.currentTarget.style.background = 'white')}
        >
          <Upload size={32} style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Manage Photos</h3>
        </button>

        <button
          onClick={() => setView('manage-pages')}
          style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            transition: 'all 0.3s',
            background: view === 'manage-pages' ? '#2563eb' : 'white',
            color: view === 'manage-pages' ? 'white' : '#1e293b',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => view !== 'manage-pages' && (e.currentTarget.style.background = '#f8fafc')}
          onMouseLeave={(e) => view !== 'manage-pages' && (e.currentTarget.style.background = 'white')}
        >
          <Edit size={32} style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Manage Pages</h3>
        </button>

        <button
          onClick={() => setView('page-builder')}
          style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            transition: 'all 0.3s',
            background: view === 'page-builder' ? '#2563eb' : 'white',
            color: view === 'page-builder' ? 'white' : '#1e293b',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => view !== 'page-builder' && (e.currentTarget.style.background = '#f8fafc')}
          onMouseLeave={(e) => view !== 'page-builder' && (e.currentTarget.style.background = 'white')}
        >
          <Plus size={32} style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Page Builder</h3>
        </button>

        
      </div>

      {view === 'paintings' && <ManagePaintings />}
      {view === 'awards' && <ManageAwards />}
      {view === 'photos' && <ManagePhotos />}
      {view === 'manage-pages' && <ManagePages />}
      {view === 'page-builder' && <PageBuilder />}
      
    </div>
  );
};

export default AdminPage;