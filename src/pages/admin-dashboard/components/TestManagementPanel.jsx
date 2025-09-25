import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';
import { publishQuiz, archiveQuiz } from '../../../utils/dbService';
import RemoveUnwantedQuizzesButton from '../../../components/admin/RemoveUnwantedQuizzesButton';

const TestManagementPanel = ({ tests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedTests, setSelectedTests] = useState([]);

  // Helper function to format Firestore timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Handle Firestore Timestamp objects
    if (timestamp?.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Handle regular Date objects
    if (timestamp instanceof Date) {
      return timestamp.toLocaleDateString() + ' ' + timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Handle string dates
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
    
    return 'N/A';
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'review_pending', label: 'Review Pending' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' }
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const filteredTests = tests?.filter(test => {
    const matchesSearch = test?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || test?.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || test?.difficulty === difficultyFilter;
    
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const handleTestAction = async (testId, action) => {
    try {
      switch (action) {
        case 'publish':
          await publishQuiz(testId);
          break;
        case 'archive':
          await archiveQuiz(testId);
          break;
        case 'approve':
          await publishQuiz(testId);
          break;
        case 'reject':
          // In a real app, you might want to implement rejection logic
          console.log('Reject test', testId);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
            // In a real app, you would implement test deletion here
            console.log('DELETE test', testId);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action} on test ${testId}:`, error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      review_pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Review Pending' },
      published: { color: 'bg-green-100 text-green-800', label: 'Published' },
      archived: { color: 'bg-red-100 text-red-800', label: 'Archived' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config?.color
      )}>
        {config?.label}
      </span>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const difficultyConfig = {
      easy: { color: 'bg-green-100 text-green-800', label: 'Easy' },
      medium: { color: 'bg-yellow-100 text-yellow-800', label: 'Medium' },
      hard: { color: 'bg-red-100 text-red-800', label: 'Hard' }
    };
    
    const config = difficultyConfig?.[difficulty] || difficultyConfig?.medium;
    
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config?.color
      )}>
        {config?.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Test Management</h2>
          <p className="text-muted-foreground">
            Manage assessments, questions, and content approval
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RemoveUnwantedQuizzesButton />
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={() => console.log('Create new test')}
          >
            Create Test
          </Button>
          <Button
            variant="outline"
            iconName="Upload"
            iconPosition="left"
            onClick={() => console.log('Bulk import tests')}
          >
            Import
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search tests by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
              iconName="Search"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={statusOptions}
            placeholder="Filter by status"
          />
          <Select
            value={difficultyFilter}
            onValueChange={setDifficultyFilter}
            options={difficultyOptions}
            placeholder="Filter by difficulty"
          />
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTests?.map((test) => (
          <div key={test?.id} className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow">
            {/* Test Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {test?.title || 'Untitled Test'}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  {getStatusBadge(test?.status)}
                  {getDifficultyBadge(test?.difficulty)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="xs"
                  variant="ghost"
                  iconName="Edit"
                  onClick={() => console.log('Edit test', test?.id)}
                  className="p-2"
                />
                <Button
                  size="xs"
                  variant="ghost"
                  iconName="Eye"
                  onClick={() => console.log('Preview test', test?.id)}
                  className="p-2"
                />
                <Button
                  size="xs"
                  variant="ghost"
                  iconName="MoreVertical"
                  onClick={() => console.log('More options', test?.id)}
                  className="p-2"
                />
              </div>
            </div>

            {/* Test Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-semibold text-foreground">
                  {test?.questions || 0}
                </div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-semibold text-foreground">
                  {test?.attempts?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-muted-foreground">Attempts</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-semibold text-foreground">
                  {test?.avgScore ? `${test?.avgScore}%` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
            </div>

            {/* Test Metadata */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Created: {formatTimestamp(test?.createdAt)}</span>
              <span>Updated: {formatTimestamp(test?.updatedAt)}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {test?.status === 'draft' && (
                <Button
                  size="sm"
                  variant="outline"
                  iconName="Send"
                  onClick={() => handleTestAction(test?.id, 'submit_review')}
                  className="flex-1"
                >
                  Submit for Review
                </Button>
              )}
              
              {test?.status === 'review_pending' && (
                <>
                  <Button
                    size="sm"
                    variant="default"
                    iconName="Check"
                    onClick={() => handleTestAction(test?.id, 'approve')}
                    className="flex-1"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    iconName="X"
                    onClick={() => handleTestAction(test?.id, 'reject')}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </>
              )}
              
              {test?.status === 'published' && (
                <Button
                  size="sm"
                  variant="outline"
                  iconName="Archive"
                  onClick={() => handleTestAction(test?.id, 'archive')}
                  className="flex-1"
                >
                  Archive
                </Button>
              )}

              <Button
                size="sm"
                variant="ghost"
                iconName="BarChart3"
                onClick={() => console.log('View analytics', test?.id)}
              >
                Analytics
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredTests?.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No tests found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria.</p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => console.log('Create first test')}
          >
            Create Your First Test
          </Button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Test Management Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tests?.filter(t => t?.status === 'published')?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tests?.filter(t => t?.status === 'review_pending')?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {tests?.filter(t => t?.status === 'draft')?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {tests?.filter(t => t?.status === 'archived')?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Archived</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestManagementPanel;