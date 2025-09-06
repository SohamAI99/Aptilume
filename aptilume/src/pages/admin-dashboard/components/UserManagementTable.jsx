import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';

const UserManagementTable = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'student', label: 'Student' },
    { value: 'contributor', label: 'Contributor' },
    { value: 'admin', label: 'Admin' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesRole = roleFilter === 'all' || user?.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user?.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (userId, action) => {
    console.log(`Performing ${action} on user ${userId}`);
    // Here would be the actual PostgreSQL query calls
    switch (action) {
      case 'activate': console.log('UPDATE users SET status = "active" WHERE id = ?', userId);
        break;
      case 'deactivate': console.log('UPDATE users SET status = "inactive" WHERE id = ?', userId);
        break;
      case 'suspend': console.log('UPDATE users SET status = "suspended" WHERE id = ?', userId);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user?')) {
          console.log('DELETE FROM users WHERE id = ?', userId);
        }
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers?.length === 0) {
      alert('Please select users first');
      return;
    }
    
    const userIds = selectedUsers?.join(',');
    console.log(`Performing bulk ${action} on users: ${userIds}`);
    
    switch (action) {
      case 'activate': console.log('UPDATE users SET status = "active" WHERE id IN (?)', userIds);
        break;
      case 'deactivate': console.log('UPDATE users SET status = "inactive" WHERE id IN (?)', userIds);
        break;
      case 'export':
        console.log('SELECT * FROM users WHERE id IN (?) ORDER BY created_at DESC', userIds);
        break;
      default:
        break;
    }
    
    setSelectedUsers([]);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers?.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map(user => user?.id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspended' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.inactive;
    
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config?.color
      )}>
        {config?.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      student: { color: 'bg-blue-100 text-blue-800', label: 'Student' },
      contributor: { color: 'bg-purple-100 text-purple-800', label: 'Contributor' },
      admin: { color: 'bg-orange-100 text-orange-800', label: 'Admin' }
    };
    
    const config = roleConfig?.[role] || roleConfig?.student;
    
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
      <div className="glass-card rounded-xl p-6 bg-blue-50 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
          <Icon name="Database" size={20} className="mr-2" />
          PostgreSQL Queries for User Management
        </h3>
        <div className="space-y-2 text-sm text-blue-800 font-mono">
          <p><strong>Get All Users:</strong> SELECT * FROM users ORDER BY created_at DESC;</p>
          <p><strong>Search Users:</strong> SELECT * FROM users WHERE name ILIKE '%search%' OR email ILIKE '%search%';</p>
          <p><strong>Filter by Role:</strong> SELECT * FROM users WHERE role = 'student' AND status = 'active';</p>
          <p><strong>User Statistics:</strong> SELECT role, status, COUNT(*) as count FROM users GROUP BY role, status;</p>
          <p><strong>Update User Status:</strong> UPDATE users SET status = 'active' WHERE id = $1;</p>
          <p><strong>Bulk Operations:</strong> UPDATE users SET status = 'inactive' WHERE id = ANY($1);</p>
        </div>
      </div>

      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
          <p className="text-muted-foreground">
            Manage platform users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            iconName="UserPlus"
            iconPosition="left"
            onClick={() => console.log('Add new user')}
          >
            Add User
          </Button>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={() => handleBulkAction('export')}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full"
              iconName="Search"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
            options={roleOptions}
            placeholder="Filter by role"
          />
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={statusOptions}
            placeholder="Filter by status"
          />
        </div>

        {/* Bulk Actions */}
        {selectedUsers?.length > 0 && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">
                {selectedUsers?.length} user{selectedUsers?.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('export')}
                >
                  Export Selected
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="w-12 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={filteredUsers?.length > 0 && selectedUsers?.length === filteredUsers?.length}
                    onChange={toggleAllUsers}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Join Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Last Activity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Tests</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Avg Score</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={() => toggleUserSelection(user?.id)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                        <Icon name="User" size={14} color="white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {user?.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(user?.role)}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(user?.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user?.joinDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user?.lastActivity}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user?.testsCompleted}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {user?.averageScore}%
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="xs"
                        variant="ghost"
                        iconName="Edit"
                        onClick={() => console.log('Edit user', user?.id)}
                        className="p-1"
                      />
                      <Button
                        size="xs"
                        variant="ghost"
                        iconName={user?.status === 'active' ? 'UserX' : 'UserCheck'}
                        onClick={() => handleUserAction(user?.id, user?.status === 'active' ? 'deactivate' : 'activate')}
                        className="p-1"
                      />
                      <Button
                        size="xs"
                        variant="ghost"
                        iconName="Trash2"
                        onClick={() => handleUserAction(user?.id, 'delete')}
                        className="p-1 text-destructive hover:text-destructive"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementTable;