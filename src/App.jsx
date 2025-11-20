import { useEffect, useMemo, useState } from 'react'
import NavBar from './components/NavBar'
import Section, { CustomerForm, PartnerForm, LoanForm } from './components/EntityForm'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

function DataTable({ rows, columns, empty }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-blue-200/80">
          <tr>
            {columns.map(c => (
              <th key={c.key} className="px-3 py-2 font-medium">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-blue-50/90">
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-3 py-6 text-center text-blue-200/60">{empty}</td></tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={idx} className="border-t border-slate-700/50">
                {columns.map(c => (
                  <td key={c.key} className="px-3 py-2">{c.render ? c.render(r[c.key], r) : r[c.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function Dashboard({ loans, partners }) {
  const totals = useMemo(() => {
    const funded = loans.filter(l => l.status === 'funded')
    const fundedAmount = funded.reduce((s, l) => s + (l.amount || 0), 0)
    const commission = funded.reduce((s, l) => s + (l.commission_amount || 0), 0)
    return { fundedCount: funded.length, fundedAmount, commission }
  }, [loans])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <div className="text-blue-200 text-sm">Funded Loans</div>
        <div className="text-3xl font-bold text-white mt-1">{totals.fundedCount}</div>
      </div>
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <div className="text-blue-200 text-sm">Funded Volume</div>
        <div className="text-3xl font-bold text-white mt-1">${totals.fundedAmount.toLocaleString()}</div>
      </div>
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <div className="text-blue-200 text-sm">Commission</div>
        <div className="text-3xl font-bold text-white mt-1">${totals.commission.toLocaleString()}</div>
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const [customers, setCustomers] = useState([])
  const [partners, setPartners] = useState([])
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function refresh() {
    setLoading(true)
    try {
      const [c, p, l] = await Promise.all([
        api('/api/customers'),
        api('/api/partners'),
        api('/api/loans'),
      ])
      setCustomers(c)
      setPartners(p)
      setLoans(l)
    } catch (e) {
      setMsg(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [])

  async function handleCreate(path, data) {
    setLoading(true)
    setMsg('')
    try {
      await api(path, { method: 'POST', body: JSON.stringify(data) })
      await refresh()
      setMsg('Saved successfully')
      setTimeout(() => setMsg(''), 2000)
    } catch (e) {
      setMsg(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <NavBar current={tab} onChange={setTab} />
      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {msg && <div className="bg-blue-600/20 border border-blue-500/30 text-blue-100 px-4 py-2 rounded-md">{msg}</div>}
        {tab === 'dashboard' && (
          <>
            <Dashboard loans={loans} partners={partners} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Section title="Quick Add: Customer" actions={null}>
                <CustomerForm onSubmit={(data) => handleCreate('/api/customers', data)} />
              </Section>
              <Section title="Quick Add: Partner" actions={null}>
                <PartnerForm onSubmit={(data) => handleCreate('/api/partners', data)} />
              </Section>
            </div>
          </>
        )}

        {tab === 'customers' && (
          <Section title="Customers">
            <div className="mb-4">
              <CustomerForm onSubmit={(data) => handleCreate('/api/customers', data)} />
            </div>
            <DataTable
              rows={customers}
              columns={[
                { key: 'first_name', label: 'First' },
                { key: 'last_name', label: 'Last' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'Phone' },
              ]}
              empty="No customers yet"
            />
          </Section>
        )}

        {tab === 'partners' && (
          <Section title="Referral Partners">
            <div className="mb-4">
              <PartnerForm onSubmit={(data) => handleCreate('/api/partners', data)} />
            </div>
            <DataTable
              rows={partners}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'contact_name', label: 'Contact' },
                { key: 'email', label: 'Email' },
                { key: 'commission_rate', label: 'Rate (%)' },
              ]}
              empty="No partners yet"
            />
          </Section>
        )}

        {tab === 'loans' && (
          <Section title="Loans">
            <div className="mb-4">
              <LoanForm customers={customers} partners={partners} onSubmit={(data) => handleCreate('/api/loans', data)} />
            </div>
            <DataTable
              rows={loans}
              columns={[
                { key: 'status', label: 'Status' },
                { key: 'amount', label: 'Amount', render: v => `$${(v||0).toLocaleString()}` },
                { key: 'commission_amount', label: 'Commission', render: v => `$${(v||0).toLocaleString()}` },
                { key: 'application_date', label: 'Applied' },
                { key: 'funded_date', label: 'Funded' },
              ]}
              empty="No loans yet"
            />
          </Section>
        )}

        {loading && <div className="fixed bottom-4 right-4 bg-slate-800/80 text-blue-100 px-3 py-2 rounded-md">Loading...</div>}
      </div>
    </div>
  )
}
