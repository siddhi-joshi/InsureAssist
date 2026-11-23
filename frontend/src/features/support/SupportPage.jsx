import { useState } from 'react'
import { ArrowUpRight, Bot, MessageCircle, Plus } from 'lucide-react'
import { SpotlightCard } from '../../components/reactbits'
import { api } from '../../lib/api'
import { EmptyState } from '../../components/ui/Common'

export function SupportPage({ data, onAdd }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello. I can explain your live policy, claim, payment, or renewal records.' },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const send = async (event) => {
    event?.preventDefault()
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    setSending(true)
    try {
      const response = await api('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: text,
          history: messages.map((item) => ({
            role: item.role === 'bot' ? 'assistant' : 'user',
            content: item.text,
          })),
        }),
      })
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: response.reply, meta: `${response.intent} · ${response.ai_mode}` },
      ])
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: error.message }])
    } finally {
      setSending(false)
    }
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <SpotlightCard className="panel flex min-h-[540px] flex-col p-0">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-100 text-teal-700">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-semibold">Service desk</h3>
              <p className="text-[11px] text-slate-400">Answers grounded in workspace records</p>
            </div>
          </div>
          <span className="badge green">Available</span>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.role}`}>
              {message.text}
              {message.meta && <small>{message.meta}</small>}
            </div>
          ))}
          {sending && (
            <div className="chat-bubble bot flex items-center gap-2 text-slate-400">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
        </div>
        <form onSubmit={send} className="flex gap-2 border-t border-slate-100 p-4">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about a live record…"
            className="soft-input"
          />
          <button className="primary-button !px-4" disabled={sending}>
            <ArrowUpRight size={16} />
          </button>
        </form>
      </SpotlightCard>
      <SpotlightCard className="panel p-5 sm:p-6" glow="orange">
        <div className="flex items-center justify-between">
          <div>
            <div className="section-kicker">HUMAN SUPPORT</div>
            <h3 className="mt-1 text-lg font-semibold">Support tickets</h3>
          </div>
          <button className="secondary-button" onClick={onAdd}>
            <Plus size={15} /> New
          </button>
        </div>
        {data.tickets.length ? (
          <div className="mt-5 divide-y divide-slate-100">
            {data.tickets.map((ticket) => (
              <div key={ticket.id} className="py-4 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-slate-700">{ticket.subject}</p>
                  <span className="badge green">{ticket.status}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-400">{ticket.description}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[.1em] text-slate-400">
                  {ticket.priority} priority
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MessageCircle}
            text="No support tickets yet."
            action="Create a ticket"
            onClick={onAdd}
          />
        )}
      </SpotlightCard>
    </div>
  )
}
