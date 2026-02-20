import React, { useState, useEffect } from 'react';
import PageViewer from '../components/PageViewer';
import {  Calendar } from 'lucide-react';

const PagesListPage = () => {
   const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
   const API_BASE_URL = 'http://localhost:8080/api';

     useEffect(() => {
       fetch(`${API_BASE_URL}/pages/published`)
         .then(res => res.json())
         .then(data => {
           // Sort pages by year and month (most recent first)
           const sortedPages = data.sort((a, b) => {
             if (b.year !== a.year) return b.year - a.year;
             return b.month - a.month;
           });
           setPages(sortedPages);
         })
         .catch(err => console.error('Error:', err));
     }, []);
   
     const months = [
       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
     ];

  return (
    <>
      {/* Pages/Articles Section */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem 2rem'
      }}>
        {/* <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <FileText style={{ color: '#c17a4a' }} size={28} />
          Articles & Stories
        </h2> */}

        {pages.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Loading articles...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {pages.map(page => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(page)}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#c17a4a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  color: '#9ca3af',
                  fontSize: '0.875rem'
                }}>
                  <Calendar size={14} />
                  <span>{months[page.month - 1]} {page.year}</span>
                </div>
                
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '0.5rem',
                  lineHeight: '1.4'
                }}>
                  {page.title}
                </h3>
                
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  Click to read more about this article...
                </p>
              </button>
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

      {/* Responsive styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 768px) {
          .pages-list-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </>
  );
};

export default PagesListPage;
