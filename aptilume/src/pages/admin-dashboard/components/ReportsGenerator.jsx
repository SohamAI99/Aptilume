import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';

const ReportsGenerator = () => {
  const [reportType, setReportType] = useState('users');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  const reportTypes = [
    { value: 'users', label: 'User Analytics Report', description: 'User registration, activity, and engagement metrics' },
    { value: 'tests', label: 'Test Performance Report', description: 'Test completion rates, scores, and analytics' },
    { value: 'financial', label: 'Financial Report', description: 'Revenue, subscriptions, and payment analytics' },
    { value: 'system', label: 'System Health Report', description: 'Performance metrics, uptime, and error logs' },
    { value: 'content', label: 'Content Analytics Report', description: 'Test creation, approval rates, and quality metrics' },
    { value: 'security', label: 'Security Audit Report', description: 'Login attempts, security events, and compliance' }
  ];

  const dateRangeOptions = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'last_6_months', label: 'Last 6 Months' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Date Range' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'excel', label: 'Excel Spreadsheet' },
    { value: 'csv', label: 'CSV File' },
    { value: 'json', label: 'JSON Data' }
  ];

  const getReportQueries = (type) => {
    const queries = {
      users: [
        'SELECT COUNT(*) as total_users, DATE_TRUNC(\'day\', created_at) as date FROM users WHERE created_at >= $1 AND created_at <= $2 GROUP BY DATE_TRUNC(\'day\', created_at);',
        'SELECT role, status, COUNT(*) as count FROM users GROUP BY role, status;',
        'SELECT AVG(test_attempts) as avg_attempts, AVG(avg_score) as avg_score FROM user_stats WHERE updated_at >= $1;'
      ],
      tests: [
        'SELECT t.*, COUNT(ta.id) as total_attempts, AVG(ta.score) as avg_score FROM tests t LEFT JOIN test_attempts ta ON t.id = ta.test_id GROUP BY t.id;',
        'SELECT difficulty, COUNT(*) as test_count, AVG(attempts) as avg_attempts FROM tests GROUP BY difficulty;',
        'SELECT DATE_TRUNC(\'day\', completed_at) as date, COUNT(*) as completions FROM test_attempts WHERE completed_at >= $1 GROUP BY DATE_TRUNC(\'day\', completed_at);'
      ],
      financial: [
        'SELECT SUM(amount) as total_revenue, DATE_TRUNC(\'month\', created_at) as month FROM payments WHERE created_at >= $1 GROUP BY DATE_TRUNC(\'month\', created_at);',
        'SELECT subscription_type, COUNT(*) as count, SUM(amount) as revenue FROM subscriptions s JOIN payments p ON s.id = p.subscription_id GROUP BY subscription_type;',
        'SELECT status, COUNT(*) as count FROM payments WHERE created_at >= $1 GROUP BY status;'
      ],
      system: [
        'SELECT DATE_TRUNC(\'hour\', created_at) as hour, AVG(response_time_ms) as avg_response_time FROM api_logs WHERE created_at >= $1 GROUP BY DATE_TRUNC(\'hour\', created_at);',
        'SELECT status_code, COUNT(*) as count FROM api_logs WHERE created_at >= $1 GROUP BY status_code ORDER BY status_code;',
        'SELECT AVG(cpu_percent) as avg_cpu, AVG(memory_percent) as avg_memory FROM system_metrics WHERE created_at >= $1;'
      ],
      content: [
        'SELECT status, COUNT(*) as count FROM tests GROUP BY status;',
        'SELECT u.name as creator, COUNT(t.id) as tests_created, AVG(ta.score) as avg_test_score FROM tests t JOIN users u ON t.created_by = u.id LEFT JOIN test_attempts ta ON t.id = ta.test_id GROUP BY u.id, u.name;',
        'SELECT DATE_TRUNC(\'week\', created_at) as week, COUNT(*) as tests_created FROM tests WHERE created_at >= $1 GROUP BY DATE_TRUNC(\'week\', created_at);'
      ],
      security: [
        'SELECT DATE_TRUNC(\'day\', created_at) as date, COUNT(*) as login_attempts, COUNT(*) FILTER (WHERE success = true) as successful_logins FROM auth_logs WHERE created_at >= $1 GROUP BY DATE_TRUNC(\'day\', created_at);',
        'SELECT ip_address, COUNT(*) as attempts, COUNT(*) FILTER (WHERE success = false) as failed_attempts FROM auth_logs WHERE created_at >= $1 GROUP BY ip_address HAVING COUNT(*) FILTER (WHERE success = false) > 5;',
        'SELECT event_type, COUNT(*) as count FROM security_events WHERE created_at >= $1 GROUP BY event_type;'
      ]
    };
    return queries?.[type] || [];
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Generating report:', {
        type: reportType,
        dateRange: dateRange,
        format: format,
        customDateRange: customDateRange
      });

      // Get PostgreSQL queries for the selected report type
      const queries = getReportQueries(reportType);
      console.log('PostgreSQL queries for report generation:');
      queries?.forEach((query, index) => {
        console.log(`Query ${index + 1}:`, query);
      });

      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In real implementation, this would call the backend API
      console.log('Report generated successfully');
      
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedReport = reportTypes?.find(r => r?.value === reportType);

  return (
    <div className="space-y-6">
      {/* PostgreSQL Queries Documentation */}
      <div className="glass-card rounded-xl p-6 bg-amber-50 border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
          <Icon name="Database" size={20} className="mr-2" />
          PostgreSQL Queries for Report Generation
        </h3>
        <div className="space-y-2 text-sm text-amber-800 font-mono">
          <p><strong>User Reports:</strong> SELECT u.*, COUNT(ta.id) as test_attempts, AVG(ta.score) as avg_score FROM users u LEFT JOIN test_attempts ta ON u.id = ta.user_id GROUP BY u.id;</p>
          <p><strong>Performance Analytics:</strong> SELECT DATE_TRUNC('day', created_at) as date, COUNT(*) as count, AVG(score) as avg_score FROM test_attempts GROUP BY date;</p>
          <p><strong>Revenue Reports:</strong> SELECT DATE_TRUNC('month', created_at) as month, SUM(amount) as revenue FROM payments GROUP BY month;</p>
          <p><strong>System Reports:</strong> SELECT DATE_TRUNC('hour', timestamp) as hour, AVG(response_time) as avg_response FROM system_logs GROUP BY hour;</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Reports Generator</h2>
          <p className="text-muted-foreground">
            Generate comprehensive reports for analytics and insights
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type Selection */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Report Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes?.map((type) => (
                <div
                  key={type?.value}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50",
                    reportType === type?.value
                      ? "border-primary bg-primary/5" :"border-border hover:bg-muted/30"
                  )}
                  onClick={() => setReportType(type?.value)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-foreground">{type?.label}</h4>
                    <input
                      type="radio"
                      checked={reportType === type?.value}
                      onChange={() => setReportType(type?.value)}
                      className="text-primary"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{type?.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Date Range</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={dateRange}
                onValueChange={setDateRange}
                options={dateRangeOptions}
                placeholder="Select date range"
              />
              <Select
                value={format}
                onValueChange={setFormat}
                options={formatOptions}
                placeholder="Select format"
              />
            </div>
            
            {dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  type="date"
                  label="Start Date"
                  value={customDateRange?.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e?.target?.value }))}
                />
                <Input
                  type="date"
                  label="End Date"
                  value={customDateRange?.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e?.target?.value }))}
                />
              </div>
            )}
          </div>

          {/* Report Queries Preview */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              PostgreSQL Queries for {selectedReport?.label}
            </h3>
            <div className="space-y-3">
              {getReportQueries(reportType)?.map((query, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">
                    Query {index + 1}:
                  </div>
                  <code className="text-xs text-foreground font-mono break-all">
                    {query}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="space-y-6">
          {/* Report Summary */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Report Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="text-sm font-medium text-foreground">{selectedReport?.label}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Date Range:</span>
                <span className="text-sm font-medium text-foreground">
                  {dateRangeOptions?.find(d => d?.value === dateRange)?.label}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Format:</span>
                <span className="text-sm font-medium text-foreground">
                  {formatOptions?.find(f => f?.value === format)?.label}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Estimated Size:</span>
                <span className="text-sm font-medium text-foreground">~2.5 MB</span>
              </div>
            </div>

            <Button
              fullWidth
              iconName={isGenerating ? "Loader2" : "Download"}
              iconPosition="left"
              onClick={handleGenerateReport}
              disabled={isGenerating}
              loading={isGenerating}
              className="mt-6"
            >
              {isGenerating ? 'Generating Report...' : 'Generate Report'}
            </Button>
          </div>

          {/* Recent Reports */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Reports</h3>
            <div className="space-y-3">
              {[
                { name: 'User Analytics Report', date: '2025-01-09', size: '1.2 MB', type: 'PDF' },
                { name: 'Test Performance Report', date: '2025-01-08', size: '3.1 MB', type: 'Excel' },
                { name: 'System Health Report', date: '2025-01-07', size: '890 KB', type: 'PDF' }
              ]?.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{report?.name}</div>
                    <div className="text-xs text-muted-foreground">{report?.date} • {report?.size}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {report?.type}
                    </span>
                    <Button
                      size="xs"
                      variant="ghost"
                      iconName="Download"
                      onClick={() => console.log('Download report', index)}
                      className="p-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Reports</h3>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                iconName="Users"
                iconPosition="left"
                onClick={() => console.log('Generate daily user report')}
                fullWidth
              >
                Daily User Summary
              </Button>
              <Button
                size="sm"
                variant="outline"
                iconName="BarChart3"
                iconPosition="left"
                onClick={() => console.log('Generate test analytics')}
                fullWidth
              >
                Test Analytics
              </Button>
              <Button
                size="sm"
                variant="outline"
                iconName="DollarSign"
                iconPosition="left"
                onClick={() => console.log('Generate revenue report')}
                fullWidth
              >
                Revenue Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsGenerator;