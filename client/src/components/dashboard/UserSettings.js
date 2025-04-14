import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import Modal from '../common/Modal';

/**
 * UserSettings component allows users to manage their account settings,
 * profile information, notification preferences, and payment methods
 * 
 * @param {Object} user - User data object
 * @param {boolean} loading - Loading state indicator
 * @param {Function} onUpdateProfile - Function to update user profile
 * @param {Function} onUpdatePassword - Function to update user password
 * @param {Function} onUpdateNotifications - Function to update notification preferences
 * @param {Function} onDeleteAccount - Function to delete user account
 */
const UserSettings = ({ 
  user, 
  loading = false, 
  onUpdateProfile,
  onUpdatePassword,
  onUpdateNotifications,
  onDeleteAccount
}) => {
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    username: '',
    bio: '',
    website: '',
    location: '',
    avatarUrl: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNewContributions: true,
    emailProjectUpdates: true,
    emailNewFollowers: true,
    emailNewComments: true,
    emailNewMessages: true,
    emailNewsletter: false,
    emailProjectSuccess: true,
    browserNotifications: true
  });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState([]);

  // UI state
  const [activeTab, setActiveTab] = useState('profile');
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [notificationsSubmitting, setNotificationsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Initialize forms with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || '',
        avatarUrl: user.avatarUrl || ''
      });
      
      if (user.notificationPreferences) {
        setNotificationPrefs(user.notificationPreferences);
      }
      
      if (user.paymentMethods) {
        setPaymentMethods(user.paymentMethods);
      }
    }
  }, [user]);

  // Form change handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when field is being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when field is being edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Form submission handlers
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errors = validateProfileForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setProfileSubmitting(true);
    try {
      await onUpdateProfile(profileForm);
      // Success notification could be added here
    } catch (error) {
      // Handle API errors
      setFormErrors({
        form: error.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePasswordForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setPasswordSubmitting(true);
    try {
      await onUpdatePassword(passwordForm);
      // Reset form on success
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      // Success notification could be added here
    } catch (error) {
      // Handle API errors
      setFormErrors({
        form: error.message || 'Failed to update password. Please try again.'
      });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    setNotificationsSubmitting(true);
    
    try {
      await onUpdateNotifications(notificationPrefs);
      // Success notification could be added here
    } catch (error) {
      // Handle API errors
      setFormErrors({
        notifications: error.message || 'Failed to update notification preferences. Please try again.'
      });
    } finally {
      setNotificationsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== user.username) {
      setFormErrors({
        deleteConfirm: 'The confirmation text does not match your username.'
      });
      return;
    }
    
    try {
      await onDeleteAccount();
      // The user will be logged out and redirected by the parent component
    } catch (error) {
      setFormErrors({
        deleteAccount: error.message || 'Failed to delete account. Please try again.'
      });
    } finally {
      setShowDeleteModal(false);
      setDeleteConfirmText('');
    }
  };

  // Form validation
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!profileForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!profileForm.username.trim()) {
      errors.username = 'Username is required';
    } else if (profileForm.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (profileForm.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(profileForm.website)) {
      errors.website = 'Website URL is invalid';
    }
    
    return errors;
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  // Helper method to handle file uploads
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setProfileForm(prev => ({
      ...prev,
      avatarUrl: previewUrl,
      avatarFile: file // Store the file for later upload
    }));
  };

  // Remove payment method handler
  const handleRemovePaymentMethod = (paymentMethodId) => {
    // In a real app this would call an API to remove the payment method
    setPaymentMethods(prev => prev.filter(method => method.id !== paymentMethodId));
  };

  if (loading) {
    return (
      <Card className="user-settings user-settings--loading">
        <div className="user-settings__loading-indicator">
          Loading settings...
        </div>
      </Card>
    );
  }

  return (
    <Card className="user-settings">
      <div className="user-settings__header">
        <h2 className="user-settings__title">Account Settings</h2>
      </div>

      <div className="user-settings__tabs">
        <button
          className={`user-settings__tab ${activeTab === 'profile' ? 'user-settings__tab--active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`user-settings__tab ${activeTab === 'password' ? 'user-settings__tab--active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Password
        </button>
        <button
          className={`user-settings__tab ${activeTab === 'notifications' ? 'user-settings__tab--active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notifications
        </button>
        <button
          className={`user-settings__tab ${activeTab === 'payment' ? 'user-settings__tab--active' : ''}`}
          onClick={() => setActiveTab('payment')}
        >
          Payment Methods
        </button>
        <button
          className={`user-settings__tab ${activeTab === 'danger' ? 'user-settings__tab--active' : ''}`}
          onClick={() => setActiveTab('danger')}
        >
          Danger Zone
        </button>
      </div>

      <div className="user-settings__content">
        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="user-settings__form">
            <div className="user-settings__avatar-section">
              <div className="user-settings__avatar">
                {profileForm.avatarUrl ? (
                  <img 
                    src={profileForm.avatarUrl} 
                    alt="Profile" 
                    className="user-settings__avatar-img" 
                  />
                ) : (
                  <div className="user-settings__avatar-placeholder">
                    {profileForm.fullName ? profileForm.fullName.charAt(0).toUpperCase() : '?'}
                  </div>
                )}
              </div>
              <div className="user-settings__avatar-controls">
                <label className="user-settings__upload-btn">
                  Upload Photo
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {profileForm.avatarUrl && (
                  <button 
                    type="button"
                    className="user-settings__remove-avatar-btn"
                    onClick={() => setProfileForm(prev => ({ ...prev, avatarUrl: '', avatarFile: null }))}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            
            <div className="user-settings__form-group">
              <label htmlFor="fullName" className="user-settings__label">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={profileForm.fullName}
                onChange={handleProfileChange}
                className="user-settings__input"
              />
              {formErrors.fullName && (
                <div className="user-settings__error">{formErrors.fullName}</div>
              )}
            </div>
            
            <div className="user-settings__form-group">
              <label htmlFor="username" className="user-settings__label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profileForm.username}
                onChange={handleProfileChange}
                className="user-settings__input"
              />
              {formErrors.username && (
                <div className="user-settings__error">{formErrors.username}</div>
              )}
            </div>
            
            <div className="user-settings__form-group">
              <label htmlFor="email" className="user-settings__label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="user-settings__input"
              />
              {formErrors.email && (
                <div className="user-settings__error">{formErrors.email}</div>
              )}
            </div>
            
            <div className="user-settings__form-group">
              <label htmlFor="bio" className="user-settings__label">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                className="user-settings__textarea"
                rows="4"
              />
            </div>
            
            <div className="user-settings__form-group">
              <label htmlFor="website" className="user-settings__label">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                value={profileForm.website}
                onChange={handleProfileChange}
                className="user-settings__input"
                placeholder="https://yourwebsite.com"
              />
              {formErrors.website && (
                <div className="user-settings__error">{formErrors.website}</div>
              )}
            </div>
            
            <div className="user-settings__form-group">
              <label htmlFor="location" className="user-settings__label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={profileForm.location}
                onChange={handleProfileChange}
                className="user-settings__input"
              />
            </div>
            
            {formErrors.form && (
              <div className="user-settings__form-error">{formErrors.form}</div>
            )}
            
            <div className="user-settings__form-actions">
              <Button 
                type="submit" 
                disabled={profileSubmitting}
                className="user-settings__submit-btn"
              >
                {profileSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        )}
        
        {/* Password Settings */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="user-settings__form">
            <div className="user-settings__form-group">
              <label htmlFor="currentPassword" className="user-settings__label">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="user-settings__input"
              />
              {formErrors.currentPassword && (
                <div className="user-settings__error">{formErrors.currentPassword}</div>
              )}
            </div>
            
            <div className="user-settings__form-group">
              <label htmlFor="newPassword" className="user-settings__label">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="user-settings__input"
              />
              {formErrors.newPassword && (
                <div className="user-settings__error">{formErrors.newPassword}</div>
              )}
            </div>
            
            <div className="user-settings__form-group">
              <label htmlFor="confirmPassword" className="user-settings__label">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="user-settings__input"
              />
              {formErrors.confirmPassword && (
                <div className="user-settings__error">{formErrors.confirmPassword}</div>
              )}
            </div>
            
            {formErrors.form && (
              <div className="user-settings__form-error">{formErrors.form}</div>
            )}
            
            <div className="user-settings__form-actions">
              <Button 
                type="submit" 
                disabled={passwordSubmitting}
                className="user-settings__submit-btn"
              >
                {passwordSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        )}
        
        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleNotificationsSubmit} className="user-settings__form">
            <div className="user-settings__form-section">
              <h3 className="user-settings__section-title">Email Notifications</h3>
              
              <div className="user-settings__checkbox-group">
                <input
                  type="checkbox"
                  id="emailNewContributions"
                  name="emailNewContributions"
                  checked={notificationPrefs.emailNewContributions}
                  onChange={handleNotificationChange}
                  className="user-settings__checkbox"
                />
                <label htmlFor="emailNewContributions" className="user-settings__checkbox-label">
                  New contributions to my projects
                </label>
              </div>
              
              <div className="user-settings__checkbox-group">
                <input
                  type="checkbox"
                  id="emailProjectUpdates"
                  name="emailProjectUpdates"
                  checked={notificationPrefs.emailProjectUpdates}
                  onChange={handleNotificationChange}
                  className="user-settings__checkbox"
                />
                <label htmlFor="emailProjectUpdates" className="user-settings__checkbox-label">
                  Updates on projects I've backed
                </label>
              </div>
              
              <div className="user-settings__checkbox-group">
                <input
                  type="checkbox"
                  id="emailNewFollowers"
                  name="emailNewFollowers"
                  checked={notificationPrefs.emailNewFollowers}
                  onChange={handleNotificationChange}
                  className="user-settings__checkbox"
                />
                <label htmlFor="emailNewFollowers" className="user-settings__checkbox-label">
                  New followers
                </label>
              </div>
              
              <div className="user-settings__checkbox-group">
                <input
                  type="checkbox"
                  id="emailNewComments"
                  name="emailNewComments"
                  checked={notificationPrefs.emailNewComments}
                  onChange={handleNotificationChange}
                  className="user-settings__checkbox"
                />
                <label htmlFor="emailNewComments" className="user-settings__checkbox-label">
                  Comments on my projects
                </label>
              </div>
              
              <div className="user-settings__checkbox-group">
                <input
                  type="checkbox"
                  id="emailNewMessages"
                  name="emailNewMessages"
                  checked={notificationPrefs.emailNewMessages}
                  onChange={handleNotificationChange}
                  className="user-settings__checkbox"
                />
                <label htmlFor="emailNewMessages" className="user-settings__checkbox-label">
                  New direct messages
                </label>
              </div>
              
              <div className="user-settings__checkbox-group">
                <input
                  type="checkbox"
                  id="emailProjectSuccess"
                  name="emailProjectSuccess"
                  checked={notificationPrefs.emailProjectSuccess}
                  onChange={handleNotificationChange}
                  className="user-settings__checkbox"
                />
                <label htmlFor="emailProjectSuccess" className="user-settings__checkbox-label">
                  Funded project notifications
                </label>
              </div>
              
              <div className="user-settings__checkbox-group">
                <input
                  type="checkbox"
                  id="emailNewsletter"
                  name="emailNewsletter"
                  checked={notificationPrefs.emailNewsletter}
                  onChange={handleNotificationChange}
                  className="user-settings__checkbox"
                />
                <label htmlFor="emailNewsletter" className="user-settings__checkbox-label">
                  Platform newsletter and recommendations
                </label>
              </div>
            </div>
            
            <div className="user-settings__form-section">
              <h3 className="user-settings__section-title">Browser Notifications</h3>
              
              <div className="user-settings__checkbox-group">
                <input
                  type="checkbox"
                  id="browserNotifications"
                  name="browserNotifications"
                  checked={notificationPrefs.browserNotifications}
                  onChange={handleNotificationChange}
                  className="user-settings__checkbox"
                />
                <label htmlFor="browserNotifications" className="user-settings__checkbox-label">
                  Enable browser notifications
                </label>
              </div>
            </div>
            
            {formErrors.notifications && (
              <div className="user-settings__form-error">{formErrors.notifications}</div>
            )}
            
            <div className="user-settings__form-actions">
              <Button 
                type="submit" 
                disabled={notificationsSubmitting}
                className="user-settings__submit-btn"
              >
                {notificationsSubmitting ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </form>
        )}
        
        {/* Payment Methods */}
        {activeTab === 'payment' && (
          <div className="user-settings__payment-methods">
            <h3 className="user-settings__section-title">Your Payment Methods</h3>
            
            {paymentMethods.length === 0 ? (
              <div className="user-settings__empty-state">
                <p>You don't have any payment methods saved yet.</p>
              </div>
            ) : (
              <div className="user-settings__payment-list">
                {paymentMethods.map(method => (
                  <div key={method.id} className="payment-method-item">
                    <div className="payment-method-item__icon">
                      {method.type === 'card' ? '💳' : 
                       method.type === 'bank' ? '🏦' : 
                       method.type === 'paypal' ? 'PayPal' : '💰'}
                    </div>
                    <div className="payment-method-item__details">
                      <div className="payment-method-item__name">
                        {method.name}
                        {method.isDefault && (
                          <span className="payment-method-item__default-badge">Default</span>
                        )}
                      </div>
                      <div className="payment-method-item__info">
                        {method.type === 'card' && `•••• ${method.last4} - Exp: ${method.expMonth}/${method.expYear}`}
                        {method.type === 'bank' && `•••• ${method.last4}`}
                        {method.type === 'paypal' && method.email}
                      </div>
                    </div>
                    <div className="payment-method-item__actions">
                      {!method.isDefault && (
                        <button 
                          type="button" 
                          className="payment-method-item__set-default-btn"
                          onClick={() => {
                            // In a real app, this would call an API
                            setPaymentMethods(prevMethods => 
                              prevMethods.map(pm => ({
                                ...pm,
                                isDefault: pm.id === method.id
                              }))
                            );
                          }}
                        >
                          Set as Default
                        </button>
                      )}
                      <button 
                        type="button" 
                        className="payment-method-item__remove-btn"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="user-settings__payment-actions">
              <Button className="user-settings__add-payment-btn">
                Add Payment Method
              </Button>
            </div>
          </div>
        )}
        
        {/* Danger Zone */}
        {activeTab === 'danger' && (
          <div className="user-settings__danger-zone">
            <h3 className="user-settings__danger-title">Danger Zone</h3>
            <p className="user-settings__danger-description">
              Actions in this section can permanently delete your account and all associated data.
              These actions cannot be undone.
            </p>
            
            <div className="user-settings__danger-actions">
              <Button 
                type="button" 
                className="user-settings__delete-account-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Account"
        >
          <div className="delete-account-modal">
            <p className="delete-account-modal__warning">
              Warning: This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </p>
            
            <p>To confirm, please type your username: <strong>{user.username}</strong></p>
            
            <div className="delete-account-modal__confirm-input">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="delete-account-modal__input"
                placeholder="Enter your username"
              />
            </div>
            
            {formErrors.deleteConfirm && (
              <div className="delete-account-modal__error">{formErrors.deleteConfirm}</div>
            )}
            
            {formErrors.deleteAccount && (
              <div className="delete-account-modal__error">{formErrors.deleteAccount}</div>
            )}
            
            <div className="delete-account-modal__actions">
              <button 
                type="button" 
                className="delete-account-modal__cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="delete-account-modal__delete-btn"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== user.username}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
};

UserSettings.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    bio: PropTypes.string,
    website: PropTypes.string,
    location: PropTypes.string,
    avatarUrl: PropTypes.string,
    notificationPreferences: PropTypes.object,
    paymentMethods: PropTypes.array
  }),
  loading: PropTypes.bool,
  onUpdateProfile: PropTypes.func.isRequired,
  onUpdatePassword: PropTypes.func.isRequired,
  onUpdateNotifications: PropTypes.func.isRequired,
  onDeleteAccount: PropTypes.func.isRequired
};

export default UserSettings;