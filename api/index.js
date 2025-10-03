// Main API entry point for Vercel
export default function handler(request, response) {
  response.status(200).json({ 
    message: 'Aptilume Backend API is running!',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/health',
      '/api/users',
      '/api/quizzes',
      '/api/attempts',
      '/api/results',
      '/api/ai'
    ]
  });
}