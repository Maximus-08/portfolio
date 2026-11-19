import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Loader2, Send } from 'lucide-react';
import { profile } from '../data/profile';
import { Reveal } from './ui';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const elsewhere = [
  { label: 'GitHub', sub: `@${profile.handle}`, href: profile.github },
  { label: 'LinkedIn', sub: 'avnish-jaltare', href: profile.linkedin },
  { label: 'LeetCode', sub: `${profile.leetcodeRank}, ${profile.leetcodeRating}`, href: profile.leetcode },
  { label: 'Résumé', sub: 'PDF', href: profile.resume },
];

const field =
  'w-full rounded-sm border border-line/20 bg-paper px-4 py-3 text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-sun';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Portfolio message from ${form.name}` }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="rule bg-surface/50">
      <div className="mx-auto grid max-w-page gap-16 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-28">
        <Reveal>
          <p className="eyebrow">06 / Contact</p>
          <h2 className="mt-4 font-serif text-6xl leading-[0.9] tracking-tight sm:text-7xl md:text-8xl">
            Let&rsquo;s <span className="italic">talk</span>
            <span className="text-sun">.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            If you're hiring for backend or infra work, maintain a CNCF project, or just want to talk about Go, email
            me. It's the fastest way to reach me.
          </p>

          <div className="mt-8 flex max-w-md items-stretch border border-line/25 bg-paper">
            <a
              href={`mailto:${profile.email}`}
              className="min-w-0 flex-1 truncate px-4 py-3.5 font-mono text-sm hover:text-sun-ink"
            >
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
              className="grid w-12 shrink-0 place-items-center border-l border-line/25 transition-colors hover:bg-ink/5"
            >
              {copied ? <Check className="h-4 w-4 text-sun-ink" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 h-4 font-mono text-[11px] text-sun-ink" aria-live="polite">
            {copied ? 'Copied to clipboard' : ''}
          </p>

          <ul className="mt-6 max-w-md">
            {elsewhere.map((l) => (
              <li key={l.label} className="border-b border-line/15">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-3.5"
                >
                  <span className="font-medium group-hover:text-sun-ink">{l.label}</span>
                  <span className="flex items-center gap-2 font-mono text-xs text-muted">
                    {l.sub}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="md:pt-14">
          {status === 'sent' ? (
            <div className="border border-line/25 bg-paper p-8">
              <Check className="h-8 w-8 text-sun" />
              <h3 className="mt-4 font-serif text-4xl">Message sent.</h3>
              <p className="mt-2 text-muted">Thanks for writing. I&rsquo;ll get back to you soon.</p>
              <button type="button" onClick={() => setStatus('idle')} className="link-u mt-6 text-sm">
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <p className="font-mono text-xs text-muted">or leave a note here</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm text-muted">Name</span>
                  <input name="name" required value={form.name} onChange={onChange} className={field} autoComplete="name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm text-muted">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={onChange}
                    className={field}
                    autoComplete="email"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm text-muted">Message</span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={onChange}
                  className={`${field} resize-none`}
                />
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <button type="submit" disabled={status === 'sending'} className="btn-ink disabled:opacity-60">
                  {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
                {status === 'error' && (
                  <p className="text-sm text-sun-ink" role="alert">
                    That didn&rsquo;t go through. Please email me directly instead.
                  </p>
                )}
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
