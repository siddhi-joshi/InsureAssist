import { useState } from 'react'
import { X } from 'lucide-react'
import { EMPTY_RECORD } from '../../lib/constants'
import { api } from '../../lib/api'

const fieldsFor = (type) =>
  type === 'policy'
    ? [
        ['policy_number', 'Policy number'],
        ['type', 'Type'],
        ['plan', 'Plan name'],
        ['status', 'Status'],
        ['sum_insured', 'Sum insured'],
        ['premium', 'Premium'],
        ['renewal_date', 'Renewal date'],
      ]
    : type === 'claim'
      ? [
          ['claim_number', 'Claim number'],
          ['type', 'Type'],
          ['amount', 'Amount'],
          ['submitted_on', 'Submitted on'],
          ['status', 'Status'],
          ['next_action', 'Next action'],
          ['assigned_team', 'Assigned team'],
        ]
      : [
          ['subject', 'Subject'],
          ['description', 'Description'],
          ['priority', 'Priority'],
        ]

export function RecordModal({ type, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_RECORD[type])
  const [saving, setSaving] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        ...(type === 'policy' ? { coverage: [], exclusions: [] } : {}),
        ...(type === 'claim' ? { missing_documents: [] } : {}),
      }
      const endpoint = type === 'ticket' ? 'tickets' : `${type}s`
      await api(`/api/${endpoint}`, { method: 'POST', body: JSON.stringify(payload) })
      onSaved()
    } catch (error) {
      setSaving(false)
      alert(error.message)
    }
  }
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form onSubmit={submit} className="modal-card">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="section-kicker">NEW RECORD</div>
            <h2 className="mt-1 text-xl font-semibold">Add {type}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <X size={17} />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {fieldsFor(type).map(([key, label]) => (
            <label
              key={key}
              className={key === 'description' || key === 'next_action' ? 'sm:col-span-2' : ''}
            >
              <span>{label}</span>
              {key === 'description' || key === 'next_action' ? (
                <textarea
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  required
                />
              ) : (
                <input
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  required
                />
              )}
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" disabled={saving}>
            {saving ? 'Saving…' : 'Save record'}
          </button>
        </div>
      </form>
    </div>
  )
}
