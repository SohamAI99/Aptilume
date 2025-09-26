import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import DecorativeBackground from '../../components/DecorativeBackground';

const LandingPage = () => {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    const handleSmoothScroll = (e) => {
      const href = e?.target?.getAttribute('href');
      if (href && href?.startsWith('#')) {
        e?.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>AptiLume - AI-Powered Aptitude Testing Platform</title>
        <meta 
          name="description" 
          content="Experience next-generation aptitude testing with AI-powered questions, real-time proctoring, and comprehensive analytics. Perfect for JEE, CET, and corporate assessments." 
        />
        <meta name="keywords" content="aptitude test, JEE preparation, CET exam, AI questions, online testing, proctoring" />
        <meta property="og:title" content="AptiLume - AI-Powered Aptitude Testing Platform" />
        <meta property="og:description" content="Master your aptitude with AI-powered testing platform trusted by 50K+ students worldwide." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://aptilume.com/landing-page" />
      </Helmet>

      <div className="min-h-screen bg-background relative">
        <DecorativeBackground />
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <div id="features">
          <FeaturesSection />
        </div>

        {/* CTA Section */}
        <CTASection />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;