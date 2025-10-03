// Health check endpoint for Vercel
export default function handler(request, response) {
  response.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Aptilume Backend API',
    version: '1.0.0'
  });
}