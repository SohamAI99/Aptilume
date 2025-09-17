import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Mock data for students
  const mockStudents = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      enrollmentDate: "2025-09-01",
      lastActive: "2025-09-15",
      quizzesTaken: 12,
      averageScore: 85,
      status: "active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
      enrollmentDate: "2025-09-03",
      lastActive: "2025-09-14",
      quizzesTaken: 8,
      averageScore: 92,
      status: "active"
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.j@example.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      enrollmentDate: "2025-09-05",
      lastActive: "2025-09-10",
      quizzesTaken: 5,
      averageScore: 78,
      status: "inactive"
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      enrollmentDate: "2025-09-07",
      lastActive: "2025-09-16",
      quizzesTaken: 15,
      averageScore: 88,
      status: "active"
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael.w@example.com",
      avatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=150&h=150&fit=crop&crop=face",
      enrollmentDate: "2025-09-08",
      lastActive: "2025-09-12",
      quizzesTaken: 7,
      averageScore: 76,
      status: "active"
    }
  ];

  useEffect(() => {
    // Simulate fetching students from API
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 1000);
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
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'active' 
          ? 'bg-success/20 text-success' 
          : 'bg-warning/20 text-warning'
      }`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    }
    return '↕';
  };

  return (
    <div className="flex-1 flex flex-col">
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
                        <th className="text-left py-4 px-6 font-medium cursor-pointer" onClick={() => handleSort('enrollmentDate')}>
                          Enrolled {getSortIcon('enrollmentDate')}
                        </th>
                        <th className="text-left py-4 px-6 font-medium cursor-pointer" onClick={() => handleSort('lastActive')}>
                          Last Active {getSortIcon('lastActive')}
                        </th>
                        <th className="text-left py-4 px-6 font-medium cursor-pointer" onClick={() => handleSort('quizzesTaken')}>
                          Quizzes Taken {getSortIcon('quizzesTaken')}
                        </th>
                        <th className="text-left py-4 px-6 font-medium cursor-pointer" onClick={() => handleSort('averageScore')}>
                          Avg. Score {getSortIcon('averageScore')}
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
                              <img
                                src={student.avatar}
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <div className="font-medium">{student.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-muted-foreground">{student.email}</td>
                          <td className="py-4 px-6">{student.enrollmentDate}</td>
                          <td className="py-4 px-6">{student.lastActive}</td>
                          <td className="py-4 px-6">{student.quizzesTaken}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-border rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full"
                                  style={{ width: `${student.averageScore}%` }}
                                ></div>
                              </div>
                              <span>{student.averageScore}%</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">{getStatusBadge(student.status)}</td>
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
  );
};

export default Students;