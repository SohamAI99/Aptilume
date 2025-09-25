import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title = 'Aptilume - AI-Powered Quiz Platform', 
  description = 'Prepare for technical interviews with our AI-powered quiz platform. Practice coding, algorithms, system design, and more.', 
  keywords = 'technical interview, coding practice, algorithms, system design, quiz, AI', 
  author = 'Aptilume Team',
  url = '',
  image = '/logo512.png',
  type = 'website'
}) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Aptilume" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url} />
      
      {/* Performance optimizations */}
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <meta name="theme-color" content="#000000" />
    </Helmet>
  );
};

export default SEO;