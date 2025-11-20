import { useState } from 'react'

function NavBar({ current, onChange }) {
  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'customers', label: 'Customers' },
    { key: 'partners', label: 'Partners' },
    { key: 'loans', label: 'Loans' },
  ]

  return (
    <div className="w-full border-b border-slate-800/60 bg-slate-900/60 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="logo" className="w-6 h-6" />
            <span className="text-white font-semibold tracking-tight">Loan Tracker</span>
          </div>
          <div className="flex items-center gap-2">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${current === t.key ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-slate-800/80'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
