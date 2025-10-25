import React, { useState } from 'react';
import { User } from '../types';
import { ArrowLeftIcon, AlertTriangleIcon, CameraIcon } from '../components/Icons';
import ImageSelectorModal from '../components/ImageSelectorModal';

interface SettingsPageProps {
  currentUser: User;
  onNavigateBack: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, onNavigateBack, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Simulated form state
  const [name, setName] = useState(currentUser.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ ...currentUser, name });
    alert(`Profile updated for ${name}! (Simulated)`);
  };
  
  const handleAvatarSelect = (newAvatarUrl: string) => {
    onUpdateProfile({ ...currentUser, avatarUrl: newAvatarUrl });
    setIsModalOpen(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    // In a real app, this would be an API call
    alert("Password changed successfully! (Simulated)");
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    const confirmation = window.confirm("Are you sure you want to delete your account? This action is irreversible.");
    if (confirmation) {
      // In a real app, this would trigger an API call and then log the user out
      alert("Account deleted. (Simulated)");
      onNavigateBack(); // Navigate away after deletion
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-brand-border group-hover:border-brand-primary transition-colors" />
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Change profile picture"
                >
                  <CameraIcon className="w-8 h-8" />
                </button>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-brand-muted">Full Name</label>
                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-2 bg-brand-bg border border-brand-border rounded-md text-brand-secondary focus:ring-1 focus:ring-brand-primary" />
              </div>
            </div>
            <div className="pt-2">
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors animate-pulse-subtle">Save Changes</button>
            </div>
          </form>
        );
      case 'security':
        return (
           <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="current-password">Current Password</label>
              <input type="password" id="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 w-full p-2 bg-brand-bg border border-brand-border rounded-md" />
            </div>
            <div>
              <label htmlFor="new-password">New Password</label>
              <input type="password" id="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 w-full p-2 bg-brand-bg border border-brand-border rounded-md" />
            </div>
             <div>
              <label htmlFor="confirm-password">Confirm New Password</label>
              <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 w-full p-2 bg-brand-bg border border-brand-border rounded-md" />
            </div>
            <div className="pt-2">
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors animate-pulse-subtle">Change Password</button>
            </div>
          </form>
        );
      case 'danger':
        return (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-6 max-w-md">
                <h3 className="text-lg font-bold text-red-300 flex items-center gap-2"><AlertTriangleIcon /> Delete Account</h3>
                <p className="mt-2 text-red-400">
                    Once you delete your account, there is no going back. All of your questions, answers, and contributions will be permanently deleted. Please be certain.
                </p>
                <div className="mt-4">
                    <button onClick={handleDeleteAccount} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors">
                        Delete My Account
                    </button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  const TabButton = ({ id, label }: { id: string, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-semibold transition-colors rounded-md w-full text-left ${activeTab === id ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-brand-surface'}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="animate-fade-in max-w-5xl mx-auto">
        <button onClick={onNavigateBack} className="flex items-center gap-2 text-brand-muted hover:text-brand-secondary transition-colors mb-6">
          <ArrowLeftIcon />
          <span>Back</span>
        </button>
        <h1 className="text-4xl font-extrabold text-brand-secondary mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="bg-brand-surface rounded-lg border border-brand-border p-2 flex md:flex-col gap-2">
              <TabButton id="profile" label="Profile" />
              <TabButton id="security" label="Security" />
              <TabButton id="danger" label="Danger Zone" />
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="bg-brand-surface rounded-lg border border-brand-border p-8 min-h-[300px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      <ImageSelectorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAvatar={handleAvatarSelect}
      />
    </>
  );
};

export default SettingsPage;