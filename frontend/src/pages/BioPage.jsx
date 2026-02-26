import React, { useState, useEffect } from 'react';
import { FileText, Calendar } from 'lucide-react';
import PageViewer from '../components/PageViewer';

const BioPage = () => {
  
  const [bioParagraphs, setBioParagraphs] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
   
    // Fetch bio paragraphs
    fetch(`${API_BASE_URL}/bio-paragraphs`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setBioParagraphs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bio paragraphs:', err);
        setLoading(false);
      });
  }, []);

   return (
    <>
      {/* Bio Content Section */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto 4rem',
        padding: '3rem 2rem',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem'
        }}>
          Biography
        </h1>
        
        {loading ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Loading biography...</p>
        ) : bioParagraphs.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No biography content available.</p>
        ) : (
          <div style={{
            fontSize: '1rem',
            color: '#4b5563',
            lineHeight: '1.8'
          }}>
            {(() => {
              // Group by page
              const pages = bioParagraphs.reduce((acc, item) => {
                const page = item.page ?? 'default';
                if (!acc[page]) acc[page] = [];
                acc[page].push(item);
                return acc;
              }, {});

              return Object.entries(pages).map(([page, items], pageIndex) => {
                // Find header and sort paragraphs by order
                const header = items.find(item => item.header === '1');
                const paragraphs = items
                                  .filter(item => item.header !== '1')
                                  .sort((a, b) => a.order - b.order);

                return (
                  <div key={page}>
                    {pageIndex > 0 && <hr style={{ margin: '2rem 0', borderColor: '#e5e7eb' }} />}

                    {header && (
                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#1f2937',
                        marginBottom: '0.75rem'
                      }}>
                        {header.paragraph}
                      </h2>
                    )}

                    {paragraphs.map(item => (
                      <p key={item.id} style={{ marginBottom: '1rem' }}>
                        {item.paragraph}
                      </p>
                    ))}
                  </div>
                );
              });
            })()}
          </div>
        )}
      </section>

      {/* PageViewer Modal */}
      {selectedPage && (
        <PageViewer
          page={selectedPage}
          onClose={() => setSelectedPage(null)}
        />
      )}
    </>
  );
};

export default BioPage;
