import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import SideBar from '../components/custom/SideBar';
import PageViewer from '../components/PageViewer'
import Modal from '../components/custom/Modal';

const HomePage = () => {
  const [awards, setAwards] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetch(`${API_BASE_URL}/awards`)
      .then(res => res.json())
      .then(data => setAwards(data))
      .catch(err => console.error('Error:', err));
  }, []);

  const handlePageSelect = (page) => {
    setSelectedPage(page);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPage(null), 300);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <>
      <div style={{ maxWidth: '56rem', margin: '0 auto', paddingRight: '320px' }}>
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>The Artist's Journey</h2>
          <div style={{ fontSize: '1.125rem', color: '#334155', lineHeight: '1.75' }}>
            <p style={{ marginBottom: '1rem' }}>
              This is a tribute to an extraordinary artist whose passion and dedication to art
              has touched countless lives. His journey began in his early years, where a simple
              fascination with colors and forms grew into a lifelong commitment to artistic excellence.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              Throughout his career, he explored various mediums and styles, always pushing the
              boundaries of creativity. Each brushstroke tells a story, each canvas captures a moment
              of inspiration that reflects his unique vision of the world.
            </p>
            <p>
              His work has been recognized nationally and internationally, earning him numerous
              accolades and the respect of peers and art enthusiasts alike. But beyond the awards,
              his true legacy lies in the beauty he created and the inspiration he provided to others.
            </p>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
            <Award style={{ marginRight: '0.75rem', color: '#f59e0b' }} size={32} />
            Awards & Recognition
          </h2>
          {awards.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic' }}>Loading awards...</p>
          ) : (
            <div>
              {awards.map(award => (
                <div key={award.id} style={{ borderLeft: '4px solid #f59e0b', paddingLeft: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>{award.title}</h3>
                  <p style={{ color: '#475569' }}>{award.organization}</p>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{award.year}</p>
                  {award.description && (
                    <p style={{ color: '#334155', marginTop: '0.5rem' }}>{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <SideBar onPageSelect={handlePageSelect} />

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={selectedPage ? selectedPage.title : ''}
        maxWidth="1000px"
      >
        {selectedPage && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '2px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.875rem' }}>
                {months[selectedPage.month - 1]} {selectedPage.year}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {JSON.parse(selectedPage.content).map(block => (
                <div key={block.id}>
                  {block.type === 'text' ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: block.html || block.content || '' }}
                      style={{ lineHeight: '1.75', color: '#334155' }}
                    />
                  ) : (
                    <div style={{
                      display: 'flex',
                      justifyContent: block.position === 'center' ? 'center' : block.position === 'right' ? 'flex-end' : 'flex-start'
                    }}>
                      {block.url && (
                        <img
                          src={block.url}
                          alt="Content"
                          style={{
                            width: `${block.width}%`,
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default HomePage;