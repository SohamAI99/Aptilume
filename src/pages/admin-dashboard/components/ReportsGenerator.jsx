import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';
import { Database } from 'lucide-react';

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
        'collection("users").where("createdAt", ">=", startDate).where("createdAt", "<=", endDate).get()',
        'collection("users").groupBy("role", "status").count()',
        'collection("users").where("stats.lastActive", ">=", startDate).get().then(users => { const totalAttempts = users.reduce((sum, user) => sum + (user.stats.totalTestsTaken || 0), 0); const avgScore = users.reduce((sum, user) => sum + (user.stats.averageScore || 0), 0) / users.length; return { totalAttempts, avgScore }; })'
      ],
      tests: [
        'collection("quizzes").get().then(quizzes => quizzes.map(quiz => ({ ...quiz, totalAttempts: quiz.stats.totalAttempts || 0, avgScore: quiz.stats.averageScore || 0 })))',
        'collection("quizzes").groupBy("difficulty").count()',
        'collection("attempts").where("completedAt", ">=", startDate).get().then(attempts => { const completionsByDate = {}; attempts.forEach(attempt => { const date = attempt.completedAt.toDate().toDateString(); completionsByDate[date] = (completionsByDate[date] || 0) + 1; }); return completionsByDate; })'
      ],
      financial: [
        'collection("payments").where("createdAt", ">=", startDate).get().then(payments => { const revenueByMonth = {}; payments.forEach(payment => { const month = payment.createdAt.toDate().getMonth(); revenueByMonth[month] = (revenueByMonth[month] || 0) + payment.amount; }); return revenueByMonth; })',
        'collection("subscriptions").get().then(subscriptions => { const subscriptionData = {}; subscriptions.forEach(sub => { subscriptionData[sub.type] = (subscriptionData[sub.type] || 0) + 1; }); return subscriptionData; })',
        'collection("payments").where("createdAt", ">=", startDate).groupBy("status").count()'
      ],
      system: [
        'collection("activity_logs").where("timestamp", ">=", startDate).get().then(logs => { const responseTimes = logs.map(log => log.responseTime || 0); const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length; return avgResponseTime; })',
        'collection("activity_logs").where("timestamp", ">=", startDate).groupBy("statusCode").count()',
        'collection("system_metrics").where("timestamp", ">=", startDate).get().then(metrics => { const avgCpu = metrics.reduce((sum, m) => sum + (m.cpu_percent || 0), 0) / metrics.length; const avgMemory = metrics.reduce((sum, m) => sum + (m.memory_percent || 0), 0) / metrics.length; return { avgCpu, avgMemory }; })'
      ],
      content: [
        'collection("quizzes").groupBy("status").count()',
        'collection("quizzes").get().then(quizzes => { const creatorData = {}; quizzes.forEach(quiz => { const creator = quiz.createdBy; creatorData[creator] = (creatorData[creator] || 0) + 1; }); return creatorData; })',
        'collection("quizzes").where("createdAt", ">=", startDate).get().then(quizzes => { const testsByWeek = {}; quizzes.forEach(quiz => { const week = Math.floor(quiz.createdAt.toDate().getDate() / 7); testsByWeek[week] = (testsByWeek[week] || 0) + 1; }); return testsByWeek; })'
      ],
      security: [
        'collection("activity_logs").where("action", "==", "login").where("timestamp", ">=", startDate).get().then(logs => { const loginData = { total: logs.length, successful: logs.filter(log => log.details.includes("success")).length }; return loginData; })',
        'collection("activity_logs").where("timestamp", ">=", startDate).where("action", "==", "failed_login").get().then(logs => { const failedAttempts = {}; logs.forEach(log => { const ip = log.ipAddress; failedAttempts[ip] = (failedAttempts[ip] || 0) + 1; }); return Object.entries(failedAttempts).filter(([ip, count]) => count > 5); })',
        'collection("activity_logs").where("timestamp", ">=", startDate).groupBy("eventType").count()'
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

      // Get Firestore queries for the selected report type
      const queries = getReportQueries(reportType);
      console.log('Firestore queries for report generation:');
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
      {/* Firestore Queries Documentation */}
      <div className="glass-card rounded-xl p-6 bg-amber-50 border border-amber-200">
        <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Firestore Queries for Report Generation
        </h3>
        <div className="space-y-2 text-sm text-amber-800 font-mono">
          <p><strong>User Reports:</strong> db.collection('users').get().then(snapshot {'>'} snapshot.docs.map(doc {'>'} (&#123; id: doc.id, ...doc.data() &#125;)))</p>
          <p><strong>Performance Analytics:</strong> db.collection('attempts').where('completedAt', '{'>='}', startDate).get()</p>
          <p><strong>Revenue Reports:</strong> db.collection('payments').where('createdAt', '{'>='}', startDate).get()</p>
          <p><strong>System Reports:</strong> db.collection('activity_logs').where('timestamp', '{'>='}', startDate).get()</p>
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

          {/* Generate Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleGenerateReport}
              loading={isGenerating}
              disabled={isGenerating}
              size="lg"
            >
              {isGenerating ? 'Generating Report...' : 'Generate Report'}
            </Button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Report Preview</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-foreground">{selectedReport?.label}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedReport?.description}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">
                    {formatOptions?.find(f => f?.value === format)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Range:</span>
                  <span className="font-medium">
                    {dateRangeOptions?.find(d => d?.value === dateRange)?.label}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-2">Sample Data Points</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• User registration trends</li>
                  <li>• Test completion rates</li>
                  <li>• Average scores by category</li>
                  <li>• System performance metrics</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Report Delivery</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Reports will be generated and delivered to your email or can be downloaded directly.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <input type="checkbox" id="email-delivery" className="rounded" />
              <label htmlFor="email-delivery">Send to email when ready</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsGenerator;