import { Activity, ClipboardList, ShieldCheck, Ticket } from 'lucide-react'
import { BlurFade, NumberTicker, SpotlightCard } from '../../components/reactbits'
import { ClaimRow, EmptyState, MetricCard, PolicyRow, SectionHeading } from '../../components/ui/Common'

export function OverviewPage({ data, onNavigate }) {
  const activePolicies = data.policies.filter((item) => item.status.toLowerCase() === 'active').length
  const openTickets = data.tickets.filter((item) => item.status === 'Open').length
  const metricProps = { NumberTicker, SpotlightCard }
  return (
    <div className="space-y-6">
      <div className="hero-card">
        <div className="relative max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] text-teal-100">
            <ShieldCheck size={13} className="text-teal-200" /> Insurance workspace
          </div>
          <h2>
            Good morning, <span className="text-teal-200">{data.customer.name.split(' ')[0]}.</span>
          </h2>
          <p>A considered view of your cover, open cases, and the next action that matters.</p>
        </div>
        <div className="hero-seal">
          <ShieldCheck size={30} />
          <span>IA</span>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          {...metricProps}
          icon={ShieldCheck}
          label="Active policies"
          value={activePolicies}
          detail={`${data.policies.length} total records`}
          tone="teal"
        />
        <MetricCard
          {...metricProps}
          icon={ClipboardList}
          label="Open claims"
          value={data.claims.length}
          detail="Live workspace records"
          tone="orange"
        />
        <MetricCard
          {...metricProps}
          icon={Ticket}
          label="Support tickets"
          value={openTickets}
          detail={`${data.tickets.length} total tickets`}
          tone="violet"
        />
        <MetricCard
          {...metricProps}
          icon={Activity}
          label="Data connection"
          value="100"
          suffix="%"
          detail="Database connected"
          tone="blue"
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <SpotlightCard className="panel p-5 sm:p-6">
          <SectionHeading
            icon={ClipboardList}
            title="Recent claims"
            action="View all"
            onClick={() => onNavigate('claims')}
          />
          {data.claims.length ? (
            <div className="mt-5 divide-y divide-slate-100">
              {data.claims.slice(0, 4).map((claim) => (
                <ClaimRow key={claim.id} claim={claim} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              text="No claims have been added yet."
              action="Open Claims"
              onClick={() => onNavigate('claims')}
            />
          )}
        </SpotlightCard>
        <SpotlightCard className="panel p-5 sm:p-6" glow="orange">
          <SectionHeading
            icon={ShieldCheck}
            title="Policy snapshot"
            action="Manage"
            onClick={() => onNavigate('policies')}
          />
          {data.policies.length ? (
            <div className="mt-5 space-y-3">
              {data.policies.slice(0, 3).map((policy) => (
                <PolicyRow key={policy.id} policy={policy} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ShieldCheck}
              text="No policies have been added yet."
              action="Add a policy"
              onClick={() => onNavigate('policies')}
            />
          )}
        </SpotlightCard>
      </div>
    </div>
  )
}
