// src/components/Manager.jsx
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BiCopy, BiEdit, BiTrash, BiShow, BiHide } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
  const eyeRef = useRef(null);
  const passwordRef = useRef(null);

  const [form, setForm] = useState({ site: '', username: '', password: '' });
  const [passwords, setPasswords] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('passwords');
    if (saved) {
      try {
        setPasswords(JSON.parse(saved));
      } catch (e) {
        toast.error('Failed to load passwords');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }, [passwords]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
    if (passwordRef.current) {
      passwordRef.current.type = showPassword ? 'password' : 'text';
    }
  }, [showPassword]);

  // Reset eye icon
  useEffect(() => {
    if (eyeRef.current) {
      eyeRef.current.src = showPassword ? '/eyecross.png' : '/eye.png';
    }
  }, [showPassword]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const savePassword = useCallback(() => {
    if (!form.site || !form.username || !form.password) {
      toast.error('Please fill all fields');
      return;
    }

    if (editId) {
      setPasswords((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...form } : item
        )
      );
      setEditId(null);
      toast.success('Password updated!');
    } else {
      const newEntry = { id: uuidv4(), ...form };
      setPasswords((prev) => [...prev, newEntry]);
      toast.success('Password saved!');
    }

    setForm({ site: '', username: '', password: '' });
    setShowPassword(false);
  }, [form, editId]);

  const copyText = useCallback((text) => {
    navigator.clipboard.writeText(text).then(
      () => toast.success('Copied!'),
      () => toast.error('Copy failed')
    );
  }, []);

  const handleEdit = useCallback((id) => {
    const item = passwords.find((p) => p.id === id);
    if (item) {
      setForm({ site: item.site, username: item.username, password: item.password });
      setEditId(id);
      setShowPassword(false);
      toast.info('Edit mode');
    }
  }, [passwords]);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Delete this password?')) {
      setPasswords((prev) => prev.filter((p) => p.id !== id));
      toast.info('Deleted');
    }
  }, []);

  // Memoized table rows
  const tableRows = useMemo(() => {
    return passwords.map((item) => (
      <tr
        key={item.id}
        className="hover:bg-[color:var(--muted)/0.05] transition-colors"
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <a
              href={item.site}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--primary)] hover:underline truncate max-w-[140px] md:max-w-[200px] inline-block"
            >
              {item.site}
            </a>
            <button
              onClick={() => copyText(item.site)}
              className="p-1 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] transition-colors"
              aria-label="Copy site"
            >
              <BiCopy className="w-4 h-4" />
            </button>
          </div>
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[100px] md:max-w-[160px] inline-block">
              {item.username}
            </span>
            <button
              onClick={() => copyText(item.username)}
              className="p-1 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] transition-colors"
              aria-label="Copy username"
            >
              <BiCopy className="w-4 h-4" />
            </button>
          </div>
        </td>

        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">
              {'•'.repeat(item.password.length)}
            </span>
            <button
              onClick={() => copyText(item.password)}
              className="p-1 text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] transition-colors"
              aria-label="Copy password"
            >
              <BiCopy className="w-4 h-4" />
            </button>
          </div>
        </td>

        <td className="px-4 py-3 text-center">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleEdit(item.id)}
              className="p-1 text-[color:var(--accent)] hover:scale-110 transition-transform"
              aria-label="Edit"
            >
              <BiEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="p-1 text-[color:var(--destructive)] hover:scale-110 transition-transform"
              aria-label="Delete"
            >
              <BiTrash className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    ));
  }, [passwords, copyText, handleEdit, handleDelete]);

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] p-4 md:p-8">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        theme="colored"
        toastClassName="text-sm"
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header – NO GRADIENT */}
        <header className="text-center">
          <h1 className="text-5xl md:text-6xl font-black text-[color:var(--primary)]">
            Pass<span className="text-[color:var(--accent)]">World</span>
          </h1>
          <p className="mt-2 text-lg text-[color:var(--muted-foreground)]">
            Your secure password manager
          </p>
        </header>

        {/* Form Card */}
        <div className="bg-[color:var(--card)] backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[var(--shadow-xl)] border border-[color:var(--border)]">
          <div className="space-y-6">
            {/* Site */}
            <input
              type="url"
              placeholder="Website URL"
              name="site"
              value={form.site}
              onChange={handleChange}
              className="w-full px-4 py-3 text-lg rounded-2xl border-2 border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--ring)] focus:outline-none transition-all duration-200 hover:shadow-lg shadow[var(--primary)] "
            />

            {/* Username + Password */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="px-4 py-3 text-lg rounded-2xl border-2 border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--ring)] focus:outline-none transition-all duration-200 hover:shadow-md"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  value={form.password}
                  ref={passwordRef}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 text-lg rounded-2xl border-2 border-[color:var(--border)] bg-[color:var(--input)] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:border-[color:var(--ring)] focus:outline-none transition-all duration-200 hover:shadow-md"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[color:var(--muted)/0.3] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <BiHide className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                  ) : (
                    <BiShow className="w-5 h-5 text-[color:var(--muted-foreground)]" />
                  )}
                </button>
              </div>
            </div>

            {/* Save Button – NO GRADIENT */}
            <button
              onClick={savePassword}
              className={`w-full py-3.5 px-6 rounded-2xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                editId
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color:var(--ring)]'
              }`}
            >
              {editId ? 'Update Password' : 'Save Password'}
            </button>
          </div>
        </div>

        {/* Passwords Table */}
        <section>
          {/* Section Title – NO GRADIENT */}
          <h2 className="text-3xl font-bold text-[color:var(--primary)] mb-4">
            Your Passwords
          </h2>

          {passwords.length === 0 ? (
            <p className="text-center text-[color:var(--muted-foreground)] py-8">
              No passwords saved yet. Add one above!
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[color:var(--border)] shadow-md">
              <table className="w-full">
                <thead className="bg-[color:var(--muted)] text-[color:var(--muted-foreground)] text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Site</th>
                    <th className="px-4 py-3 text-left">Username</th>
                    <th className="px-4 py-3 text-left">Password</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--border)]">
                  {tableRows}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Manager;