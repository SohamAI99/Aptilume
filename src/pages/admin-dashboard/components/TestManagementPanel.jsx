import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';
import { publishQuiz, archiveQuiz } from '../../../utils/dbService';
import RemoveUnwantedQuizzesButton from '../../../components/admin/RemoveUnwantedQuizzesButton';
import { 
  Plus, 
  Upload, 
  Search, 
  Eye, 
  Edit, 
  Check, 
  X, 
  Archive, 
  Trash2 
} from 'lucide-react';

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
            icon={<Plus className="h-4 w-4" />}
            iconPosition="left"
            onClick={() => console.log('Create new test')}
          >
            Create Test
          </Button>
          <Button
            variant="outline"
            icon={<Upload className="h-4 w-4" />}
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
              icon={<Search className="h-4 w-4" />}
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
                  {test?.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {test?.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(test?.status)}
                {getDifficultyBadge(test?.difficulty)}
              </div>
            </div>

            {/* Test Metadata */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-muted/30 rounded-lg p-2">
                <div className="text-sm font-semibold text-foreground">{test?.questionCount}</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-2">
                <div className="text-sm font-semibold text-foreground">{test?.duration}m</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
              <div className="bg-muted/30 rounded-lg p-2">
                <div className="text-sm font-semibold text-foreground">{test?.attempts || 0}</div>
                <div className="text-xs text-muted-foreground">Attempts</div>
              </div>
            </div>

            {/* Test Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground">
                Updated: {formatTimestamp(test?.updatedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Eye className="h-4 w-4" />}
                  onClick={() => console.log('View test', test?.id)}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => console.log('Edit test', test?.id)}
                />
                {test?.status === 'review_pending' && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<Check className="h-4 w-4 text-green-600" />}
                      onClick={() => handleTestAction(test?.id, 'approve')}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={<X className="h-4 w-4 text-red-600" />}
                      onClick={() => handleTestAction(test?.id, 'reject')}
                    />
                  </>
                )}
                {test?.status === 'published' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Archive className="h-4 w-4 text-yellow-600" />}
                    onClick={() => handleTestAction(test?.id, 'archive')}
                  />
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Trash2 className="h-4 w-4 text-red-600" />}
                  onClick={() => handleTestAction(test?.id, 'delete')}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTests?.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No tests found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDifficultyFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TestManagementPanel;