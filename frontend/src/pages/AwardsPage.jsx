import React, { useState, useEffect } from 'react'
import { Award } from 'lucide-react';

const AwardsPage = () => {

      const [awards, setAwards] = useState([]);

      const API_BASE_URL = 'http://localhost:8080/api';

       useEffect(() => {
          fetch(`${API_BASE_URL}/awards`)
            .then(res => res.json())
            .then(data => setAwards(data))
            .catch(err => console.error('Error:', err));
        }, []);

      // Group awards by organization
      const groupedAwards = awards.reduce((acc, award) => {
        const org = award.organization || 'Other';
        if (!acc[org]) {
          acc[org] = [];
        }
        acc[org].push(award);
        return acc;
      }, {});

  return (
    <div>
        <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3rem 2rem',
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {/* <h2 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '3rem',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem'
        }}>
          <Award style={{ color: '#c17a4a' }} size={32} />
          Awards & Recognition
        </h2> */}
        
        {awards.length === 0 ? (
          <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>Loading awards...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {Object.entries(groupedAwards).map(([organization, orgAwards]) => (
              <div key={organization}>
                {/* Organization Heading */}
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  marginBottom: '1.5rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '2px solid #c17a4a'
                }}>
                  {organization}
                </h3>
                
                {/* Awards under this organization */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {orgAwards.map(award => (
                    <div key={award.id} style={{ 
                      borderLeft: '3px solid #e5e7eb', 
                      paddingLeft: '1.25rem', 
                      paddingTop: '0.5rem', 
                      paddingBottom: '0.5rem',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = '#c17a4a'}
                    onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = '#e5e7eb'}
                    >
                      <h4 style={{ 
                        fontSize: '1.125rem', 
                        fontWeight: '600', 
                        color: '#1f2937', 
                        marginBottom: "-0.75rem",
                        marginTop: "-0.75rem",
                      }}>
                        {award.title} {award.year && `- ${award.year}`}
                      </h4>
                      {/* <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{award.year}</p>
                      {award.description && (
                        <p style={{ 
                          color: '#6b7280', 
                          marginTop: '0.5rem', 
                          lineHeight: '1.6',
                          fontSize: '0.95rem'
                        }}>
                          {award.description}
                        </p>
                      )} */}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default AwardsPage