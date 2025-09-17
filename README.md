<!-- markdownlint-disable MD033 MD041 -->
<div align="center">

# Aptilume

**AI-Powered Aptitude Testing Platform**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime-orange?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-Blazing--Fast-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Server-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

**Transform the way you assess technical aptitude with our cutting-edge platform**

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Contributing](#-contributing)

</div>

## 🌟 Why Aptilume?

Aptilume revolutionizes technical aptitude testing by combining the power of AI with real-time assessment capabilities. Whether you're an educational institution, corporate trainer, or individual learner, Aptilume provides the tools to create, administer, and analyze assessments with unprecedented efficiency.

## 🚀 Key Features

### 🔐 **Secure Authentication**
- Multi-provider OAuth (Google, GitHub) + Email/Password
- Role-based access control (Student, Teacher, Admin)
- Session management with automatic timeout

### 📝 **Smart Quiz Management**
- Create, edit, and publish quizzes in seconds
- Multiple question types (MCQ, Coding Challenges, Subjective)
- Time-bound assessments with auto-submission
- Real-time proctoring with camera/microphone monitoring

### 🤖 **AI-Powered Intelligence**
- **Personalized Quiz Generator** - Create custom quizzes based on topics and difficulty
- **Performance Analytics** - AI-driven insights into strengths and weaknesses
- **Admin Assistance** - AI tools for content creation and management

### 📊 **Comprehensive Analytics**
- Detailed result analysis with visual dashboards
- Progress tracking over time
- Comparative statistics and benchmarking
- Exportable reports for stakeholders

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Vite | Blazing-fast UI with modern components |
| **Styling** | TailwindCSS | Responsive, utility-first design |
| **Backend** | Node.js, Express | RESTful API and server logic |
| **Database** | Firebase Firestore | Real-time NoSQL data storage |
| **Auth** | Firebase Authentication | Secure user management |
| **AI** | OpenAI API | Intelligent quiz generation and analytics |
| **Deployment** | Firebase Hosting | Scalable, global CDN |

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

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SohamAI99/Aptilume.git
   cd aptilume
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # Frontend
   npm run dev
   
   # Backend (in a new terminal)
   cd server
   npm start
   ```

5. **Open your browser**
   - Frontend: http://localhost:4030
   - Backend API: http://localhost:5001

## 🎯 Use Cases

### 🏫 Educational Institutions
- Standardized testing
- Student assessment
- Progress monitoring

### 🏢 Corporate Training
- Employee skill evaluation
- Certification programs
- Recruitment screening

### 👨‍💻 Individual Learners
- Self-assessment
- Skill development
- Aptitude preparation

## 🔐 Security Features

- End-to-end encryption
- Secure authentication
- Role-based access control
- Input validation and sanitization
- Real-time threat monitoring

## 📱 Responsive Design

Aptilume works seamlessly across all devices:
- 🖥️ Desktop browsers
- 💻 Tablet devices
- 📱 Mobile phones

## 🤝 Contributing

We love contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape Aptilume
- Inspired by modern assessment platforms and educational technology
- Built with ❤️ for the developer community

---

<div align="center">
  
**Made with ❤️ by developers, for developers**

[Report Bug](https://github.com/SohamAI99/Aptilume/issues) · [Request Feature](https://github.com/SohamAI99/Aptilume/issues)

</div>
