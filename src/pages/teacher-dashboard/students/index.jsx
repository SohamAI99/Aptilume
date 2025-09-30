import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import TeacherNavigation from '../components/TeacherNavigation';
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
        unsubscribe = listenToUsers((usersData) => {
          // Filter for student users only
          const studentUsers = usersData.filter(user => user.role === 'student');
          setStudents(studentUsers);
          setLoading(false);
        }, (err) => {
          setError(err.message);
          setLoading(false);
        });
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudents();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = [...students].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredStudents = sortedStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TeacherNavigation activeTab="students" onTabChange={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TeacherNavigation activeTab="students" onTabChange={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
                  <p className="text-muted-foreground">Manage and monitor student accounts</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <Button variant="outline" icon={<Filter className="h-4 w-4" />}>
                  Filters
                </Button>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th 
                        className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('name')}
                      >
                        Student
                      </th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('email')}
                      >
                        Email
                      </th>
                      <th 
                        className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => handleSort('joinDate')}
                      >
                        Join Date
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b border-border hover:bg-muted/30">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white font-medium">
                                  {student.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{student.name}</div>
                                <div className="text-sm text-muted-foreground">ID: {student.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-foreground">{student.email}</td>
                          <td className="py-4 px-4 text-foreground">
                            {formatDate(student.joinDate)}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                              Active
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" icon={<Eye className="h-4 w-4" />} />
                              <Button variant="ghost" size="sm" icon={<Edit className="h-4 w-4" />} />
                              <Button variant="ghost" size="sm" icon={<Trash2 className="h-4 w-4" />} />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-8 px-4 text-center text-muted-foreground">
                          No students found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Account Section */}
          <div className="lg:w-80">
            <AccountSection user={currentUser} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;