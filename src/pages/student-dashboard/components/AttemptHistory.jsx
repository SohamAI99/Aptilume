import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getAttemptsByUser } from '../../../utils/dbService';
import * as authService from '../../../utils/authService';

const AttemptHistory = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          const userAttempts = await getAttemptsByUser(user.uid, 50);
          setAttempts(userAttempts);
        }
      } catch (error) {
        console.error('Error fetching attempts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success';
      case 'in-progress': return 'bg-warning/10 text-warning';
      case 'not-started': return 'bg-muted/10 text-muted-foreground';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      default: return 'Unknown';
    }
  };

  const filteredAttempts = filter === 'all' 
    ? attempts 
    : attempts.filter(attempt => attempt.status === filter);

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Attempt History</h2>
        {/* Removed the back button since this is now properly integrated into the dashboard */}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold">Your Quiz Attempts</h3>
            <p className="text-muted-foreground text-sm">View your quiz attempt history and results</p>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            >
              <option value="all">All Attempts</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No attempts found</h3>
            <p className="text-muted-foreground mb-4">
              {filter === 'all' 
                ? "You haven't taken any quizzes yet." 
                : `You don't have any ${filter.replace('-', ' ')} attempts.`}
            </p>
            <Button onClick={() => navigate('/student-dashboard')}>
              Take a Quiz
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Quiz Title</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 font-medium">Questions</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Score</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{attempt.quizTitle || 'Untitled Quiz'}</div>
                      <div className="text-sm text-muted-foreground">{attempt.company || 'General'}</div>
                    </td>
                    <td className="py-3 px-4">{formatDate(attempt.startedAt)}</td>
                    <td className="py-3 px-4">{attempt.duration || '—'} min</td>
                    <td className="py-3 px-4">{attempt.questionCount || 0}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(attempt.status)}`}>
                        {getStatusText(attempt.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {attempt.status === 'completed' ? (
                        <span className="font-medium">
                          {attempt.score !== undefined ? `${attempt.score}%` : '—'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {attempt.status === 'completed' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/results-review/${attempt.id}`)}
                        >
                          View Results
                        </Button>
                      ) : attempt.status === 'in-progress' ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate('/exam-interface', { state: { attemptId: attempt.id } })}
                        >
                          Continue
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate('/quiz-rules-instructions', { state: { testId: attempt.quizId } })}
                        >
                          Start
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttemptHistory;