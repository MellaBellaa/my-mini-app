import React, { useState } from 'react'
import { Icon } from './Icon'

interface CodeDoctorProps {
  prompt: string
  onApplyFix?: (fix: string) => void
}

const presets = [
  {
    name: 'React State Mutation',
    desc: 'Array mutated directly without triggering re-render',
    buggy: `function addTask(title) {
  // Bug: Direct array mutation
  state.tasks.push({ id: Date.now(), title, done: false });
  setTasks(state.tasks); 
}`,
    fixed: `function addTask(title) {
  // Fixed: Pure immutable state update
  setTasks(prev => [
    ...prev,
    { id: Date.now(), title, done: false }
  ]);
}`,
    explanation: 'React relies on reference equality to detect state changes. Mutating `state.tasks` in place prevents React from knowing the list changed.',
    severity: 'High Severity',
  },
  {
    name: 'Uncaught Null Reference',
    desc: 'Cannot read properties of undefined (reading "user")',
    buggy: `function ProfileHeader({ data }) {
  // Bug: crashes if data or data.user is undefined
  return <h1>{data.user.name}</h1>;
}`,
    fixed: `function ProfileHeader({ data }) {
  // Fixed: Optional chaining and sensible fallback
  return <h1>{data?.user?.name ?? 'Guest User'}</h1>;
}`,
    explanation: 'Using optional chaining (`?.`) and nullish coalescing (`??`) safely guards against asynchronous data that has not loaded yet.',
    severity: 'Medium Severity',
  },
  {
    name: 'Async Effect Race Condition',
    desc: 'Fast tab switching shows stale API responses',
    buggy: `useEffect(() => {
  fetchData(tabId).then(res => setData(res));
}, [tabId]);`,
    fixed: `useEffect(() => {
  let active = true;
  fetchData(tabId).then(res => {
    if (active) setData(res);
  });
  return () => { active = false; };
}, [tabId]);`,
    explanation: 'When dependencies change rapidly, older pending promises may resolve after newer ones. A cleanup flag ensures only the current effect updates state.',
    severity: 'High Severity',
  },
]

export const CodeDoctor: React.FC<CodeDoctorProps> = ({ prompt, onApplyFix }) => {
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)
  const [copied, setCopied] = useState(false)

  const active = presets[selectedPreset]

  const handleTest = () => {
    setTesting(true)
    setTestResult(null)
    setTimeout(() => {
      setTesting(false)
      setTestResult('All 4 test assertions passed! Zero regressions detected.')
    }, 800)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(active.fixed)
    setCopied(true)
    if (onApplyFix) onApplyFix(active.fixed)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-8 border border-neutral-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-100 text-rose-600">
            <Icon name="bug" className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-900">Code Doctor & Diagnostic Clinic</h3>
            <p className="text-xs text-neutral-500">Automated syntax, logic, and state issue repair</p>
          </div>
        </div>

        <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
          {active.severity}
        </span>
      </div>

      {/* Preset Pickers */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
          Diagnostic Test Cases
        </p>
        <div className="grid sm:grid-cols-3 gap-2">
          {presets.map((item, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => {
                setSelectedPreset(idx)
                setTestResult(null)
              }}
              className={`p-3 rounded-2xl text-left border transition ${
                selectedPreset === idx
                  ? 'bg-rose-50/60 border-rose-300 text-rose-950 shadow-sm'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-white'
              }`}
            >
              <p className="text-xs font-bold">{item.name}</p>
              <p className="text-[11px] text-neutral-500 truncate mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Diff Inspector */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Buggy Code */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-rose-100/60 border-b border-rose-200 text-xs font-bold text-rose-800">
            <span>❌ Failing Code (Detected Issue)</span>
            <span className="text-[10px] font-mono-code uppercase">Original</span>
          </div>
          <pre className="p-4 font-mono-code text-xs text-neutral-800 leading-relaxed overflow-x-auto">
            {active.buggy}
          </pre>
        </div>

        {/* Fixed Code */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-100/60 border-b border-emerald-200 text-xs font-bold text-emerald-800">
            <span>✅ Repaired Code (Buildly Verified)</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Icon name="copy" className="h-3 w-3" />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="p-4 font-mono-code text-xs text-neutral-800 leading-relaxed overflow-x-auto">
            {active.fixed}
          </pre>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
        <span className="font-bold text-neutral-900 block mb-1">💡 Diagnostic Breakdown:</span>
        {active.explanation}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleTest}
          disabled={testing}
          className="rounded-2xl border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 shadow-sm transition"
        >
          {testing ? 'Simulating Tests…' : 'Run Unit Test Simulator 🧪'}
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="rounded-2xl bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 text-xs font-bold shadow-md transition"
        >
          {copied ? '✓ Fix Applied & Copied' : 'Apply Suggested Fix →'}
        </button>
      </div>

      {testResult && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <span>✓</span>
          <span>{testResult}</span>
        </div>
      )}
    </div>
  )
}
