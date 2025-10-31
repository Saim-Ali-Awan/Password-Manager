'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiCopy, BiEdit, BiTrash } from 'react-icons/bi';

// CHANGE YOUR PIN HERE
const PIN = '627426';

const Manager = () => {
  // === PIN STATE (WITH 3 TRIES) ===
  const [pinInput, setPinInput] = useState('');
  const [triesLeft, setTriesLeft] = useState(3);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // === APP STATE ===
  const imgRef = useRef(null);
  const [form, setForm] = useState({ site: '', username: '', password: '' });
  const [passwords, setPasswords] = useState([]);

  // Load passwords from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('passwords');
    if (saved) {
      try {
        setPasswords(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load passwords');
      }
    }
  }, []);

  // Save passwords to localStorage
  useEffect(() => {
    if (passwords.length > 0) {
      localStorage.setItem('passwords', JSON.stringify(passwords));
    }
  }, [passwords]);

  // Countdown timer for lock
  useEffect(() => {
    if (lockTimeLeft > 0) {
      const timer = setTimeout(() => setLockTimeLeft(lockTimeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLocked) {
      setIsLocked(false);
      setTriesLeft(3);
    }
  }, [lockTimeLeft, isLocked]);

  // === PIN SUBMIT ===
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (pinInput === PIN) {
      setIsUnlocked(true);
      setTriesLeft(3);
      toast.success('Welcome back!');
    } else {
      const newTries = triesLeft - 1;
      setTriesLeft(newTries);
      if (newTries === 0) {
        setIsLocked(true);
        setLockTimeLeft(30);
        toast.error('Too many tries! Wait 30s');
      } else {
        toast.error(`Wrong PIN! ${newTries} ${newTries === 1 ? 'try' : 'tries'} left`);
      }
      setPinInput('');
    }
  };

  // === FORM FUNCTIONS ===
  const showPassword = () => {
    if (!imgRef.current) return;
    imgRef.current.src.includes('eyecross.png')
      ? (imgRef.current.src = '/eye.png')
      : (imgRef.current.src = '/eyecross.png');
  };

  const savePassword = () => {
    if (!form.site || !form.username || !form.password) {
      toast.error('All fields are required');
      return;
    }
    const newEntry = {
      id: Date.now(),
      site: form.site.trim(),
      username: form.username.trim(),
      password: form.password,
    };
    setPasswords((prev) => [...prev, newEntry]);
    setForm({ site: '', username: '', password: '' });
    toast.success('Password saved!');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // === PIN SCREEN (SAME LAYOUT) ===
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center p-4">
        <ToastContainer position="top-right" theme="colored" autoClose={3000} />
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
              className={`w-full p-4 text-center text-lg tracking-widest rounded-2xl border-2 
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

  // === MAIN APP (UNCHANGED) ===
  return (
    <div className="min-h-screen bg-[color:var(--background)] p-4 md:p-8">
      <ToastContainer position="top-right" theme="colored" autoClose={2000} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--accent)] bg-clip-text text-transparent mb-4">
            Pass<span className="text-[color:var(--primary)]">OP</span>
          </h1>
          <p className="text-xl text-[color:var(--muted-foreground)]">Your secure password manager</p>
        </div>

        {/* Form Card */}
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
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full p-4 pr-12 text-lg rounded-2xl border-2 border-[color:var(--border)] bg-[color:var(--input)] focus:border-[color:var(--ring)] focus:outline-none transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:scale-110 transition-transform"
                >
                  <img
                    ref={imgRef}
                    src="/eye.png"
                    alt="Toggle"
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
              Save Password
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
                          <button className="p-1 opacity-60" disabled>
                            <BiCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[100px] inline-block">{item.username}</span>
                          <button className="p-1 opacity-60" disabled>
                            <BiCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">••••••••</span>
                          <button className="p-1 opacity-60" disabled>
                            <BiCopy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button className="p-1 opacity-60" disabled aria-label="Edit">
                            <BiEdit className="w-4 h-4" />
                          </button>
                          <button className="p-1 opacity-60" disabled aria-label="Delete">
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
