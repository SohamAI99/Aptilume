import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from '../components/TeacherNavigation';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { listenToUsers } from '../../../utils/dbService';
import * as authService from '../../../utils/authService';
import AccountSection from '../../../components/ui/AccountSection';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    let unsubscribe;
    
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Listen to all users (in a real app, you might want to filter by teacher's students)
        unsubscribe = listenToUsers((usersData) => {
          // Filter for students only
          const studentUsers = usersData.filter(user => user.userType === 'student');
          setStudents(studentUsers);
          setLoading(false);
        });
      } catch (err) {
        console.error('Error fetching students:', err);
        setError(err.message || 'Failed to load students. Please try again.');
        setLoading(false);
      }
    };

    fetchStudents();

    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logoutUser();
      navigate('/authentication-login-register');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    // Handle different data types for sorting
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredStudents = sortedStudents.filter(student =>
    (student.name && student.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    const isActive = status === 'active' || status === true;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-success/20 text-success' 
          : 'bg-warning/20 text-warning'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '—';
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      <TeacherNavigation currentUser={currentUser} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header with Account Section */}
        <header className="border-b border-border bg-background">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Students</h1>
            </div>
            <AccountSection currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </header>
        
        <main className="flex-1 pt-6">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Students</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and track your students' progress
                </p>
              </div>
              <Button iconName="Download">
                Export Data
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="glass-card rounded-2xl p-4 mb-6 bg-error/10 border border-error">
                <div className="flex items-center text-error">
                  <Icon name="AlertCircle" size={18} className="mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="w-full glass-card border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Students Table */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No students found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? 'Try adjusting your search query' : 'No students enrolled yet'}
                </p>
              </div>
            ) : (
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-4 px-6 font-medium cursor-pointer" onClick={() => handleSort('name')}>
                          Student {getSortIcon('name')}
                        </th>
                        <th className="text-left py-4 px-6 font-medium">Email</th>
                        <th className="text-left py-4 px-6 font-medium cursor-pointer" onClick={() => handleSort('createdAt')}>
                          Enrolled {getSortIcon('createdAt')}
                        </th>
                        <th className="text-left py-4 px-6 font-medium cursor-pointer" onClick={() => handleSort('lastLoginAt')}>
                          Last Active {getSortIcon('lastLoginAt')}
                        </th>
                        <th className="text-left py-4 px-6 font-medium cursor-pointer" onClick={() => handleSort('stats.totalTestsTaken')}>
                          Quizzes Taken {getSortIcon('stats.totalTestsTaken')}
                        </th>
                        <th className="text-left py-4 px-6 font-medium cursor-pointer" onClick={() => handleSort('stats.averageScore')}>
                          Avg. Score {getSortIcon('stats.averageScore')}
                        </th>
                        <th className="text-left py-4 px-6 font-medium">Status</th>
                        <th className="text-left py-4 px-6 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-bold">
                                  {student.name?.charAt(0) || student.email?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">{student.name || 'Unnamed Student'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">{student.email || '—'}</td>
                          <td className="py-4 px-6">{formatDate(student.createdAt)}</td>
                          <td className="py-4 px-6">{formatDate(student.lastLoginAt)}</td>
                          <td className="py-4 px-6">{student.stats?.totalTestsTaken || 0}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-border rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${student.stats?.averageScore || 0}%` }}
                                ></div>
                              </div>
                              <span>{Math.round(student.stats?.averageScore || 0)}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">{getStatusBadge(student.isActive)}</td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" iconName="Eye" />
                              <Button variant="ghost" size="sm" iconName="Mail" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  </div>
  );
};

export default Students;