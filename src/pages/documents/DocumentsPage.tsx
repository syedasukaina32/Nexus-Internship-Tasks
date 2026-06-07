import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Share2, PenTool, X, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useDropzone } from 'react-dropzone';
import SignatureCanvas from 'react-signature-canvas';
import toast from 'react-hot-toast';

type DocStatus = 'Draft' | 'In Review' | 'Signed';

interface DocumentType {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  status: DocStatus;
}

const initialDocuments: DocumentType[] = [
  {
    id: 1,
    name: 'Pitch Deck 2024.pdf',
    type: 'PDF',
    size: '2.4 MB',
    lastModified: '2024-02-15',
    shared: true,
    status: 'In Review'
  },
  {
    id: 2,
    name: 'Term Sheet.pdf',
    type: 'PDF',
    size: '1.8 MB',
    lastModified: '2024-02-10',
    shared: false,
    status: 'Draft'
  },
  {
    id: 3,
    name: 'NDA.pdf',
    type: 'PDF',
    size: '3.2 MB',
    lastModified: '2024-02-05',
    shared: true,
    status: 'Signed'
  }
];

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[]>(initialDocuments);
  const [signingDoc, setSigningDoc] = useState<number | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const newDocs = acceptedFiles.map((file, idx) => ({
      id: Date.now() + idx,
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'DOCUMENT',
      size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
      lastModified: new Date().toISOString().split('T')[0],
      shared: false,
      status: 'Draft' as DocStatus
    }));
    setDocuments([...newDocs, ...documents]);
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getStatusBadgeVariant = (status: DocStatus) => {
    switch (status) {
      case 'Signed': return 'success';
      case 'In Review': return 'warning';
      default: return 'gray';
    }
  };

  const handleSign = () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error('Please provide a signature');
      return;
    }
    setDocuments(docs => docs.map(d => d.id === signingDoc ? { ...d, status: 'Signed' } : d));
    toast.success('Document signed successfully!');
    setSigningDoc(null);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">Securely manage, share, and sign your contracts</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-4">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-white hover:border-primary-400'}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Drop files here or click to upload</h3>
            <p className="text-sm text-gray-500 mt-1">Supports PDF, DOCX, XLSX (Max 50MB)</p>
          </div>
        </div>
        
        {/* Document list */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Contracts & Documents</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border border-gray-100 hover:border-primary-200 rounded-lg transition-colors duration-200 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        <FileText size={24} className={doc.status === 'Signed' ? 'text-success-500' : 'text-primary-600'} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </h3>
                          <Badge variant={getStatusBadgeVariant(doc.status)} size="sm">
                            {doc.status}
                          </Badge>
                          {doc.shared && <Badge variant="secondary" size="sm">Shared</Badge>}
                        </div>
                        
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Updated {doc.lastModified}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {doc.status !== 'Signed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSigningDoc(doc.id)}
                          leftIcon={<PenTool size={16} />}
                        >
                          Sign
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" aria-label="Download"><Download size={18} /></Button>
                      <Button variant="ghost" size="sm" aria-label="Share"><Share2 size={18} /></Button>
                      <Button variant="ghost" size="sm" className="text-error-600 hover:text-error-700" aria-label="Delete">
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Signature Modal */}
      {signingDoc !== null && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-in">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold flex items-center text-gray-900">
                <PenTool className="mr-2 text-primary-600" size={20} />
                E-Signature Required
              </h3>
              <button onClick={() => setSigningDoc(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Please draw your signature below to legally sign the document 
                <strong className="text-gray-900 ml-1">{documents.find(d => d.id === signingDoc)?.name}</strong>.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <SignatureCanvas 
                  ref={sigCanvas} 
                  penColor="blue"
                  canvasProps={{ className: 'w-full h-48 cursor-crosshair' }} 
                />
              </div>
              <div className="flex justify-end mt-2">
                <button onClick={() => sigCanvas.current?.clear()} className="text-sm text-gray-500 hover:text-gray-700">
                  Clear Signature
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSigningDoc(null)}>Cancel</Button>
              <Button leftIcon={<CheckCircle size={18} />} onClick={handleSign}>
                Sign Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};