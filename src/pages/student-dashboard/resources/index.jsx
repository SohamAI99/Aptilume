import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Calculator, Brain, Type, Code, Users, FileText, Play, File, ArrowLeft, Download } from 'lucide-react';
import Button from '../../../components/ui/Button';
import StudentNavigation from '../components/StudentNavigation';
import AccountSection from '../../../components/ui/AccountSection';
import * as authService from '../../../utils/authService';
import { listenToUser } from '../../../utils/dbService';

const Resources = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        setLoading(false);
        
        // Listen to user data for real-time updates
        if (user?.uid) {
          const unsubscribeUser = listenToUser(user.uid, (userData) => {
            if (userData) {
              setCurrentUser({
                ...user,
                ...userData
              });
            }
          });
          
          return () => {
            unsubscribeUser();
          };
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'All Resources', icon: <BookOpen size={16} /> },
    { id: 'math', name: 'Mathematics', icon: <Calculator size={16} /> },
    { id: 'reasoning', name: 'Logical Reasoning', icon: <Brain size={16} /> },
    { id: 'verbal', name: 'Verbal Ability', icon: <Type size={16} /> },
    { id: 'technical', name: 'Technical Skills', icon: <Code size={16} /> },
    { id: 'interview', name: 'Interview Prep', icon: <Users size={16} /> }
  ];

  const resources = [
    {
      id: 1,
      title: "Quantitative Aptitude Basics",
      description: "Fundamental concepts and formulas for quantitative aptitude tests",
      category: "math",
      type: "pdf",
      duration: "15 min read",
      difficulty: "Beginner",
      thumbnail: "/logo.png", // Use local logo instead of external image
      url: "/pdfs/Quantitative_Aptitude_Basics.pdf"
    },
    {
      id: 2,
      title: "Logical Reasoning Patterns",
      description: "Common patterns and strategies for solving logical reasoning problems",
      category: "reasoning",
      type: "video",
      duration: "25 min",
      difficulty: "Intermediate",
      thumbnail: "/logo.png", // Use local logo instead of external image
      url: "https://www.youtube.com/playlist?list=PLpyc33gOcbVADMKqylI__O_O_RMeHTyNK"
    },
    {
      id: 3,
      title: "Verbal Ability Quick Tips",
      description: "Essential tips and tricks to improve your verbal ability scores",
      category: "verbal",
      type: "article",
      duration: "10 min read",
      difficulty: "Beginner",
      thumbnail: "/logo.png", // Use local logo instead of external image
      url: "https://www.youtube.com/playlist?list=PLpyc33gOcbVBbD8Vfy-gCbivjSSHbMpUX"
    },
    {
      id: 4,
      title: "Data Interpretation Techniques",
      description: "Advanced techniques for interpreting complex data sets and charts",
      category: "math",
      type: "video",
      duration: "30 min",
      difficulty: "Advanced",
      thumbnail: "/logo.png", // Use local logo instead of external image
      url: "https://youtu.be/f_81iD62SWU?si=_JBjrwiEfahlnpiQ"
    },
    {
      id: 5,
      title: "Coding Interview Preparation",
      description: "Essential coding concepts and algorithms for technical interviews",
      category: "technical",
      type: "pdf",
      duration: "45 min read",
      difficulty: "Intermediate",
      thumbnail: "/logo.png", // Use local logo instead of external image
      url: "/pdfs/Coding_Interview_Preparation.pdf"
    },
    {
      id: 6,
      title: "Group Discussion Tips",
      description: "Effective strategies for participating in group discussions",
      category: "interview",
      type: "article",
      duration: "12 min read",
      difficulty: "Beginner",
      thumbnail: "/logo.png", // Use local logo instead of external image
      url: "https://youtu.be/_f9_6ZM-Qug?si=hwLr3WDwjlYtmhd9"
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText size={12} />;
      case 'video': return <Play size={12} />;
      case 'article': return <File size={12} />;
      default: return <BookOpen size={12} />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'pdf': return 'bg-error/20 text-error';
      case 'video': return 'bg-accent/20 text-accent';
      case 'article': return 'bg-primary/20 text-primary';
      default: return 'bg-muted/20 text-foreground';
    }
  };

  // Function to handle resource access
  const handleResourceAccess = (url, type) => {
    if (type === 'pdf') {
      // For PDFs, open in new tab
      window.open(url, '_blank');
    } else {
      // For other resources, open in new tab
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading resources...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <StudentNavigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Resources</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
      
        <main className="flex-1 pt-6">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Learning Resources</h1>
                  <p className="text-muted-foreground">
                    Access study materials, guides, and tips to improve your aptitude skills
                  </p>
                </div>
                {/* Removed Back to Dashboard button */}
              </div>

              {/* Search Bar */}
              <div className="glass-card rounded-2xl p-6 mb-8">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources by title or description..."
                    className="w-full glass-card border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-3 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      activeCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    {category.icon}
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Resources Grid */}
              {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <div key={resource.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <div className="w-full h-48 bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center">
                          <img 
                            src={resource.thumbnail} 
                            alt={resource.title} 
                            className="max-h-32 object-contain"
                          />
                        </div>
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                            <span className="inline mr-1">{getTypeIcon(resource.type)}</span>
                            {resource.type}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-black/50 text-white">
                            {resource.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{resource.duration}</span>
                          <Button 
                            size="sm" 
                            icon={<Download size={16} />}
                            onClick={() => handleResourceAccess(resource.url, resource.type)}
                          >
                            Access
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <BookOpen size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or category filter
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Resources;