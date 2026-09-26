import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Upload, Trash2, Plus, Save, X, Search, Image as ImageIcon, FolderOpen, Eye, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { questions as initialQuestions, Question, Category } from './data';

interface AdminPanelProps {
  onBack: () => void;
}

const CATEGORIES: Category[] = ['Myotome', 'Dermatome', 'Brain Region', 'Nerve Root', 'Sensory Nerve'];

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; border: string; badge: string }> = {
  'Myotome': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
  'Dermatome': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700' },
  'Brain Region': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' },
  'Nerve Root': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  'Sensory Nerve': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700' },
};

export function AdminPanel({ onBack }: AdminPanelProps) {
  // ── Auth ──
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');

  // ── Data ──
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => JSON.parse(JSON.stringify(initialQuestions)));
  const [originalSnapshot, setOriginalSnapshot] = useState<string>(() => JSON.stringify(initialQuestions));
  const [selectedCategory, setSelectedCategory] = useState<Category>('Myotome');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Image browser ──
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [availableImages, setAvailableImages] = useState<Record<string, string[]>>({});
  const [imageBrowserSearch, setImageBrowserSearch] = useState('');

  // ── UI state ──
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Derived ──
  const hasChanges = JSON.stringify(allQuestions) !== originalSnapshot;
  const changeCount = (() => {
    const original: Question[] = JSON.parse(originalSnapshot);
    let count = 0;
    // Count modified
    for (const q of allQuestions) {
      const orig = original.find(o => o.id === q.id);
      if (!orig || JSON.stringify(orig) !== JSON.stringify(q)) count++;
    }
    // Count deleted
    for (const o of original) {
      if (!allQuestions.find(q => q.id === o.id)) count++;
    }
    return count;
  })();

  const filteredQuestions = allQuestions
    .filter(q => q.category === selectedCategory)
    .filter(q => !searchQuery || q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) || q.answer.toLowerCase().includes(searchQuery.toLowerCase()));

  const selectedQuestion = allQuestions.find(q => q.id === selectedQuestionId) || null;

  // ── Auth handler ──
  const handleLogin = async () => {
    setAuthError('');
    if (!password.trim()) {
      setAuthError('Enter the admin password.');
      return;
    }

    try {
      const authResp = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'x-admin-password': password },
      });

      if (!authResp.ok) {
        setAuthError(authResp.status === 401 ? 'Incorrect password.' : 'Admin API is only available from local dev.');
        return;
      }

      setAuthed(true);
      await loadImages();
    } catch {
      setAuthError('Admin API unavailable. Run npm run dev locally to use the editor.');
    }
  };

  // ── Load available images ──
  const loadImages = useCallback(async () => {
    try {
      const resp = await fetch('/api/list-images');
      if (resp.ok) {
        setAvailableImages(await resp.json());
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (authed) loadImages();
  }, [authed, loadImages]);

  // ── Question mutations ──
  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setAllQuestions(prev => prev.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const addQuestion = () => {
    const catQuestions = allQuestions.filter(q => q.category === selectedCategory);
    const prefix = selectedCategory === 'Myotome' ? 'm' : selectedCategory === 'Dermatome' ? 'd' : selectedCategory === 'Brain Region' ? 'b' : selectedCategory === 'Sensory Nerve' ? 's' : 'n';
    const maxNum = catQuestions.reduce((max, q) => {
      const num = parseInt(q.id.slice(prefix.length));
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const newId = `${prefix}${maxNum + 1}`;
    const newQuestion: Question = {
      id: newId,
      category: selectedCategory,
      prompt: '',
      answer: '',
      options: [],
      image: 'placeholder',
    };
    setAllQuestions(prev => [...prev, newQuestion]);
    setSelectedQuestionId(newId);
  };

  const deleteQuestion = (id: string) => {
    setAllQuestions(prev => prev.filter(q => q.id !== id));
    if (selectedQuestionId === id) setSelectedQuestionId(null);
    setDeleteConfirmId(null);
  };

  // ── Image upload ──
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSaveMessage({ type: 'error', text: 'Only PNG, JPG, and WebP files are allowed.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: 'error', text: 'File too large (max 5MB).' });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const resp = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
          body: JSON.stringify({
            base64,
            filename: file.name,
            subfolder: selectedCategory === 'Myotome' ? 'Myotomes Final' :
                       selectedCategory === 'Dermatome' ? 'Dermatomes Final' :
                       selectedCategory === 'Brain Region' ? 'Brain Regions' :
                       selectedCategory === 'Sensory Nerve' ? 'Peripheral Nerves Final' :
                       'Nerve Roots',
          }),
        });
        const data = await resp.json();
        if (resp.ok && data.path && selectedQuestionId) {
          updateQuestion(selectedQuestionId, { image: data.path });
          loadImages(); // Refresh gallery
          setSaveMessage({ type: 'success', text: `Image uploaded: ${data.path}` });
        } else {
          setSaveMessage({ type: 'error', text: data.error || 'Upload failed' });
        }
      } catch (err: any) {
        setSaveMessage({ type: 'error', text: err.message });
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Drop handlers ──
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  // ── Publish ──
  const handlePublish = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const resp = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ questions: allQuestions }),
      });
      const data = await resp.json();
      if (resp.ok && data.success) {
        setOriginalSnapshot(JSON.stringify(allQuestions));
        setSaveMessage({ type: 'success', text: `Published! Backup saved to ${data.backup}` });
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Save failed' });
      }
    } catch (err: any) {
      setSaveMessage({ type: 'error', text: err.message });
    }
    setSaving(false);
  };

  // ── Discard ──
  const handleDiscard = () => {
    setAllQuestions(JSON.parse(originalSnapshot));
    setSelectedQuestionId(null);
    setSaveMessage(null);
  };

  // ── Options management ──
  const addOption = (questionId: string) => {
    const q = allQuestions.find(q => q.id === questionId);
    if (!q) return;
    updateQuestion(questionId, { options: [...q.options, ''] });
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    const q = allQuestions.find(q => q.id === questionId);
    if (!q) return;
    const newOptions = [...q.options];
    newOptions[index] = value;
    updateQuestion(questionId, { options: newOptions });
  };

  const removeOption = (questionId: string, index: number) => {
    const q = allQuestions.find(q => q.id === questionId);
    if (!q) return;
    const newOptions = q.options.filter((_, i) => i !== index);
    updateQuestion(questionId, { options: newOptions });
  };

  // ── Clear message after timeout ──
  useEffect(() => {
    if (saveMessage) {
      const t = setTimeout(() => setSaveMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [saveMessage]);

  // ═══════════════════════════════════════════
  //  LOGIN SCREEN
  // ═══════════════════════════════════════════
  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 mb-4">
              <ImageIcon size={32} />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1">Asset Editor</h1>
            <p className="text-slate-400 text-sm">Enter admin password to continue</p>
          </div>
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Password"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
              autoFocus
            />
            {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
            >
              Unlock Dashboard
            </button>
          </div>
          <button onClick={onBack} className="mt-4 w-full text-center text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors">
            ← Back to NeuroQuiz
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  MAIN DASHBOARD
  // ═══════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col">
      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-extrabold text-slate-800">Asset Editor</h1>
          {hasChanges && (
            <span className="px-2.5 py-0.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
              {changeCount} unsaved {changeCount === 1 ? 'change' : 'changes'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${saveMessage.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {saveMessage.text}
            </span>
          )}
          <button
            onClick={handleDiscard}
            disabled={!hasChanges}
            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Discard
          </button>
          <button
            onClick={handlePublish}
            disabled={!hasChanges || saving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white text-sm font-bold rounded-lg flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Publish Changes
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0">
          {/* Category Tabs */}
          <div className="p-3 border-b border-slate-100 flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setSelectedQuestionId(null); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedCategory === cat
                    ? `${CATEGORY_COLORS[cat].badge} ring-1 ring-current`
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
              />
            </div>
          </div>

          {/* Question List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredQuestions.map(q => {
              const hasImage = q.image && q.image !== 'placeholder';
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`w-full text-left px-3 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                    selectedQuestionId === q.id ? 'bg-indigo-50 border-l-[3px] border-indigo-500' : 'border-l-[3px] border-transparent'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${
                    hasImage ? 'bg-slate-100' : 'bg-red-50 border border-red-200'
                  }`}>
                    {hasImage ? (
                      <img src={q.image!} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <AlertTriangle size={14} className="text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{q.prompt || '(empty)'}</p>
                    <p className="text-xs text-slate-400 truncate">{q.answer}</p>
                  </div>
                  {deleteConfirmId === q.id ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteQuestion(q.id); }}
                        className="p-1.5 text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                        title="Confirm delete"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }}
                        className="p-1.5 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(q.id); }}
                      className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      style={{ opacity: selectedQuestionId === q.id ? 1 : undefined }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add Question */}
          <div className="p-3 border-t border-slate-200">
            <button
              onClick={addQuestion}
              className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all"
            >
              <Plus size={16} /> Add Question
            </button>
          </div>
        </aside>

        {/* ── Main Editor ── */}
        <main className="flex-1 overflow-y-auto p-6">
          {!selectedQuestion ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-slate-400">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold">Select a question to edit</p>
                <p className="text-sm mt-1">Or add a new one from the sidebar</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${CATEGORY_COLORS[selectedQuestion.category].badge}`}>
                  {selectedQuestion.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">{selectedQuestion.id}</span>
              </div>

              {/* Image Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-64 rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
                    : selectedQuestion.image && selectedQuestion.image !== 'placeholder'
                      ? 'border-slate-200 bg-slate-50 hover:border-indigo-300'
                      : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50'
                }`}
              >
                {selectedQuestion.image && selectedQuestion.image !== 'placeholder' ? (
                  <>
                    <img src={selectedQuestion.image} alt="Current" className="w-full h-full object-contain p-4" />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="text-white text-center">
                        <Upload size={24} className="mx-auto mb-2" />
                        <p className="font-bold text-sm">Drop to replace</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Upload size={32} className="mb-2" />
                    <p className="font-bold text-sm">Drop image here or click to browse</p>
                    <p className="text-xs mt-1">PNG, JPG, WebP — max 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = '';
                  }}
                />
              </div>

              {/* Browse Existing + Remove Image row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setShowImageBrowser(true); loadImages(); }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-indigo-400 rounded-lg text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <FolderOpen size={16} /> Browse Existing Images
                </button>
                {selectedQuestion.image && selectedQuestion.image !== 'placeholder' && (
                  <button
                    onClick={() => updateQuestion(selectedQuestion.id, { image: 'placeholder' })}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 hover:border-red-400 rounded-lg text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                  >
                    <X size={16} /> Remove Image
                  </button>
                )}
                {selectedQuestion.image && selectedQuestion.image !== 'placeholder' && (
                  <span className="text-xs text-slate-400 font-mono truncate flex-1">{selectedQuestion.image}</span>
                )}
              </div>

              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                <select
                  value={selectedQuestion.category}
                  onChange={e => updateQuestion(selectedQuestion.id, { category: e.target.value as Category })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Prompt</label>
                <input
                  type="text"
                  value={selectedQuestion.prompt}
                  onChange={e => updateQuestion(selectedQuestion.id, { prompt: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="e.g. Elbow Flexion"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Answer</label>
                <input
                  type="text"
                  value={selectedQuestion.answer}
                  onChange={e => updateQuestion(selectedQuestion.id, { answer: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-lg font-semibold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  placeholder="e.g. C5, C6"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Options ({selectedQuestion.options.length})
                </label>
                <div className="space-y-2">
                  {selectedQuestion.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => updateOption(selectedQuestion.id, i, e.target.value)}
                        className={`flex-1 px-3 py-2 bg-white border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                          opt === selectedQuestion.answer ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-200'
                        }`}
                        placeholder="Option value"
                      />
                      {opt === selectedQuestion.answer && (
                        <span className="text-xs font-bold text-emerald-600 shrink-0">✓ correct</span>
                      )}
                      <button
                        onClick={() => removeOption(selectedQuestion.id, i)}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(selectedQuestion.id)}
                    className="w-full py-2 flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-indigo-50 border border-dashed border-slate-300 hover:border-indigo-400 rounded-lg text-sm font-semibold text-slate-400 hover:text-indigo-600 transition-all"
                  >
                    <Plus size={14} /> Add Option
                  </button>
                </div>
              </div>

              {/* Easy-mode image: optional alternate image shown when "Easier Mode" is on (dermatomes) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Easy-Mode Image (optional)
                </label>
                <input
                  type="text"
                  value={selectedQuestion.easyImage || ''}
                  onChange={e => updateQuestion(selectedQuestion.id, { easyImage: e.target.value || undefined })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="/drawings/Dermatomes Final/Demarcated/Anterior Limbs/AArmC6D.png"
                />
              </div>

              {/* Explanation (for Study Mode) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Explanation (Study Mode)
                </label>
                <textarea
                  value={selectedQuestion.explanation || ''}
                  onChange={e => updateQuestion(selectedQuestion.id, { explanation: e.target.value || undefined })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 min-h-[80px] resize-y"
                  placeholder="Optional. Shown after answering in study mode — e.g. 'The musculocutaneous nerve (C5-C6) innervates biceps brachii → elbow flexion.'"
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═══ Image Browser Modal ═══ */}
      {showImageBrowser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowImageBrowser(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-extrabold text-slate-800">Browse Existing Images</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter images..."
                    value={imageBrowserSearch}
                    onChange={e => setImageBrowserSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <button onClick={() => setShowImageBrowser(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {Object.entries(availableImages).map(([folder, images]: [string, string[]]) => {
                const filteredImages = (images as string[]).filter((img: string) =>
                  !imageBrowserSearch || img.toLowerCase().includes(imageBrowserSearch.toLowerCase())
                );
                if (filteredImages.length === 0) return null;
                return (
                  <div key={folder}>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FolderOpen size={14} /> {folder}
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                      {filteredImages.map(imgPath => {
                        const isAssigned = selectedQuestion?.image === imgPath;
                        return (
                          <button
                            key={imgPath}
                            onClick={() => {
                              if (selectedQuestionId) {
                                updateQuestion(selectedQuestionId, { image: imgPath });
                                setShowImageBrowser(false);
                              }
                            }}
                            className={`group relative aspect-square rounded-xl border-2 overflow-hidden transition-all hover:scale-105 hover:shadow-lg ${
                              isAssigned ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-indigo-400'
                            }`}
                            title={imgPath.split('/').pop()}
                          >
                            <img src={imgPath} alt="" className="w-full h-full object-cover" />
                            {isAssigned && (
                              <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                                <Check size={24} className="text-white drop-shadow-lg" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-white text-[10px] font-medium truncate">{imgPath.split('/').pop()}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {Object.keys(availableImages).length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-semibold">No images found in public/drawings/</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
