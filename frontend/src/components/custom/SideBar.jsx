import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const SideBar = ({ onPageSelect }) => {
  const [years, setYears] = useState([]);
  const [yearPages, setYearPages] = useState({});
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pages/years`);
      const data = await response.json();
      setYears(data);
      
      // Fetch pages for all years by default
      const pagesPromises = data.map(year =>
        fetch(`${API_BASE_URL}/pages/year/${year}`).then(res => res.json())
      );
      
      const allPages = await Promise.all(pagesPromises);
      const pagesMap = {};
      data.forEach((year, index) => {
        pagesMap[year] = allPages[index];
      });
      
      setYearPages(pagesMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching years:', err);
      setLoading(false);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const groupByMonth = (pages) => {
    const grouped = {};
    pages.forEach(page => {
      if (!grouped[page.month]) {
        grouped[page.month] = [];
      }
      grouped[page.month].push(page);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        right: 0,
        top: '4rem',
        bottom: 0,
        width: '300px',
        background: 'white',
        borderLeft: '1px solid #e2e8f0',
        padding: '1.5rem',
        overflowY: 'auto'
      }}>
        <div style={{ color: '#64748b' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: '4rem',
      bottom: 0,
      width: '300px',
      background: 'white',
      borderLeft: '1px solid #e2e8f0',
      padding: '1.5rem',
      overflowY: 'auto',
      boxShadow: '-2px 0 8px rgba(0,0,0,0.05)',
      zIndex: 100
    }}>
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Calendar size={20} />
        Archives
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {years.length === 0 ? (
          <p style={{ color: '#64748b', fontStyle: 'italic' }}>No pages available yet</p>
        ) : (
          years.map(year => {
            const pages = yearPages[year] || [];
            const groupedPages = groupByMonth(pages);

            return (
              <div key={year}>
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '0.75rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid #e2e8f0'
                }}>
                  {year}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.keys(groupedPages).sort((a, b) => b - a).map(month => (
                    <div key={month}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#64748b',
                        padding: '0.25rem 0',
                        marginBottom: '0.25rem'
                      }}>
                        {months[month - 1]}
                      </div>
                      {groupedPages[month].map(page => (
                        <button
                          key={page.id}
                          onClick={() => onPageSelect && onPageSelect(page)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.5rem 0.75rem',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '0.375rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            color: '#475569',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#f1f5f9';
                            e.target.style.color = '#1e293b';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#475569';
                          }}
                        >
                          {page.title}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SideBar;