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
           
        </div>
    );
};

export default PagesMenu;