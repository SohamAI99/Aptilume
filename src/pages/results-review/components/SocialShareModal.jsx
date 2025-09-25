import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SocialShareModal = ({ isOpen, onClose, resultsData }) => {
  const [shareText, setShareText] = useState(
    `Just scored ${resultsData?.overall?.percentage?.toFixed(1)}% on ${resultsData?.examTitle}! 🎉 #AptiLume #ExamSuccess`
  );
  const [privacySettings, setPrivacySettings] = useState({
    showScore: true,
    showRank: false,
    showSubjects: true
  });

  if (!isOpen) return null;

  const generateShareContent = () => {
    let content = `I just completed ${resultsData?.examTitle} on AptiLume! `;
    
    if (privacySettings?.showScore) {
      content += `Scored ${resultsData?.overall?.percentage?.toFixed(1)}% `;
    }
    
    if (privacySettings?.showRank) {
      content += `(Rank #${resultsData?.overall?.rank}) `;
    }
    
    content += `🚀 #AptiLume #ExamPrep`;
    
    return content;
  };

  const shareOptions = [
    { 
      platform: 'Twitter', 
      icon: 'Twitter', 
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(generateShareContent())}`
    },
    { 
      platform: 'LinkedIn', 
      icon: 'Linkedin', 
      color: 'bg-blue-700 hover:bg-blue-800',
      url: `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location?.href)}`
    },
    { 
      platform: 'Facebook', 
      icon: 'Facebook', 
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location?.href)}`
    },
    { 
      platform: 'WhatsApp', 
      icon: 'MessageCircle', 
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(generateShareContent())}`
    }
  ];

  const handleShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(generateShareContent());
    // Show toast notification here
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-elevation-3 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="Share2" size={20} className="mr-2 text-primary" />
              Share Achievement
            </h2>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          </div>

          {/* Achievement Preview */}
          <div className="mb-6 p-4 bg-primary/10 rounded-lg border">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="Trophy" size={32} className="text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {resultsData?.overall?.percentage?.toFixed(1)}% Score Achieved!
              </h3>
              <p className="text-sm text-muted-foreground">
                {resultsData?.examTitle}
              </p>
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">Privacy Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Show score</span>
                <input
                  type="checkbox"
                  checked={privacySettings?.showScore}
                  onChange={(e) => setPrivacySettings(prev => ({ ...prev, showScore: e?.target?.checked }))}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Show rank</span>
                <input
                  type="checkbox"
                  checked={privacySettings?.showRank}
                  onChange={(e) => setPrivacySettings(prev => ({ ...prev, showRank: e?.target?.checked }))}
                  className="rounded"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Show subjects</span>
                <input
                  type="checkbox"
                  checked={privacySettings?.showSubjects}
                  onChange={(e) => setPrivacySettings(prev => ({ ...prev, showSubjects: e?.target?.checked }))}
                  className="rounded"
                />
              </label>
            </div>
          </div>

          {/* Share Text Preview */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-2">Share Message</h4>
            <div className="p-3 bg-muted/50 rounded-lg border text-sm">
              {generateShareContent()}
            </div>
          </div>

          {/* Share Options */}
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">Share on</h4>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions?.map((option) => (
                <Button
                  key={option?.platform}
                  variant="outline"
                  onClick={() => handleShare(option?.url)}
                  className={`${option?.color} text-white border-0 hover:text-white`}
                  iconName={option?.icon}
                  iconPosition="left"
                >
                  {option?.platform}
                </Button>
              ))}
            </div>
          </div>

          {/* Copy Link */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Copy"
              iconPosition="left"
              onClick={copyToClipboard}
              className="flex-1"
            >
              Copy Message
            </Button>
            <Button
              variant="default"
              onClick={onClose}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal;