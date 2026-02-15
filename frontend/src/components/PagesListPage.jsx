import React, { useState } from 'react';
import PagesMenu from '../components/PagesMenu';
import PageViewer from '../components/PageViewer';
import { Calendar } from 'lucide-react';

const PagesListPage = () => {
  const [selectedPage, setSelectedPage] = useState(null);

  if (selectedPage) {
    return <PageViewer page={selectedPage} onBack={() => setSelectedPage(null)} />;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', md: { gridTemplateColumns: '300px 1fr' }, gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ maxWidth: '300px' }}>
        <PagesMenu onPageSelect={setSelectedPage} />
      </div>
      
      <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>
          <Calendar size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ fontSize: '1.125rem' }}>Select a page from the archives to view</p>
        </div>
      </div>
    </div>
  );
};

export default PagesListPage;
