import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Calendar } from 'lucide-react';

const PagesMenu = ({ onPageSelect }) => {
    const [years, setYears] = useState([]);
    const [expandedYear, setExpandedYear] = useState(null);
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
            setLoading(false);
        } catch (err) {
            console.error('Error fetching years:', err);
            setLoading(false);
        }
    };

    const toggleYear = async (year) => {
        if (expandedYear === year) {
            setExpandedYear(null);
        } else {
            setExpandedYear(year);
            if (!yearPages[year]) {
                try {
                    const response = await fetch(`${API_BASE_URL}/pages/year/${year}`);
                    const data = await response.json();
                    setYearPages({ ...yearPages, [year]: data });
                } catch (err) {
                    console.error('Error fetching pages for year:', err);
                }
            }
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
        return <div style={{ padding: '1rem', color: '#64748b' }}>Loading...</div>;
    }

    if (years.length === 0) {
        return <div style={{ padding: '1rem', color: '#64748b', fontStyle: 'italic' }}>No pages available yet</div>;
    }

    return (
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} />
                Archives
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {years.map(year => {
                    const isExpanded = expandedYear === year;
                    const pages = yearPages[year] || [];
                    const groupedPages = groupByMonth(pages);

                    return (
                        <div key={year}>
                            <button
                                onClick={() => toggleYear(year)}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    background: isExpanded ? '#f1f5f9' : 'transparent',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    color: '#1e293b',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => !isExpanded && (e.target.style.background = '#f8fafc')}
                                onMouseLeave={(e) => !isExpanded && (e.target.style.background = 'transparent')}
                            >
                                <span>{year}</span>
                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>

                            {isExpanded && (
                                <div style={{ marginLeft: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    {Object.keys(groupedPages).sort((a, b) => b - a).map(month => (
                                        <div key={month} style={{ marginBottom: '0.5rem' }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                                                {months[month - 1]}
                                            </div>
                                            {groupedPages[month].map(page => (
                                                <button
                                                    key={page.id}
                                                    onClick={() => onPageSelect(page)}
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
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PagesMenu;