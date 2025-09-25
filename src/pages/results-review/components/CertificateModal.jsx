import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CertificateModal = ({ isOpen, onClose, resultsData }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF certificate
    const link = document.createElement('a');
    link.href = '#'; // Would be the certificate URL
    link.download = `AptiLume_Certificate_${resultsData?.examId}.pdf`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    onClose();
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-elevation-3 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="Award" size={20} className="mr-2 text-primary" />
              Certificate of Achievement
            </h2>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          </div>

          {/* Certificate Preview */}
          <div className="mb-6 bg-blue-50 p-8 rounded-lg border-2 border-dashed border-primary/30">
            <div className="text-center space-y-6">
              {/* Certificate Header */}
              <div>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Award" size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Certificate of Achievement</h3>
                <p className="text-muted-foreground">This certifies that</p>
              </div>

              {/* Student Name */}
              <div className="py-4 border-b-2 border-primary/20">
                <h4 className="text-3xl font-bold text-foreground">
                  {resultsData?.student?.name}
                </h4>
              </div>

              {/* Achievement Details */}
              <div className="space-y-2">
                <p className="text-muted-foreground">has successfully completed</p>
                <h5 className="text-xl font-semibold text-foreground">
                  {resultsData?.examTitle}
                </h5>
                <p className="text-muted-foreground">with a score of</p>
                <div className="text-2xl font-bold text-primary">
                  {resultsData?.overall?.percentage?.toFixed(1)}% 
                  <span className="text-lg text-muted-foreground ml-2">
                    (Grade {resultsData?.overall?.grade})
                  </span>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground pt-6">
                <div>
                  <p><strong>Date:</strong> {formatDate(resultsData?.submissionTime)}</p>
                  <p><strong>Certificate ID:</strong> CERT-{resultsData?.examId}</p>
                </div>
                <div>
                  <p><strong>Rank:</strong> #{resultsData?.overall?.rank}</p>
                  <p><strong>Percentile:</strong> {resultsData?.overall?.percentile}%</p>
                </div>
              </div>

              {/* AptiLume Branding */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                    <img src="/logo.png" alt="AptiLume" className="h-4 w-4 object-contain" />
                  </div>
                  <span className="font-bold text-primary">AptiLume</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  AI-Powered Exam Platform
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Features */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-3 flex items-center">
              <Icon name="CheckCircle" size={18} className="mr-2" />
              Certificate Features
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm text-green-700">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={14} />
                <span>Blockchain verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Globe" size={14} />
                <span>Globally recognized</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Download" size={14} />
                <span>High-quality PDF</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Link" size={14} />
                <span>Shareable link</span>
              </div>
            </div>
          </div>

          {/* Eligibility Check */}
          {resultsData?.overall?.percentage >= 60 ? (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Congratulations!</h4>
                  <p className="text-sm text-blue-700">
                    You've scored above the minimum requirement (60%) and are eligible for this certificate.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Certificate Not Available</h4>
                  <p className="text-sm text-orange-700">
                    You need to score at least 60% to be eligible for a certificate. 
                    Current score: {resultsData?.overall?.percentage?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            
            {resultsData?.overall?.percentage >= 60 && (
              <>
                <Button
                  variant="outline"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => window.open('#', '_blank')} // Would open certificate preview
                >
                  Preview
                </Button>
                
                <Button
                  variant="success"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleDownload}
                >
                  Download Certificate
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;