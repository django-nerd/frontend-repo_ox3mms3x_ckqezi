import { useState, useEffect } from 'react'

function TextInput({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block mb-3">
      <span className="block text-blue-200 text-sm mb-1">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800/60 border border-slate-700/60 rounded-md px-3 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </label>
  )
}

export function CustomerForm({ onSubmit }) {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', address: '', city: '', state: '', postal_code: '' })
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="First name" value={form.first_name} onChange={v => setForm({ ...form, first_name: v })} />
        <TextInput label="Last name" value={form.last_name} onChange={v => setForm({ ...form, last_name: v })} />
        <TextInput label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
        <TextInput label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
        <TextInput label="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} />
        <TextInput label="City" value={form.city} onChange={v => setForm({ ...form, city: v })} />
        <TextInput label="State" value={form.state} onChange={v => setForm({ ...form, state: v })} />
        <TextInput label="Postal Code" value={form.postal_code} onChange={v => setForm({ ...form, postal_code: v })} />
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => onSubmit(form)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Save Customer</button>
      </div>
    </div>
  )
}

export function PartnerForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', contact_name: '', email: '', phone: '', commission_rate: 5 })
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput label="Business/Agent Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
        <TextInput label="Contact Name" value={form.contact_name} onChange={v => setForm({ ...form, contact_name: v })} />
        <TextInput label="Email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
        <TextInput label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
        <TextInput label="Commission Rate (%)" type="number" value={form.commission_rate} onChange={v => setForm({ ...form, commission_rate: parseFloat(v) || 0 })} />
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => onSubmit(form)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Save Partner</button>
      </div>
    </div>
  )
}

export function LoanForm({ customers, partners, onSubmit }) {
  const [form, setForm] = useState({ customer_id: '', partner_id: '', amount: '', status: 'applied', application_date: '', funded_date: '' })
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-blue-200 text-sm mb-1">Customer</span>
          <select value={form.customer_id} onChange={e => setForm({ ...form, customer_id: e.target.value })} className="w-full bg-slate-800/60 border border-slate-700/60 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-blue-200 text-sm mb-1">Referral Partner</span>
          <select value={form.partner_id} onChange={e => setForm({ ...form, partner_id: e.target.value })} className="w-full bg-slate-800/60 border border-slate-700/60 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">None</option>
            {partners.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <TextInput label="Amount" type="number" value={form.amount} onChange={v => setForm({ ...form, amount: parseFloat(v) || '' })} />
        <label className="block">
          <span className="block text-blue-200 text-sm mb-1">Status</span>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-slate-800/60 border border-slate-700/60 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['applied','approved','funded','rejected','closed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <TextInput label="Application Date" type="date" value={form.application_date} onChange={v => setForm({ ...form, application_date: v })} />
        <TextInput label="Funded Date" type="date" value={form.funded_date} onChange={v => setForm({ ...form, funded_date: v })} />
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => onSubmit(form)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Save Loan</button>
      </div>
    </div>
  )
}

export default function Section({ title, children, actions }) {
  return (
    <section className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">{title}</h3>
        <div>{actions}</div>
      </div>
      {children}
    </section>
  )
}
