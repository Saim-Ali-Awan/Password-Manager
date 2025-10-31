'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiCopy, BiEdit, BiTrash } from 'react-icons/bi';

const PIN = '627426';

const Manager = () => {
  // === PIN STATE ===
  const [pinInput, setPinInput] = useState('');
  const [triesLeft, setTriesLeft] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // === APP STATE ===
  const [form, setForm] = useState({ site: '', username: '', password: '' });
  const [passwords, setPasswords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // NEW: Toggle visibility

  // Load & Save
  useEffect(() => {
    const saved = localStorage.getItem('passwords');
    if (saved) setPasswords(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }, [passwords]);

  // Lock timer
  useEffect(() => {
    if (lockTimeLeft > 0) {
      const timer = setTimeout(() => setLockTimeLeft(lockTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLocked) {
      setIsLocked(false);
      setTriesLeft(3);
    }
  }, [lockTimeLeft, isLocked]);

  // === PIN ===
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (pinInput === PIN) {
      setIsUnlocked(true);
      setTriesLeft(3);
      toast.success('Unlocked!', { autoClose: 3000 });
    } else {
      const newTries = triesLeft - 1;
      setTriesLeft(newTries);
      if (newTries === 0) {
        setIsLocked(true);
        setLockTimeLeft(30);
        toast.error('Too many tries! Wait 30s', { autoClose: 3000 });
      } else {
        toast.error(`Wrong PIN! ${newTries} left`, { autoClose: 3000 });
      }
      setPinInput('');
    }
  };

  // === SAVE / UPDATE ===
  const savePassword = () => {
    if (!form.site || !form.username || !form.password) {
      toast.error('All fields required', { autoClose: 3000 });
      return;
    }

    if (editingId !== null) {
      setPasswords(prev =>
        prev.map(item =>
          item.id === editingId
            ? { ...item, site: form.site.trim(), username: form.username.trim(), password: form.password }
            : item
        )
      );
      setEditingId(null);
      toast.success('Updated!', { autoClose: 3000 });
    } else {
      setPasswords(prev => [...prev, { id: Date.now(), ...form }]);
      toast.success('Saved!', { autoClose: 3000 });
    }
    setForm({ site: '', username: '', password: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === EDIT / DELETE / COPY ===
  const editPassword = (id) => {
    const item = passwords.find(p => p.id === id);
    if (item) {
      setForm({ site: item.site, username: item.username, password: item.password });
      setEditingId(id);
      window.scrollTo(0, 0);
    }
  };

  const deletePassword = (id) => {
    if (confirm('Delete this password?')) {
      setPasswords(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted!', { autoClose: 3000 });
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!', { autoClose: 2000 });
  };

  // === PIN SCREEN ===
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center p-4">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <div className="bg-[color:var(--card)]/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-[color:var(--border)] w-full max-w-sm">
          <h2 className="text-3xl font-bold text-center mb-6 text-[color:var(--foreground)]">
            Enter PIN
          </h2>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter Pin"
              maxLength={Infinity}
              disabled={isLocked}
              className={`w-full p-4 text-center text-xl tracking-widest rounded-2xl border-2 
                ${isLocked ? 'opacity-50 cursor-not-allowed' : ''} 
                border-[color:var(--border)] bg-[color:var(--input)] focus:border-[color:var(--ring)] focus:outline-none transition-all`}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLocked}
              className={`w-full py-3 rounded-2xl font-bold text-lg transition-all
                ${isLocked 
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] text-[color:var(--primary-foreground)] hover:scale-[1.02]'
                }`}
            >
              {isLocked ? `Wait ${lockTimeLeft}s` : 'Unlock'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // === MAIN APP ===
  return (
    <div className="min-h-screen bg-[color:var(--background)] p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] bg-clip-text text-transparent mb-4">
            Pass<span className="text-[color:var(--primary)]">OP</span>
          </h1>
          <p className="text-xl text-[color:var(--muted-foreground)]">Your secure password manager</p>
        </div>

        {/* Form */}
        <div className="bg-[color:var(--card)]/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-[var(--shadow-2xl)] border border-[color:var(--border)] mb-8">
          <div className="space-y-6">
            <input
              name="site"
              value={form.site}
              onChange={handleChange}
              placeholder="Website URL"
              className="w-full p-4 text-lg rounded-2xl border-2 border-[color:var(--border)] bg-[color:var(--input)] focus:border-[color:var(--ring)] focus:outline-none transition-all duration-300"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                className="p-4 text-lg rounded-2xl border-2 border-[color:var(--border)] bg-[color:var(--input)] focus:border-[color:var(--ring)] focus:outline-none transition-all duration-300"
              />

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}  // THIS IS THE FIX
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-4 pr-12 text-lg rounded-2xl border-2 border-[color:var(--border)] bg-[color:var(--input)] focus:border-[color:var(--ring)] focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}  // Toggle
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:scale-110 transition-transform"
                >
                  <img
                    src={showPassword ? '/eyecross.png' : '/eye.png'}  // Image changes too
                    alt="Toggle password"
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>

            <button
              onClick={savePassword}
              className="w-full bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] text-[color:var(--primary-foreground)] py-4 rounded-2xl font-bold text-lg shadow-[var(--shadow-xl)] hover:shadow-[var(--shadow-2xl)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {editingId ? 'Update Password' : 'Save Password'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8">
          <h2 className="bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] bg-clip-text text-transparent text-4xl font-bold mb-4">
            Your Passwords
          </h2>

          {passwords.length === 0 ? (
            <div className="text-center py-8 text-[color:var(--muted-foreground)] text-lg">
              No passwords saved yet
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[color:var(--border)]">
              <table className="w-full min-w-[600px]">
                <thead className="bg-[color:var(--muted)] text-[color:var(--muted-foreground)] text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Site</th>
                    <th className="px-4 py-3 text-left">Username</th>
                    <th className="px-4 py-3 text-left">Password</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--border)]">
                  {passwords.map((item) => (
                    <tr key={item.id} className="hover:bg-[color:var(--muted)/0.3] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[color:var(--primary)] hover:underline truncate max-w-[120px] inline-block"
                          >
                            {item.site}
                          </a>
                          <button onClick={() => copyText(item.site)} className="p-1 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)]">
                            <BiCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[100px] inline-block">{item.username}</span>
                          <button onClick={() => copyText(item.username)} className="p-1 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)]">
                            <BiCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{item.password || '••••••••'}</span>
                          <button onClick={() => copyText(item.password)} className="p-1 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)]">
                            <BiCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => editPassword(item.id)}
                            className="p-1 text-[color:var(--accent-foreground)] hover:bg-[color:var(--accent)/0.2] rounded-md transition-colors"
                          >
                            <BiEdit className="w-4 h-4 text-black" />
                          </button>
                          <button
                            onClick={() => deletePassword(item.id)}
                            className="p-1 text-[color:var(--destructive)] hover:bg-[color:var(--destructive)/0.1] rounded-md transition-colors"
                          >
                            <BiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Manager;
