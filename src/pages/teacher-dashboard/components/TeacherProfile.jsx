import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import * as authService from '../../../utils/authService';

const TeacherProfile = ({ currentUser }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    experience: '',
    qualification: ''
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        subject: currentUser.subject || '',
        experience: currentUser.experience || '',
        qualification: currentUser.qualification || ''
      });
    }
  }, [currentUser]);

  const handleSave = () => {
    // Save profile data logic would go here
    console.log('Profile saved:', profileData);
    // Show success message
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Teacher Profile</h2>
        <Button onClick={() => navigate('/teacher-dashboard')} variant="outline" iconName="ArrowLeft">
          Back to Dashboard
        </Button>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img 
                src={currentUser?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
              <button className="absolute bottom-2 right-2 bg-primary p-2 rounded-full hover:bg-primary/80 transition-colors">
                <Icon name="Camera" size={16} color="white" />
              </button>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold">{profileData.name || 'Teacher'}</h3>
              <p className="text-muted-foreground">{profileData.subject || 'Subject Teacher'}</p>
            </div>
          </div>

          {/* Profile Information Form */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Enter your email"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject/Department</label>
                <input
                  type="text"
                  value={profileData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Enter your subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Qualification</label>
                <input
                  type="text"
                  value={profileData.qualification}
                  onChange={(e) => handleChange('qualification', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Enter your qualification"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={profileData.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                  placeholder="Enter years of experience"
                />
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Icon name="Shield" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="font-medium">Teacher</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-success/10 p-2 rounded-lg">
                      <Icon name="Calendar" size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">January 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" onClick={() => navigate('/teacher/settings')}>
                Settings
              </Button>
              <Button onClick={handleSave} iconName="Save">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;