import React from 'react';
import ProfileDropdown from './ProfileDropdown';

const AccountSection = ({ currentUser, onLogout }) => {
  return (
    <div className="flex items-center gap-4">
      <ProfileDropdown currentUser={currentUser} onLogout={onLogout} />
    </div>
  );
};

export default AccountSection;