import React, { useState, useEffect } from 'react';
import { FileText, Calendar } from 'lucide-react';
import PageViewer from '../components/PageViewer';

const BioPage = () => {
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
        
        <div style={{
          fontSize: '1rem',
          color: '#4b5563',
          lineHeight: '1.8'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            Narappa Chintha was born in [YEAR] in [PLACE], India. From an early age, he showed 
            a remarkable talent for visual arts, spending countless hours sketching the landscapes 
            and people around him. His passion for art led him to pursue formal training at 
            [ART INSTITUTION], where he studied under renowned masters.
          </p>
          
          <p style={{ marginBottom: '1rem' }}>
            Throughout his career spanning over three decades, he worked across multiple mediums 
            including watercolor, oil painting, lithography, acrylic, and woodcut. His work is 
            characterized by atmospheric landscapes that capture the essence of rural India, 
            with a particular focus on the interplay of light and weather conditions.
          </p>
          
          <p style={{ marginBottom: '1rem' }}>
            His paintings have been exhibited in galleries across India and internationally, 
            earning him numerous awards and recognition from art institutions. Beyond his 
            artistic achievements, he was known as a generous mentor who inspired countless 
            young artists to pursue their creative dreams.
          </p>
          
          <p>
            His legacy lives on through his beautiful body of work and the many lives he touched 
            through his art and teaching. This website serves as a tribute to his extraordinary 
            journey and artistic contributions.
          </p>
        </div>
      </section>

    </>
  );
};

export default BioPage;