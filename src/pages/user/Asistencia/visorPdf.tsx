import React from 'react';

const EmbeddedPDFViewer = ({ pdfData }: any) => {
    const embeddedPDF = `data:application/pdf;base64,${pdfData}`;
    console.log(pdfData)
    return (
        <div>
            <embed
                title="Embedded PDF Viewer"
                src={embeddedPDF}
                type="application/pdf"
                width="100vw"
                height="100vh"
            />
        </div>
    );
};

export default EmbeddedPDFViewer;