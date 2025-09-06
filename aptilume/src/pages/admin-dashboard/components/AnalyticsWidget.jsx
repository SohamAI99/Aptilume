import React from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsWidget = ({ data, analytics, detailed = false }) => {
  const keyMetrics = [
    {
      title: 'Total Users',
      value: data?.totalUsers?.toLocaleString() || '0',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Users',
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: data?.activeUsers?.toLocaleString() || '0',
      change: '+8.3%',
      changeType: 'positive',
      icon: 'Activity',
      color: 'text-green-600'
    },
    {
      title: 'Total Tests',
      value: data?.totalTests?.toLocaleString() || '0',
      change: '+15.2%',
      changeType: 'positive',
      icon: 'BookOpen',
      color: 'text-purple-600'
    },
    {
      title: 'System Uptime',
      value: data?.systemUptime || '0%',
      change: '+0.1%',
      changeType: 'positive',
      icon: 'Activity',
      color: 'text-emerald-600'
    },
    {
      title: 'Completed Tests',
      value: data?.completedTests?.toLocaleString() || '0',
      change: '+18.7%',
      changeType: 'positive',
      icon: 'CheckCircle',
      color: 'text-indigo-600'
    },
    {
      title: 'Revenue',
      value: data?.revenue || '$0',
      change: '+22.4%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'text-amber-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keyMetrics?.map((metric, index) => (
          <div key={index} className="glass-card rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric?.title}
                </p>
                <p className="text-2xl font-semibold text-foreground mt-2">
                  {metric?.value}
                </p>
                <div className={`flex items-center mt-2 text-sm ${
                  metric?.changeType === 'positive' ?'text-green-600' :'text-red-600'
                }`}>
                  <Icon 
                    name={metric?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                    size={14} 
                    className="mr-1" 
                  />
                  {metric?.change} from last month
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-muted/20 ${metric?.color}`}>
                <Icon name={metric?.icon} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      {detailed && analytics && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">User Growth</h3>
              <Icon name="TrendingUp" size={20} className="text-primary" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics?.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Test Performance Chart */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Test Performance</h3>
              <Icon name="BarChart3" size={20} className="text-primary" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics?.testPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="average" fill="#f59e0b" name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="glass-card rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Revenue Trends</h3>
              <Icon name="DollarSign" size={20} className="text-primary" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsWidget;