import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Trophy, Award, Star, ThumbsUp, Target, User, Clock, Calendar, TrendingUp, CheckCircle, Users, Share2, Download } from 'lucide-react';

const ScoreHeroSection = ({ resultsData, onShare, onCertificate }) => {
  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-600',
      'A': 'text-green-600',
      'B+': 'text-blue-600',
      'B': 'text-blue-600',
      'C': 'text-yellow-600',
      'D': 'text-orange-600',
      'F': 'text-red-600'
    };
    return colors?.[grade] || 'text-muted-foreground';
  };

  const getPerformanceIcon = (percentage) => {
    if (percentage >= 90) return { icon: Trophy, color: 'text-yellow-500' };
    if (percentage >= 80) return { icon: Award, color: 'text-green-500' };
    if (percentage >= 70) return { icon: Star, color: 'text-blue-500' };
    if (percentage >= 60) return { icon: ThumbsUp, color: 'text-purple-500' };
    return { icon: Target, color: 'text-orange-500' };
  };

  const performanceIcon = getPerformanceIcon(resultsData?.overall?.percentage);

  return (
    <div className="bg-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          {/* Performance Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-elevation-2 flex items-center justify-center">
              <performanceIcon.icon className={`h-10 w-10 ${performanceIcon?.color}`} />
            </div>
          </div>

          {/* Main Score */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
              {resultsData?.overall?.percentage?.toFixed(1)}%
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <span className={`text-xl font-semibold ${getGradeColor(resultsData?.overall?.grade)}`}>
                Grade {resultsData?.overall?.grade}
              </span>
              <span className="text-muted-foreground">
                {resultsData?.overall?.score}/{resultsData?.overall?.totalMarks} marks
              </span>
            </div>
          </div>

          {/* Exam Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {resultsData?.examTitle}
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{resultsData?.student?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Time: {Math.floor(resultsData?.timeSpent / 3600)}h {Math.floor((resultsData?.timeSpent % 3600) / 60)}m</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{resultsData?.submissionTime?.toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-elevation-1">
              <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{resultsData?.overall?.rank}</div>
              <div className="text-xs text-muted-foreground">Rank</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-elevation-1">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-foreground">{resultsData?.overall?.percentile}%</div>
              <div className="text-xs text-muted-foreground">Percentile</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-elevation-1">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-foreground">
                {resultsData?.questions?.filter(q => q?.isCorrect)?.length}
              </div>
              <div className="text-xs text-muted-foreground">Correct</div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-elevation-1">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold text-foreground">
                {resultsData?.overall?.totalCandidates?.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Candidates</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              icon={<Share2 className="h-4 w-4" />}
              iconPosition="left"
              onClick={onShare}
            >
              Share Achievement
            </Button>
            
            {resultsData?.overall?.percentage >= 60 && (
              <Button
                variant="success"
                icon={<Download className="h-4 w-4" />}
                iconPosition="left"
                onClick={onCertificate}
              >
                Download Certificate
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreHeroSection;