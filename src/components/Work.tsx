import { ArrowUpRight, Github } from 'lucide-react';
import { alsoBuilt, projects, type Figure, type FlowNode, type Project } from '../data/profile';
import { Reveal, Section, SectionHeader } from './ui';

/** A vertical request-path sketch: boxes joined by labelled arrows. */
function FlowDiagram({ nodes, edges }: { nodes: FlowNode[]; edges: string[] }) {
  return (
    <ol className="flex flex-col items-center">
      {nodes.map((n, i) => (
        <li key={n.label} className="flex w-full flex-col items-center">
          <div
            className={`w-full max-w-[17rem] rounded-sm border px-3 py-2 text-center ${
              n.accent ? 'border-sun bg-sun/10' : 'border-line/25 bg-paper'
            }`}
          >
            <div className={`font-mono text-[13px] ${n.accent ? 'text-sun-ink' : ''}`}>{n.label}</div>
            {n.sub && <div className="mt-0.5 text-[11px] leading-snug text-muted">{n.sub}</div>}
          </div>
          {i < nodes.length - 1 && (
            <div className="grid h-9 w-full max-w-[17rem] grid-cols-[1fr_auto_1fr]">
              <span />
              <svg width="10" height="36" viewBox="0 0 10 36" className="block text-line/50" aria-hidden>
                <line x1="5" x2="5" y1="0" y2="35" stroke="currentColor" strokeWidth="1.5" />
                <path d="M1.5 29 L5 35 L8.5 29" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="self-center pl-2 font-mono text-[10px] leading-tight text-muted">{edges[i]}</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function StatsFigure({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl className="grid gap-px bg-line/15">
      {stats.map((s) => (
        <div key={s.label} className="flex items-baseline justify-between gap-4 bg-surface px-1 py-4">
          <dt className="font-mono text-xs text-muted">{s.label}</dt>
          <dd className={`font-serif text-5xl leading-none ${s.value.startsWith('+') ? 'text-sun-ink' : ''}`}>
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function FigureBody({ f }: { f: Figure }) {
  return f.kind === 'flow' ? <FlowDiagram nodes={f.nodes} edges={f.edges} /> : <StatsFigure stats={f.stats} />;
}

function ProjectRow({ p, i }: { p: Project; i: number }) {
  return (
    <Reveal className="rule grid gap-10 py-14 first:border-t-0 first:pt-0 md:grid-cols-[1.2fr_1fr] md:gap-16">
      <div>
        <p className="font-mono text-xs text-muted">
          {String(i + 1).padStart(2, '0')} · {p.kicker}
        </p>
        <h3 className="mt-3 font-serif text-5xl leading-none tracking-tight">{p.name}</h3>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{p.summary}</p>
        {p.compare && (
          <table className="mt-6 w-full text-left">
            <thead className="font-mono text-[11px] text-muted">
              <tr>
                <th className="pb-2 pr-4 font-normal">the real one</th>
                <th className="pb-2 pr-4 font-normal">mine</th>
                <th className="pb-2 font-normal">what it took</th>
              </tr>
            </thead>
            <tbody>
              {p.compare.map((row) => (
                <tr key={row.mine} className="border-t border-line/15 align-top">
                  <td className="py-3 pr-4 font-mono text-sm text-muted">{row.real}</td>
                  <td className="py-3 pr-4 font-mono text-sm text-sun-ink">{row.mine}</td>
                  <td className="py-3 text-sm leading-relaxed">{row.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {p.points && (
          <ul className="mt-6 space-y-2.5">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-3 leading-relaxed">
                <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-sun" aria-hidden />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-7 flex flex-wrap items-center gap-2">
          {p.stack.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
          <a
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium hover:text-sun-ink"
          >
            <Github className="h-4 w-4" /> Source <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <figure className="self-start border border-line/15 bg-surface/60 p-6 sm:p-8">
        <FigureBody f={p.figure} />
        <figcaption className="mt-6 border-t border-line/15 pt-3 font-mono text-[11px] text-muted">
          {p.figure.caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}

export default function Work() {
  return (
    <Section id="work">
      <SectionHeader
        index="03"
        eyebrow="Work"
        title="Things I've built."
        lede="The four I'd most like to talk about, each with a quick sketch of how it works."
      />

      {projects.map((p, i) => (
        <ProjectRow key={p.name} p={p} i={i} />
      ))}

      <Reveal className="rule mt-4 pt-12">
        <h3 className="eyebrow text-muted">Also built</h3>
        <ul className="mt-6 grid gap-x-12 sm:grid-cols-2">
          {alsoBuilt.map((b) => (
            <li key={b.name} className="border-b border-line/10">
              <a
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline justify-between gap-4 py-4"
              >
                <span>
                  <span className="font-medium group-hover:text-sun-ink">{b.name}</span>
                  <span className="mt-0.5 block text-sm text-muted">{b.what}</span>
                </span>
                <span className="shrink-0 text-right font-mono text-[11px] text-muted">{b.tags}</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
