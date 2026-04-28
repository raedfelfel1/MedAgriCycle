
import React from 'react';

const PDFViewer = ({ fileUrl, onClose }) => {
  return (
    <div className="pdf-viewer-overlay">
      <div className="pdf-viewer-container">
        <div className="pdf-viewer-header">
          <h3>Visualisation du PDF</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <div className="pdf-viewer-content">
          <iframe 
            src={fileUrl} 
            title="PDF Viewer"
            width="100%"
            height="100%"
            frameBorder="0"
          />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;