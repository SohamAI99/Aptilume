# Aptilume - AI-Powered Quiz Platform

A production-ready, Firebase-powered SaaS web app with AI integration for technical aptitude testing and assessment.

## 🚀 Key Features

### ✅ Core Functionality
- **User Authentication**
  - Google, GitHub OAuth + Email/Password
  - Role-based access (Student, Teacher, Admin)
  - Secure session management
- **Quiz Management**
  - Create, edit, and publish quizzes
  - Multiple question types (MCQ, Coding, Subjective)
  - Time-bound assessments with auto-submit
- **Real-time Proctoring**
  - Camera and microphone monitoring
  - Tab-switch detection
  - Activity logging
- **Performance Analytics**
  - Detailed result analysis
  - Progress tracking
  - Comparative statistics

### ✅ AI Integration
- **Personalized AI Quiz Generator**
  - Topic-based question creation
  - Difficulty level customization
  - AI-generated questions stored in Firestore
- **AI Analytics**
  - Performance trend analysis
  - Weakness identification
  - Strength recognition
  - Personalized recommendations
- **Admin AI Assistance**
  - AI-powered admin tools
  - Document-to-quiz conversion
  - Intelligent suggestions

### ✅ Technical Excellence
- **Modern Tech Stack**
  - React 18 + Vite for blazing-fast frontend
  - Firebase for real-time database and auth
  - TailwindCSS for responsive UI
- **Scalable Architecture**
  - Component-based design
  - Reusable UI elements
  - Efficient state management
- **Production Ready**
  - PWA support for offline access
  - Comprehensive error handling
  - SEO optimization

## 📁 Project Structure

```
aptilume/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Generic UI components
│   │   ├── ai/             # AI components
│   │   └── ...             # Other component categories
│   ├── pages/              # Page components
│   │   ├── landing-page/   # Marketing landing page
│   │   ├── authentication-login-register/ # Auth flows
│   │   ├── student-dashboard/ # Student interface
│   │   ├── teacher-dashboard/ # Teacher interface
│   │   ├── admin-dashboard/   # Admin panel
│   │   ├── exam-interface/    # Test-taking UI
│   │   ├── quiz-rules-instructions/ # Pre-test info
│   │   ├── results-review/    # Results display
│   │   └── ...                # Other pages
│   ├── utils/              # Utility functions
│   │   ├── authService.js  # Authentication logic
│   │   ├── dbService.js    # Database operations
│   │   ├── firebase.js     # Firebase config
│   │   ├── aiService.js    # AI service
│   │   └── ...             # Other utilities
│   └── styles/             # Global styles
├── server/                 # Backend API
│   ├── routes/             # API endpoints
│   ├── config/             # Configuration files
│   └── ...                 # Other backend files
└── ...                     # Config files
```

## 🛠️ Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start development server: `npm start`

## 🎯 Target Use Cases

- **Educational Institutions**
  - Standardized testing
  - Student assessment
  - Progress monitoring
- **Corporate Training**
  - Employee skill evaluation
  - Certification programs
  - Recruitment screening
- **Individual Learners**
  - Self-assessment
  - Skill development
  - Aptitude preparation

## 📱 Responsive Design

Fully responsive interface that works seamlessly across:
- Desktop browsers
- Tablet devices
- Mobile phones

## 🔐 Security

- Firebase Authentication
- Secure data transmission
- Role-based access control
- Input validation and sanitization

## 📈 Performance

- Optimized bundle size
- Efficient rendering
- Caching strategies
- Lazy loading components

## 🔄 Real-time Features

- Live test updates
- Instant result calculation
- Real-time proctoring alerts
- Collaborative features

## 🎨 UI/UX Highlights

- Modern, clean interface
- Intuitive navigation
- Consistent design language
- Accessible components

## 🚀 Deployment

- Firebase Hosting ready
- CI/CD pipeline setup
- Environment-specific configs
- Monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT License - see LICENSE file for details