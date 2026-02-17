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
      {/* Hero Section */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '4rem', 
        alignItems: 'center',
        marginBottom: '6rem',
        minHeight: '500px'
      }}>
        {/* Left Content */}
        <div style={{ maxWidth: '500px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Narappa Chintha
          </h1>
          <p style={{ 
            fontSize: '1rem', 
            color: '#6b7280', 
            lineHeight: '1.8',
            marginBottom: '2rem',
            textAlign: 'justify'
          }}>
            "Defining our own reality is a deeply personal and subjective experience. While we may never be able to know everything, we can strive to be open to new ideas and perspectives, and to seek out knowledge and experiences that challenge and broaden our understanding of the world around us. By doing so, we can create a more inclusive and diverse reality that reflects the richness and complexity of the human experience."
          </p>
          <button style={{
            background: '#1f2937',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#1f2937'}
          >
            Get in touch
            <span>→</span>
          </button>
        </div>

        {/* Right Image */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: 'linear-gradient(135deg, #c17a4a 0%, #8b5a3c 100%)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '0.25rem',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {/* Placeholder for painting image */}
              <div style={{
                width: '100%',
                height: '400px',
                background: 'linear-gradient(to bottom, #f3f4f6, #e5e7eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>
                Featured Artwork
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Lorem Ipsum Section */}
      <section style={{ 
        marginBottom: '6rem',
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto 6rem'
      }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem'
        }}>
          What is Lorem Ipsum?
        </h2>
        <p style={{
          fontSize: '0.95rem',
          color: '#1f2937',
          lineHeight: '1.8',
          textAlign: 'justify'
        }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </section>

      {/* Artist Statement Section */}
      <section style={{
        textAlign: 'center',
        maxWidth: '900px',
        margin: '0 auto 4rem',
        padding: '3rem 2rem',
        background: '#fafafa',
        borderRadius: '0.5rem'
      }}>
        <p style={{
          fontSize: '1.1rem',
          color: '#9ca3af',
          lineHeight: '1.8',
          fontStyle: 'italic',
          marginBottom: '2rem'
        }}>
          I am grateful for the opportunity to live and work in this inspiring environment, and I am committed to continuing my artistic journey, pushing the boundaries of my creativity, and sharing my unique world creations with audiences near and far.
        </p>
        <button style={{
          background: '#1f2937',
          color: 'white',
          padding: '1rem 2.5rem',
          border: 'none',
          borderRadius: '0.25rem',
          fontSize: '0.95rem',
          fontWeight: '500',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#374151'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#1f2937'}
        >
          SAY HELLO
        </button>
      </section>

      {/* Awards Section */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3rem 2rem',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '2rem',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <Award style={{ color: '#c17a4a' }} size={32} />
          Awards & Recognition
        </h2>
        {awards.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>Loading awards...</p>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {awards.map(award => (
              <div key={award.id} style={{ 
                borderLeft: '4px solid #c17a4a', 
                paddingLeft: '1.5rem', 
                paddingTop: '0.75rem', 
                paddingBottom: '0.75rem',
                background: '#fafafa',
                borderRadius: '0 0.25rem 0.25rem 0'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                  {award.title}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{award.organization}</p>
                <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>{award.year}</p>
                {award.description && (
                  <p style={{ color: '#4b5563', marginTop: '0.75rem', lineHeight: '1.6' }}>{award.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

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

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 768px) {
          section:first-of-type {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}} />
    </>
  );
};

export default HomePage;