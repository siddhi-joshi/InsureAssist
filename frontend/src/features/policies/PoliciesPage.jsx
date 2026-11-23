import { ShieldCheck } from 'lucide-react'
import { BlurFade, SpotlightCard } from '../../components/reactbits'
import { Detail, EmptyState } from '../../components/ui/Common'

function PolicyCard({ policy }) {
  return (
    <SpotlightCard className="panel p-5 sm:p-6" glow="teal">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-100 text-teal-700">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">
              {policy.type}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-[#173f3b]">{policy.plan}</h3>
          </div>
        </div>
        <span className="badge green">{policy.status}</span>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
        <Detail label="Policy number" value={policy.policy_number} />
        <Detail label="Sum insured" value={policy.sum_insured || 'Not provided'} />
        <Detail label="Premium" value={policy.premium || 'Not provided'} />
        <Detail label="Renewal" value={policy.renewal_date || 'Not provided'} />
      </div>
      {policy.coverage?.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.13em] text-slate-400">Coverage</p>
          <div className="flex flex-wrap gap-2">
            {policy.coverage.map((item) => (
              <span className="chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </SpotlightCard>
  )
}

export function PoliciesPage({ data, onAdd }) {
  return (
    <div className="space-y-6">
      <div className="section-bar">
        <div>
          <div className="section-kicker">RECORD LIBRARY</div>
          <h2>Policy records</h2>
          <p>Coverage details your team has connected to this workspace.</p>
        </div>
        <button className="primary-button" onClick={onAdd}>
          ＋ Add policy
        </button>
      </div>
      {data.policies.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.policies.map((policy, index) => (
            <BlurFade key={policy.id} delay={index * 0.05}>
              <PolicyCard policy={policy} />
            </BlurFade>
          ))}
        </div>
      ) : (
        <div className="panel p-8">
          <EmptyState
            icon={ShieldCheck}
            text="No policy records yet."
            action="Add your first policy"
            onClick={onAdd}
          />
        </div>
      )}
    </div>
  )
}
