import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

// Simple custom quiz creator modal
// - Lets user enter quiz meta (title, duration, difficulty)
// - Add questions with 4 options (A-D) and correct answer
// - Saves to Firestore: tests doc + subcollection tests/{id}/questions
// - Calls onCreated(testId, testSummary) on success

const defaultQuestion = () => ({
  text: '',
  options: [
    { id: 'a', text: '' },
    { id: 'b', text: '' },
    { id: 'c', text: '' },
    { id: 'd', text: '' },
  ],
  correctAnswer: 'a',
  subject: 'General',
  difficulty: 'Medium',
  marks: 1,
});

const CustomQuizModal = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('My Practice Quiz');
  const [difficulty, setDifficulty] = useState('Medium');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [company, setCompany] = useState('Custom');
  const [questions, setQuestions] = useState([defaultQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateQuestion = (index, updater) => {
    setQuestions(prev => prev.map((q, i) => i === index ? updater(q) : q));
  };

  const addQuestion = () => setQuestions(prev => [...prev, defaultQuestion()]);
  const removeQuestion = (index) => setQuestions(prev => prev.filter((_, i) => i !== index));

  const validate = () => {
    if (!title.trim()) return 'Please enter a quiz title.';
    if (!durationMinutes || durationMinutes <= 0) return 'Duration must be greater than 0.';
    if (!questions.length) return 'Please add at least one question.';
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return `Question ${i + 1} is missing text.`;
      for (const opt of q.options) {
        if (!opt.text.trim()) return `Fill all options for Question ${i + 1}.`;
      }
    }
    return '';
  };

  const handleSave = async () => {
    const v = validate();
    if (v) { setError(v); return; }
    setError('');
    setSaving(true);
    try {
      const { db } = await import('../../../utils/firebase');
      const { addDoc, collection, serverTimestamp, doc, setDoc } = await import('firebase/firestore');

      // Create test summary doc (duration stored in minutes)
      const testDoc = await addDoc(collection(db, 'tests'), {
        title: title.trim(),
        description: 'Custom practice quiz',
        duration: Number(durationMinutes), // minutes
        questionCount: questions.length,
        difficulty: difficulty.toLowerCase(),
        companies: [company],
        attempts: 0,
        isRecommended: false,
        createdAt: serverTimestamp(),
      });

      // Write questions as subcollection
      let idCounter = 1;
      for (const q of questions) {
        await setDoc(
          doc(db, 'tests', testDoc.id, 'questions', String(idCounter)),
          {
            id: idCounter,
            text: q.text.trim(),
            subject: q.subject || 'General',
            difficulty: q.difficulty || 'Medium',
            marks: q.marks || 1,
            options: q.options.map(o => ({ id: o.id, text: o.text.trim() })),
            correctAnswer: q.correctAnswer || 'a',
            createdAt: serverTimestamp(),
          }
        );
        idCounter += 1;
      }

      // Notify parent
      onCreated?.(testDoc.id, {
        id: testDoc.id,
        title,
        description: 'Custom practice quiz',
        duration: Number(durationMinutes),
        questionCount: questions.length,
        difficulty,
        companies: [company],
      });
      onClose?.();
    } catch (e) {
      setError(e?.message || 'Failed to create quiz.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-popover rounded-2xl border border-border shadow-elevation-3 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary text-white grid place-items-center">
              <Icon name="Plus" size={18} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Create Custom Quiz</h3>
              <p className="text-xs text-muted-foreground">Add questions and start practicing instantly</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-muted focus-ring">
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Meta */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <input
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 focus-ring"
                placeholder="e.g., Arrays and Strings Practice"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Duration (minutes)</label>
              <input
                type="number"
                min={1}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 focus-ring"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Difficulty</label>
              <select
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 focus-ring"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Company tag (optional)</label>
              <input
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 focus-ring"
                placeholder="e.g., Google, FAANG"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">Questions ({questions.length})</h4>
              <Button size="sm" variant="soft" iconName="Plus" onClick={addQuestion}>Add Question</Button>
            </div>

            {questions.map((q, idx) => (
              <div key={idx} className="rounded-xl border border-border p-4 bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground">Question {idx + 1}</label>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 focus-ring"
                      rows={2}
                      placeholder="Enter the question text"
                      value={q.text}
                      onChange={e => updateQuestion(idx, (old) => ({ ...old, text: e.target.value }))}
                    />
                  </div>
                  <button onClick={() => removeQuestion(idx)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-muted mt-6">
                    <Icon name="Trash" size={16} />
                  </button>
                </div>

                {/* Options */}
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {q.options.map((opt, oi) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <span className="w-6 h-6 grid place-items-center rounded-full border border-border text-xs font-semibold">{String.fromCharCode(65 + oi)}</span>
                      <input
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-2 focus-ring"
                        placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                        value={opt.text}
                        onChange={e => updateQuestion(idx, (old) => {
                          const next = { ...old, options: old.options.map(o => o.id === opt.id ? { ...o, text: e.target.value } : o) };
                          return next;
                        })}
                      />
                    </div>
                  ))}
                </div>

                {/* Correct answer */}
                <div className="mt-3 flex items-center gap-3">
                  <label className="text-sm text-muted-foreground">Correct Answer</label>
                  <select
                    className="rounded-lg border border-border bg-background px-3 py-2 focus-ring"
                    value={q.correctAnswer}
                    onChange={e => updateQuestion(idx, (old) => ({ ...old, correctAnswer: e.target.value }))}
                  >
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {!!error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/30">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border flex items-center justify-end gap-3">
          <Button variant="soft" onClick={onClose} iconName="X">Cancel</Button>
          <Button variant="gradient" onClick={handleSave} loading={saving} iconName="CheckCircle2">Create Quiz</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomQuizModal;