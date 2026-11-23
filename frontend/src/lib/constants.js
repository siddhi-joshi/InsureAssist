import { ClipboardList, Headphones, LayoutDashboard, ShieldCheck } from 'lucide-react'

export const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'policies', label: 'My policies', icon: ShieldCheck },
  { id: 'claims', label: 'Claims', icon: ClipboardList },
  { id: 'support', label: 'Support desk', icon: Headphones },
]

export const EMPTY_RECORD = {
  policy: {
    policy_number: '',
    type: '',
    plan: '',
    status: 'Active',
    sum_insured: '',
    premium: '',
    renewal_date: '',
  },
  claim: {
    claim_number: '',
    type: '',
    amount: '',
    submitted_on: '',
    status: 'Submitted',
    next_action: 'Awaiting review',
    assigned_team: 'Claims Desk',
  },
  ticket: { subject: '', description: '', priority: 'Normal' },
}

export const PAGE_COPY = {
  overview: [
    'A clearer view of your cover.',
    'Monitor coverage, claims, and next actions from one calm workspace.',
  ],
  policies: ['Your policies, in one place.', 'Keep your policy records current and easy to understand.'],
  claims: [
    'Track every claim with confidence.',
    'Follow progress and capture the next action for every case.',
  ],
  support: ['A support desk that knows your records.', 'Review live records or send a ticket to your team.'],
}
