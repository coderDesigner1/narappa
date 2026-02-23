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
            {bioParagraphs.map((item, index) => (
              <div key={item.id} style={{ marginBottom: index < bioParagraphs.length - 1 ? '1rem' : '0' }}>
                {item.page && (
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginTop: index > 0 ? '2rem' : '0',
                    marginBottom: '0.75rem'
                  }}>
                    {item.header === 1 && item.paragraph}
                  </h2>
                )}
                <p style={{ margin: 0 }}>
                  {item.paragraph}
                </p>
              </div>
            ))}
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