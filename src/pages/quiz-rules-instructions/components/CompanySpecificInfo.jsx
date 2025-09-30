import React from 'react';
import { Code, Database, Brain, Users, CheckSquare, MessageSquare, Calculator, Code2 } from 'lucide-react';

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

  // Map icon names to actual Lucide icons
  const iconMap = {
    Code: Code,
    Database: Database,
    Brain: Brain,
    Users: Users,
    CheckSquare: CheckSquare,
    MessageSquare: MessageSquare,
    Calculator: Calculator,
    Code2: Code2
  };

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Company-Specific Assessment</h2>
            <p className="text-muted-foreground">
              Tailored evaluation based on {companyData?.name || 'company'} requirements
            </p>
          </div>
        </div>

        {/* Skill Areas */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Skill Areas Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillAreas.map((skill, index) => {
              const IconComponent = iconMap[skill.icon];
              return (
                <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center space-x-2 mb-3">
                    {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                    <h4 className="font-medium text-foreground">{skill.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{skill.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Weight: {skill.weight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Patterns */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Question Patterns</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {questionPatterns.map((pattern, index) => {
              const IconComponent = iconMap[pattern.icon];
              return (
                <div key={index} className="bg-muted/30 rounded-lg p-4 text-center border border-border">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/50 mb-3 ${pattern.color}`}>
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                  </div>
                  <h4 className="font-medium text-foreground mb-1">{pattern.type}</h4>
                  <p className="text-sm text-muted-foreground">{pattern.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySpecificInfo;