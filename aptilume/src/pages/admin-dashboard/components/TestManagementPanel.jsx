import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';

const TestManagementPanel = ({ tests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [selectedTests, setSelectedTests] = useState([]);

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

  const handleTestAction = (testId, action) => {
    console.log(`Performing ${action} on test ${testId}`);
    // PostgreSQL queries for test actions
    switch (action) {
      case 'publish': console.log('UPDATE tests SET status = "published", updated_at = NOW() WHERE id = ?', testId);
        break;
      case 'archive': console.log('UPDATE tests SET status = "archived", updated_at = NOW() WHERE id = ?', testId);
        break;
      case 'approve': console.log('UPDATE tests SET status = "published", approved_at = NOW(), approved_by = ? WHERE id = ?', testId);
        break;
      case 'reject': console.log('UPDATE tests SET status = "draft", rejected_at = NOW(), rejected_by = ? WHERE id = ?', testId);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this test? This action cannot be undone.')) {
          console.log('DELETE FROM tests WHERE id = ?', testId);
        }
        break;
      default:
        break;
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
      {/* PostgreSQL Queries Documentation */}
      <div className="glass-card rounded-xl p-6 bg-purple-50 border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
          <Icon name="Database" size={20} className="mr-2" />
          PostgreSQL Queries for Test Management
        </h3>
        <div className="space-y-2 text-sm text-purple-800 font-mono">
          <p><strong>Get All Tests:</strong> SELECT t.*, u.name as creator_name FROM tests t JOIN users u ON t.created_by = u.id ORDER BY t.updated_at DESC;</p>
          <p><strong>Test Analytics:</strong> SELECT t.id, t.title, COUNT(ta.id) as attempts, AVG(ta.score) as avg_score FROM tests t LEFT JOIN test_attempts ta ON t.id = ta.test_id GROUP BY t.id;</p>
          <p><strong>Pending Reviews:</strong> SELECT * FROM tests WHERE status = 'review_pending' ORDER BY created_at ASC;</p>
          <p><strong>Test Performance:</strong> SELECT difficulty, COUNT(*) as total_tests, AVG(attempts) as avg_attempts FROM tests GROUP BY difficulty;</p>
          <p><strong>Update Test Status:</strong> UPDATE tests SET status = $1, updated_at = NOW() WHERE id = $2;</p>
          <p><strong>Test Questions:</strong> SELECT q.* FROM questions q WHERE q.test_id = $1 ORDER BY q.order_index;</p>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Test Management</h2>
          <p className="text-muted-foreground">
            Manage assessments, questions, and content approval
          </p>
        </div>
        <div className="flex items-center gap-3">
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
                  {test?.title}
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
                  {test?.questions}
                </div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-semibold text-foreground">
                  {test?.attempts?.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Attempts</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="text-lg font-semibold text-foreground">
                  {test?.avgScore}%
                </div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
            </div>

            {/* Test Metadata */}
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Created: {test?.createdAt}</span>
              <span>Updated: {test?.updatedAt}</span>
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