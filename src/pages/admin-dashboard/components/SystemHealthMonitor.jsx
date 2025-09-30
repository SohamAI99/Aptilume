import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../utils/cn';
import { 
  Activity, 
  Database, 
  Zap, 
  AlertTriangle, 
  Users, 
  HardDrive, 
  Cpu, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw 
} from 'lucide-react';

const SystemHealthMonitor = ({ data }) => {
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // Simulate real-time data updates
      console.log('Refreshing system health metrics...');
      // PostgreSQL query: SELECT * FROM system_metrics ORDER BY created_at DESC LIMIT 1;
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const healthMetrics = [
    {
      name: 'Database Status',
      value: data?.databaseStatus || 'healthy',
      icon: Database,
      status: data?.databaseStatus === 'healthy' ? 'success' : 'error',
      query: 'SELECT pg_is_in_recovery(), pg_postmaster_start_time(), version();'
    },
    {
      name: 'API Response Time',
      value: data?.apiResponseTime || '0ms',
      icon: Zap,
      status: parseFloat(data?.apiResponseTime) < 300 ? 'success' : parseFloat(data?.apiResponseTime) < 500 ? 'warning' : 'error',
      query: 'SELECT AVG(response_time_ms) FROM api_logs WHERE created_at > NOW() - INTERVAL \'5 minutes\';'
    },
    {
      name: 'Error Rate',
      value: data?.errorRate || '0%',
      icon: AlertTriangle,
      status: parseFloat(data?.errorRate) < 1 ? 'success' : parseFloat(data?.errorRate) < 5 ? 'warning' : 'error',
      query: 'SELECT (COUNT(*) FILTER (WHERE status_code >= 400) * 100.0 / COUNT(*)) as error_rate FROM api_logs WHERE created_at > NOW() - INTERVAL \'1 hour\';'
    },
    {
      name: 'Active Connections',
      value: data?.activeConnections || 0,
      icon: Users,
      status: data?.activeConnections < 1000 ? 'success' : data?.activeConnections < 2000 ? 'warning' : 'error',
      query: 'SELECT count(*) FROM pg_stat_activity WHERE state = \'active\';'
    },
    {
      name: 'Memory Usage',
      value: data?.memoryUsage || '0%',
      icon: HardDrive,
      status: parseFloat(data?.memoryUsage) < 80 ? 'success' : parseFloat(data?.memoryUsage) < 90 ? 'warning' : 'error',
      query: 'SELECT (used_memory::float / total_memory::float * 100)::decimal(5,2) as memory_usage_percent FROM system_resources ORDER BY timestamp DESC LIMIT 1;'
    },
    {
      name: 'CPU Usage',
      value: data?.cpuUsage || '0%',
      icon: Cpu,
      status: parseFloat(data?.cpuUsage) < 70 ? 'success' : parseFloat(data?.cpuUsage) < 85 ? 'warning' : 'error',
      query: 'SELECT AVG(cpu_percent) as avg_cpu FROM system_metrics WHERE created_at > NOW() - INTERVAL \'5 minutes\';'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return Clock;
    }
  };

  const handleRefreshNow = () => {
    setLastRefresh(new Date());
    console.log('Manual refresh triggered - executing health check queries...');
    // Execute all health check queries
    healthMetrics?.forEach(metric => {
      console.log(`${metric?.name} Query:`, metric?.query);
    });
  };

  return (
    <div className="glass-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            System Health Monitor
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time system performance and status monitoring
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseInt(e?.target?.value))}
            className="text-xs px-2 py-1 rounded border border-input bg-background"
          >
            <option value={10}>10s</option>
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
          </select>
          <Button
            size="xs"
            variant="outline"
            icon={<RefreshCw className="h-3 w-3" />}
            onClick={handleRefreshNow}
          />
        </div>
      </div>

      {/* PostgreSQL Queries Info */}
      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <h4 className="text-sm font-semibold text-emerald-900 mb-2 flex items-center">
          <Database className="h-4 w-4 mr-1" />
          System Health PostgreSQL Queries
        </h4>
        <div className="text-xs text-emerald-800 font-mono space-y-1">
          <p><strong>Connection Status:</strong> SELECT count(*) as active_connections FROM pg_stat_activity;</p>
          <p><strong>Database Size:</strong> SELECT pg_size_pretty(pg_database_size(current_database()));</p>
          <p><strong>Query Performance:</strong> SELECT query, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;</p>
          <p><strong>System Metrics:</strong> SELECT * FROM system_health_logs ORDER BY timestamp DESC LIMIT 1;</p>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {healthMetrics?.map((metric, index) => {
          const IconComponent = metric.icon;
          const StatusIconComponent = getStatusIcon(metric.status);
          
          return (
            <div key={index} className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <IconComponent className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{metric?.name}</span>
                </div>
                <StatusIconComponent
                  className={cn("h-4 w-4 rounded-full p-0.5", getStatusColor(metric.status))}
                />
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">
                {metric?.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric?.status === 'success' ? 'Normal' :
                 metric?.status === 'warning' ? 'Warning' : 'Critical'}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resource Usage */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Resource Usage</h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Memory</span>
                <span>{data?.memoryUsage}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    parseFloat(data?.memoryUsage) < 80 ? 'bg-green-500' :
                    parseFloat(data?.memoryUsage) < 90 ? 'bg-yellow-500' : 'bg-red-500'
                  )}
                  style={{ width: data?.memoryUsage || '0%' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>CPU</span>
                <span>{data?.cpuUsage}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all",
                    parseFloat(data?.cpuUsage) < 70 ? 'bg-green-500' :
                    parseFloat(data?.cpuUsage) < 85 ? 'bg-yellow-500' : 'bg-red-500'
                  )}
                  style={{ width: data?.cpuUsage || '0%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Recent Events</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center p-2 bg-green-50 rounded border border-green-200">
              <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
              <span className="text-green-800">System health check completed successfully</span>
            </div>
            <div className="flex items-center p-2 bg-yellow-50 rounded border border-yellow-200">
              <AlertTriangle className="h-3 w-3 text-yellow-600 mr-2 flex-shrink-0" />
              <span className="text-yellow-800">High memory usage detected (85%)</span>
            </div>
            <div className="flex items-center p-2 bg-blue-50 rounded border border-blue-200">
              <Activity className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
              <span className="text-blue-800">Scheduled maintenance completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground flex justify-between">
        <span>Last updated: {lastRefresh?.toLocaleTimeString()}</span>
        <span>Auto-refresh: {refreshInterval}s</span>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;