import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Resources', icon: 'BookOpen' },
    { id: 'math', name: 'Mathematics', icon: 'Calculator' },
    { id: 'reasoning', name: 'Logical Reasoning', icon: 'Brain' },
    { id: 'verbal', name: 'Verbal Ability', icon: 'Type' },
    { id: 'technical', name: 'Technical Skills', icon: 'Code' },
    { id: 'interview', name: 'Interview Prep', icon: 'Users' }
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
      thumbnail: "https://images.unsplash.com/photo-1574144452472-9035f7371e1f?w=400&h=200&fit=crop",
      url: "#"
    },
    {
      id: 2,
      title: "Logical Reasoning Patterns",
      description: "Common patterns and strategies for solving logical reasoning problems",
      category: "reasoning",
      type: "video",
      duration: "25 min",
      difficulty: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop",
      url: "#"
    },
    {
      id: 3,
      title: "Verbal Ability Quick Tips",
      description: "Essential tips and tricks to improve your verbal ability scores",
      category: "verbal",
      type: "article",
      duration: "10 min read",
      difficulty: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop",
      url: "#"
    },
    {
      id: 4,
      title: "Data Interpretation Techniques",
      description: "Advanced techniques for interpreting complex data sets and charts",
      category: "math",
      type: "video",
      duration: "30 min",
      difficulty: "Advanced",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      url: "#"
    },
    {
      id: 5,
      title: "Coding Interview Preparation",
      description: "Essential coding concepts and algorithms for technical interviews",
      category: "technical",
      type: "pdf",
      duration: "45 min read",
      difficulty: "Intermediate",
      thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
      url: "#"
    },
    {
      id: 6,
      title: "Group Discussion Tips",
      description: "Effective strategies for participating in group discussions",
      category: "interview",
      type: "article",
      duration: "12 min read",
      difficulty: "Beginner",
      thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=200&fit=crop",
      url: "#"
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
      case 'pdf': return 'FileText';
      case 'video': return 'Play';
      case 'article': return 'File';
      default: return 'Book';
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

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Learning Resources</h1>
            <p className="text-muted-foreground">
              Access study materials, guides, and tips to improve your aptitude skills
            </p>
          </div>

          {/* Search Bar */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
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
                <Icon name={category.icon} size={16} />
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
                    <img 
                      src={resource.thumbnail} 
                      alt={resource.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                        <Icon name={getTypeIcon(resource.type)} size={12} className="inline mr-1" />
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
                      <Button size="sm" iconName="Download">
                        Access
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Resources;