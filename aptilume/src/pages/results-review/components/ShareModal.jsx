import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ShareModal = ({ results, onClose }) => {
  const [shareMethod, setShareMethod] = useState('link');
  const [emailInput, setEmailInput] = useState('');
  const [message, setMessage] = useState('');

  const shareUrl = `${window?.location?.origin}/results-review?id=${results?.attemptId}`;
  
  const shareText = `🎉 Just completed ${results?.examTitle} with a score of ${results?.score}%! 
Ranked ${results?.percentile}th percentile. Check out my results on AptiLume.`;

  const handleCopyLink = async () => {
    try {
      await navigator?.clipboard?.writeText(shareUrl);
      setMessage('Link copied to clipboard!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to copy link');
    }
  };

  const handleEmailShare = () => {
    if (!emailInput?.trim()) {
      setMessage('Please enter an email address');
      return;
    }

    const subject = `${results?.examTitle} - Results`;
    const body = `Hi,

I wanted to share my recent exam results with you:

Exam: ${results?.examTitle}
Score: ${results?.score}%
Percentile: ${results?.percentile}th
Date: ${new Date(results?.submittedAt)?.toLocaleDateString()}

You can view the detailed results at: ${shareUrl}

Best regards!`;

    const mailtoLink = `mailto:${emailInput}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window?.open(mailtoLink);
    
    setMessage('Email client opened!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSocialShare = (platform) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    let shareUrlToOpen = '';

    switch (platform) {
      case 'twitter':
        shareUrlToOpen = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrlToOpen = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrlToOpen = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrlToOpen = `https://wa.me/?text=${encodedText} ${encodedUrl}`;
        break;
      default:
        return;
    }

    window?.open(shareUrlToOpen, '_blank', 'width=600,height=400');
    setMessage(`Shared on ${platform}!`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative glass-card rounded-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border/20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Share Your Results</h2>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Results Preview */}
          <div className="mb-6 p-4 bg-primary/10 rounded-xl border border-border/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">{results?.score}%</div>
              <div className="text-sm text-muted-foreground mb-2">{results?.examTitle}</div>
              <div className="text-xs text-muted-foreground">
                {results?.percentile}th Percentile • {new Date(results?.submittedAt)?.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Share Method Tabs */}
          <div className="flex p-1 bg-muted/30 rounded-lg mb-6">
            <button
              onClick={() => setShareMethod('link')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                shareMethod === 'link' ?'bg-white text-foreground shadow-sm' :'text-muted-foreground'
              }`}
            >
              Link
            </button>
            <button
              onClick={() => setShareMethod('email')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                shareMethod === 'email' ?'bg-white text-foreground shadow-sm' :'text-muted-foreground'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setShareMethod('social')}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                shareMethod === 'social' ?'bg-white text-foreground shadow-sm' :'text-muted-foreground'
              }`}
            >
              Social
            </button>
          </div>

          {/* Share Options */}
          {shareMethod === 'link' && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/20 rounded-lg border border-border/20">
                <div className="text-xs text-muted-foreground mb-2">Share Link:</div>
                <div className="text-sm text-foreground font-mono bg-white p-2 rounded border">
                  {shareUrl}
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                iconName="Copy"
                onClick={handleCopyLink}
              >
                Copy Link
              </Button>
            </div>
          )}

          {shareMethod === 'email' && (
            <div className="space-y-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="friend@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e?.target?.value)}
              />
              <Button
                variant="primary"
                fullWidth
                iconName="Mail"
                onClick={handleEmailShare}
              >
                Send Email
              </Button>
            </div>
          )}

          {shareMethod === 'social' && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialShare('twitter')}
                iconName="Twitter"
                className="h-12"
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('linkedin')}
                iconName="Linkedin"
                className="h-12"
              >
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('facebook')}
                iconName="Facebook"
                className="h-12"
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialShare('whatsapp')}
                iconName="MessageCircle"
                className="h-12"
              >
                WhatsApp
              </Button>
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mt-4 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={16} className="text-success" />
                <span className="text-sm text-success">{message}</span>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mt-6 p-3 bg-muted/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Icon name="Shield" size={14} className="text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                Your results will be shared publicly. Personal information and detailed answers are not included in shared results.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;