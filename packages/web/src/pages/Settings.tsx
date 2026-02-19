import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Plus, Trash2, Copy, RefreshCw, Key, Shield, Clock, Users, RotateCcw } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { toastError, toastSuccess } from '@/lib/toast';
import { authApi, api } from '@/services/api';
import type { AuthSettings, AuthType, User } from '@/types';
import { Toaster } from '@/components/ui/toaster';

export function Settings() {
  const [settings, setSettings] = useState<AuthSettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [serverConnected, setServerConnected] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await authApi.getSettings();
      setSettings({
        enabled: data.enabled,
        type: data.type,
        jwtSecret: data.jwtSecret,
        jwtExpiry: data.jwtExpiry,
        apiKey: data.apiKey,
        allowRegister: data.allowRegister,
      });
      setUsers(data.users || []);
      if (!serverConnected) setServerConnected(true);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      if (serverConnected) setServerConnected(false);
      toastError('Server disconnected', 'Unable to connect to mock server');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await authApi.updateSettings(settings);
      toastSuccess('Settings saved', 'Authentication settings updated');
    } catch (err) {
      toastError('Failed to save', 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all data? This will delete all endpoints, schemas, and authentication settings.')) {
      return;
    }
    try {
      await api.post('/reset');
      toastSuccess('Reset complete', 'All data has been cleared');
      fetchSettings();
    } catch (err) {
      toastError('Failed to reset', 'Please try again');
    }
  };

  const handleGenerateSecret = () => {
    const secret = Array.from({ length: 32 }, () => 
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]
    ).join('');
    setSettings(prev => prev ? { ...prev, jwtSecret: secret } : null);
  };

  const handleCopySecret = () => {
    if (settings?.jwtSecret) {
      navigator.clipboard.writeText(settings.jwtSecret);
      toastSuccess('Copied', 'Secret copied to clipboard');
    }
  };

  const handleAddUser = async () => {
    if (!newUsername.trim() || !newPassword.trim()) return;
    try {
      await authApi.createUser(newUsername.trim(), newPassword);
      toastSuccess('User created', `User "${newUsername}" created`);
      setNewUsername('');
      setNewPassword('');
      setShowAddUser(false);
      fetchSettings();
    } catch (err: any) {
      toastError('Failed to create user', err.response?.data?.error || 'Please try again');
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (!confirm(`Delete user "${username}"?`)) return;
    try {
      await authApi.deleteUser(id);
      toastSuccess('User deleted', 'User removed successfully');
      fetchSettings();
    } catch (err) {
      toastError('Failed to delete user', 'Please try again');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <Header serverConnected={serverConnected} />
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-neutral-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header serverConnected={serverConnected} />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Authentication Settings</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-400" />
                <h3 className="font-medium">Enable Authentication</h3>
              </div>
              <button
                onClick={() => setSettings(prev => prev ? { ...prev, enabled: !prev.enabled } : null)}
                className={`w-12 h-6 rounded-full transition-colors ${settings?.enabled ? 'bg-primary-600' : 'bg-neutral-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings?.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {settings?.enabled && (
            <>
              <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Authentication Type</label>
                  <select
                    value={settings.type}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, type: e.target.value as AuthType } : null)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100"
                  >
                    <option value="jwt">JWT (Bearer Token)</option>
                    <option value="basic">Basic Auth</option>
                    <option value="apiKey">API Key</option>
                    <option value="bearer">Bearer Token</option>
                  </select>
                </div>

                  {(settings.type === 'jwt' || settings.type === 'bearer') && (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm text-neutral-400">JWT Secret</label>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={handleGenerateSecret}>
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Generate
                            </Button>
                            {settings.jwtSecret && (
                              <Button variant="ghost" size="sm" onClick={handleCopySecret}>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            )}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={settings.jwtSecret || ''}
                          onChange={(e) => setSettings(prev => prev ? { ...prev, jwtSecret: e.target.value } : null)}
                          placeholder="Enter JWT secret..."
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono text-sm"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                          <Clock className="h-4 w-4" />
                          Token Expiry
                        </label>
                        <select
                          value={settings.jwtExpiry}
                          onChange={(e) => setSettings(prev => prev ? { ...prev, jwtExpiry: e.target.value } : null)}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100"
                        >
                          <option value="1h">1 hour</option>
                          <option value="6h">6 hours</option>
                          <option value="12h">12 hours</option>
                          <option value="24h">24 hours</option>
                          <option value="7d">7 days</option>
                          <option value="30d">30 days</option>
                        </select>
                      </div>
                    </>
                  )}

                {settings.type === 'apiKey' && (
                  <div>
                    <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                      <Key className="h-4 w-4" />
                      API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.apiKey || ''}
                        onChange={(e) => setSettings(prev => prev ? { ...prev, apiKey: e.target.value } : null)}
                        placeholder="Enter API key..."
                        className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100 font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const key = Array.from({ length: 32 }, () => 
                            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]
                          ).join('');
                          setSettings(prev => prev ? { ...prev, apiKey: key } : null);
                        }}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary-400" />
                    <h3 className="font-medium">Allow Public Registration</h3>
                  </div>
                  <button
                    onClick={() => setSettings(prev => prev ? { ...prev, allowRegister: !prev.allowRegister } : null)}
                    className={`w-12 h-6 rounded-full transition-colors ${settings?.allowRegister ? 'bg-primary-600' : 'bg-neutral-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings?.allowRegister ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <p className="text-xs text-neutral-500">
                  When enabled, users can register themselves at /auth/register
                </p>
              </div>

              <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Users</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowAddUser(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add User
                  </Button>
                </div>

                {users.length === 0 ? (
                  <p className="text-sm text-neutral-500 text-center py-4">No users yet</p>
                ) : (
                  <div className="space-y-2">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                        <span className="text-sm">{user.username}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-neutral-500 hover:text-red-400"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-red-400 border-red-900 hover:bg-red-900/20"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>

        {showAddUser && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 w-96">
              <h3 className="text-lg font-medium mb-4">Add User</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-1">Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-neutral-100"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => { setShowAddUser(false); setNewUsername(''); setNewPassword(''); }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} disabled={!newUsername.trim() || !newPassword.trim()}>
                    Add User
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Toaster />
      </main>
    </div>
  );
}
