import React from 'react';
import { X } from 'lucide-react';

const PrivacyPolicy = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 2000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '0.5rem',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10,
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
            Privacy Policy
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#6b7280', display: 'flex' }}
            onMouseEnter={e => e.currentTarget.style.color = '#1e293b'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', fontSize: '0.95rem', color: '#4b5563', lineHeight: '1.8' }}>

          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>1. Introduction</h3>
            <p>
              Welcome to this website. We respect your privacy and are committed to being transparent
              about the minimal data we collect when you visit. This policy explains what information
              is collected and how it is used.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>2. Information We Collect</h3>
            <p>
              We collect your <strong>IP address</strong> solely for the purpose of counting unique
              visitors to the site. This is a standard practice used to understand how many people
              visit the website. We do <strong>not</strong> use your IP address to identify you
              personally, track your browsing behaviour across other sites, or share it with
              third parties.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>3. How We Use This Information</h3>
            <p>
              The IP address collected is used exclusively to:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Count the number of unique visitors per day</li>
              <li>Display an aggregate visitor count on the website</li>
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              No personal profiles are created, and no data is used for advertising or marketing purposes.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>4. Data Retention</h3>
            <p>
              Visitor log records (IP address and date of visit) are retained for a period of
              12 months, after which they are deleted. No long-term personal data is stored.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>5. Cookies</h3>
            <p>
              This website does <strong>not</strong> use tracking cookies, advertising cookies,
              or any third-party analytics services such as Google Analytics.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>6. Third-Party Services</h3>
            <p>
              This website does not share your data with any third-party services. All data
              is stored on our own servers.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>7. Your Rights</h3>
            <p>
              Depending on your location, you may have the right to request deletion of any
              data associated with your IP address. To make such a request, please contact us
              directly via the contact information on this website.
            </p>
          </section>

          <section style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>8. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be reflected
              on this page with an updated date.
            </p>
          </section>

          <section>
            <h3 style={{ color: '#1e293b', fontWeight: '600', marginBottom: '0.5rem' }}>9. Contact</h3>
            <p>
              If you have any questions about this Privacy Policy, please reach out via the
              contact section of this website.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
