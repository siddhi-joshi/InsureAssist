import { ClipboardList } from 'lucide-react'
import { EmptyState } from '../../components/ui/Common'

export function ClaimsPage({ data, onAdd }) {
  return (
    <div className="space-y-6">
      <div className="section-bar">
        <div>
          <div className="section-kicker">CASE MANAGEMENT</div>
          <h2>Claim records</h2>
          <p>Follow progress and capture the next action for every case.</p>
        </div>
        <button className="primary-button" onClick={onAdd}>
          ＋ Add claim
        </button>
      </div>
      {data.claims.length ? (
        <div className="panel overflow-hidden p-0">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_1.2fr] gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-3 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-400 sm:grid">
            <span>Claim</span>
            <span>Type & amount</span>
            <span>Status</span>
            <span>Next action</span>
          </div>
          {data.claims.map((claim) => (
            <div
              key={claim.id}
              className="grid gap-3 border-b border-slate-100 px-5 py-5 last:border-0 sm:grid-cols-[1.2fr_1fr_1fr_1.2fr] sm:items-center sm:gap-4"
            >
              <div>
                <p className="font-semibold text-slate-700">{claim.claim_number}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Submitted {claim.submitted_on || 'date not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">{claim.type || 'General claim'}</p>
                <p className="mt-1 text-xs text-slate-400">{claim.amount || 'Amount pending'}</p>
              </div>
              <div>
                <span className="badge amber">{claim.status}</span>
                <p className="mt-2 text-xs text-slate-400">{claim.assigned_team}</p>
              </div>
              <p className="text-sm leading-5 text-slate-600">{claim.next_action}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel p-8">
          <EmptyState
            icon={ClipboardList}
            text="No claim records yet."
            action="Add your first claim"
            onClick={onAdd}
          />
        </div>
      )}
    </div>
  )
}
