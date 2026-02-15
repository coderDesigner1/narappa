import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react';

const RichTextEditor = ({ initialContent, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, []);

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const buttons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ 
        display: 'flex', 
        gap: '0.25rem', 
        padding: '0.5rem', 
        background: '#f1f5f9', 
        borderRadius: '0.375rem',
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap'
      }}>
        {buttons.map(({ icon: Icon, command, title }) => (
          <button
            key={command}
            type="button"
            onClick={() => execCommand(command)}
            title={title}
            style={{
              padding: '0.375rem',
              background: 'white',
              border: '1px solid #cbd5e1',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#e0e7ff';
              e.target.style.borderColor = '#818cf8';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'white';
              e.target.style.borderColor = '#cbd5e1';
            }}
          >
            <Icon size={16} />
          </button>
        ))}
        
        <select
          onChange={(e) => execCommand('fontSize', e.target.value)}
          defaultValue="3"
          style={{
            padding: '0.375rem 0.5rem',
            background: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>

        <input
          type="color"
          onChange={(e) => execCommand('foreColor', e.target.value)}
          title="Text Color"
          style={{
            width: '40px',
            height: '32px',
            border: '1px solid #cbd5e1',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{
          minHeight: '150px',
          padding: '1rem',
          border: '1px solid #cbd5e1',
          borderRadius: '0.375rem',
          background: 'white',
          outline: 'none',
          lineHeight: '1.6',
          fontSize: '1rem',
          color: '#1e293b'
        }}
        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
      />
    </div>
  );
};

export default RichTextEditor;