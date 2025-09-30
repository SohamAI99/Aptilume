import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';
import { activateUser, deactivateUser, suspendUser } from '../../../utils/dbService';
import { 
  UserPlus, 
  Download, 
  Search, 
  Eye, 
  Edit, 
  Check, 
  X, 
  UserX, 
  Trash2 
} from 'lucide-react';

const UserManagementTable = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
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
    const matchesRole = roleFilter === 'all' || user?.userType === roleFilter;
    const matchesStatus = statusFilter === 'all' || (user?.isActive === true ? 'active' : user?.status || 'inactive') === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'activate':
          await activateUser(userId);
          break;
        case 'deactivate':
          await deactivateUser(userId);
          break;
        case 'suspend':
          await suspendUser(userId);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this user?')) {
            // In a real app, you would implement user deletion here
            console.log('DELETE user', userId);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error performing ${action} on user ${userId}:`, error);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers?.length === 0) {
      alert('Please select users first');
      return;
    }
    
    try {
      switch (action) {
        case 'activate':
          await Promise.all(selectedUsers.map(userId => activateUser(userId)));
          break;
        case 'deactivate':
          await Promise.all(selectedUsers.map(userId => deactivateUser(userId)));
          break;
        case 'export':
          // In a real app, you would implement export functionality here
          console.log('Export users:', selectedUsers);
          break;
        default:
          break;
      }
      
      setSelectedUsers([]);
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
    }
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

  const getStatusBadge = (user) => {
    // Determine status based on isActive and status fields
    let status = 'inactive';
    if (user?.isActive === true) {
      status = 'active';
    } else if (user?.status === 'suspended') {
      status = 'suspended';
    } else if (user?.isActive === false) {
      status = 'inactive';
    }
    
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
      teacher: { color: 'bg-purple-100 text-purple-800', label: 'Teacher' },
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
            icon={<UserPlus className="h-4 w-4" />}
            iconPosition="left"
            onClick={() => console.log('Add new user')}
          >
            Add User
          </Button>
          <Button
            variant="outline"
            icon={<Download className="h-4 w-4" />}
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
              icon={<Search className="h-4 w-4" />}
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
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    onChange={toggleAllUsers}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={() => toggleUserSelection(user?.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=0D8ABC&color=fff`}
                          alt={user?.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">{user?.name}</div>
                        <div className="text-sm text-muted-foreground">{user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user?.userType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(user)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {user?.lastActive ? new Date(user?.lastActive?.seconds * 1000)?.toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => console.log('View user', user?.id)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Edit className="h-4 w-4" />}
                        onClick={() => console.log('Edit user', user?.id)}
                      />
                      {user?.isActive ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<X className="h-4 w-4 text-red-600" />}
                          onClick={() => handleUserAction(user?.id, 'deactivate')}
                        />
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<Check className="h-4 w-4 text-green-600" />}
                          onClick={() => handleUserAction(user?.id, 'activate')}
                        />
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<UserX className="h-4 w-4 text-yellow-600" />}
                        onClick={() => handleUserAction(user?.id, 'suspend')}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        icon={<Trash2 className="h-4 w-4 text-red-600" />}
                        onClick={() => handleUserAction(user?.id, 'delete')}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers?.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No users found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('all');
              setStatusFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;