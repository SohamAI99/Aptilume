import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanySpecificInfo = ({ companyData }) => {
  const skillAreas = [
    {
      icon: 'Code',
      title: 'Programming Logic',
      description: 'Data structures, algorithms, and problem-solving patterns',
      weight: '35%'
    },
    {
      icon: 'Database',
      title: 'System Design',
      description: 'Scalability, architecture, and database concepts',
      weight: '25%'
    },
    {
      icon: 'Brain',
      title: 'Analytical Reasoning',
      description: 'Logical thinking and quantitative analysis',
      weight: '25%'
    },
    {
      icon: 'Users',
      title: 'Behavioral Scenarios',
      description: 'Leadership, teamwork, and communication skills',
      weight: '15%'
    }
  ];

  const questionPatterns = [
    {
      type: 'Multiple Choice',
      count: '15-20 questions',
      icon: 'CheckSquare',
      color: 'text-primary'
    },
    {
      type: 'Code Analysis',
      count: '8-12 questions',
      icon: 'Code2',
      color: 'text-secondary'
    },
    {
      type: 'Scenario Based',
      count: '5-8 questions',
      icon: 'MessageSquare',
      color: 'text-accent'
    },
    {
      type: 'Numerical',
      count: '3-5 questions',
      icon: 'Calculator',
      color: 'text-success'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
            <Icon name="Building" size={24} color="white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">{companyData?.name} Preparation</h3>
            <p className="text-sm text-muted-foreground">{companyData?.category} • {companyData?.level} Level</p>
          </div>
        </div>
        
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Target" size={16} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-primary">Preparation Focus</p>
              <p className="text-xs text-muted-foreground mt-1">
                This test is specifically designed to match {companyData?.name}'s interview patterns and difficulty level.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Skill Areas */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} color="white" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">Key Skill Areas</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillAreas?.map((skill, index) => (
            <div key={index} className="bg-muted/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={skill?.icon} size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-foreground text-sm">{skill?.title}</h5>
                    <span className="text-xs font-medium text-primary">{skill?.weight}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{skill?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Question Patterns */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} color="white" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">Question Patterns</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {questionPatterns?.map((pattern, index) => (
            <div key={index} className="text-center p-4 bg-muted/20 rounded-lg">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/50 mb-3 ${pattern?.color}`}>
                <Icon name={pattern?.icon} size={20} />
              </div>
              <h5 className="font-medium text-foreground text-sm mb-1">{pattern?.type}</h5>
              <p className="text-xs text-muted-foreground">{pattern?.count}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Success Tips */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
            <Icon name="Lightbulb" size={20} color="white" />
          </div>
          <h4 className="text-lg font-semibold text-foreground">Success Tips</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Read questions carefully - {companyData?.name} questions often have subtle details
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Manage time effectively - spend more time on high-weightage sections
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Use the mark for review feature for questions you want to revisit
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Stay calm and think through each problem systematically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySpecificInfo;