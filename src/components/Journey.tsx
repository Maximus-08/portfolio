import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { journey, type JourneyEntry } from '../data/profile';
import { PRRef, Section, SectionHeader } from './ui';

/*
 * A `git log --graph` drawn row by row. Each row owns an SVG that stretches to
 * the row's height; vertical lanes use percentage lengths so they always meet
 * the next row, and curves sit at fixed offsets around the node.
 *
 *   main lane (x=MAIN): school + things I build
 *   side lane (x=SIDE): the long-running `upstream` branch, or a short-lived
 *                       side branch that forks and merges within one row
 */
const MAIN = 14;
const SIDE = 40;
const NODE_Y = 34; // aligned with the centre of each entry's title line
const W = 56;

const ossStart = journey.findIndex((e) => e.branchStart);

function Graph({ entry, i }: { entry: JourneyEntry; i: number }) {
  const last = journey.length - 1;
  const onSide = entry.lane !== 'main';
  const x = onSide ? SIDE : MAIN;

  const prevFuture = i > 0 && journey[i - 1].future;
  const mainTop = i > 0 && (onSide ? null : { dashed: prevFuture });
  const mainBottom = i < last && (onSide ? null : { dashed: !!entry.future });
  const mainThrough = onSide && i > 0 && i < last;

  const ossThrough = ossStart >= 0 && i < ossStart; // rows above the fork: lane runs full height
  const ossFork = i === ossStart;

  const nodeClass = entry.future
    ? 'fill-paper stroke-ink/60 [stroke-dasharray:2_2]'
    : entry.lane === 'oss'
      ? 'fill-sun stroke-paper'
      : entry.lane === 'side'
        ? 'fill-paper stroke-lead'
        : 'fill-ink stroke-paper';

  return (
    <svg
      className="pointer-events-none absolute inset-y-0 left-0 h-full overflow-visible"
      width={W}
      aria-hidden
    >
      {i === 0 && (
        <defs>
          <linearGradient id="oss-fade" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: 'rgb(var(--sun))', stopOpacity: 0 }} />
            <stop offset="1" style={{ stopColor: 'rgb(var(--sun))', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      )}

      {/* main lane */}
      {mainThrough && <line x1={MAIN} x2={MAIN} y1="0" y2="100%" className="stroke-ink/40" strokeWidth={2} />}
      {mainTop && (
        <line
          x1={MAIN} x2={MAIN} y1="0" y2={NODE_Y}
          className="stroke-ink/40" strokeWidth={2}
          strokeDasharray={mainTop.dashed ? '3 4' : undefined}
        />
      )}
      {mainBottom && (
        <line
          x1={MAIN} x2={MAIN} y1={NODE_Y} y2="100%"
          className="stroke-ink/40" strokeWidth={2}
          strokeDasharray={mainBottom.dashed ? '3 4' : undefined}
        />
      )}

      {/* upstream lane — open at the top because it is still running */}
      {ossThrough && (
        <line
          x1={SIDE} x2={SIDE} y1="0" y2="100%" strokeWidth={2}
          stroke={i === 0 ? 'url(#oss-fade)' : undefined}
          className={i === 0 ? undefined : 'stroke-sun'}
        />
      )}
      {ossFork && (
        <>
          <line x1={SIDE} x2={SIDE} y1="0" y2={NODE_Y} className="stroke-sun" strokeWidth={2} />
          <path
            d={`M${SIDE} ${NODE_Y} C${SIDE} ${NODE_Y + 24} ${MAIN} ${NODE_Y + 18} ${MAIN} ${NODE_Y + 44}`}
            className="fill-none stroke-sun" strokeWidth={2}
          />
        </>
      )}

      {/* short side branch: fork from below, merge back above */}
      {entry.solo && (
        <>
          <path
            d={`M${MAIN} ${NODE_Y + 40} C${MAIN} ${NODE_Y + 18} ${SIDE} ${NODE_Y + 22} ${SIDE} ${NODE_Y}`}
            className="fill-none stroke-lead" strokeWidth={2}
          />
          <path
            d={`M${SIDE} ${NODE_Y} C${SIDE} ${NODE_Y - 18} ${MAIN} ${NODE_Y - 14} ${MAIN} 0`}
            className="fill-none stroke-lead" strokeWidth={2}
          />
        </>
      )}

      {/* the commit */}
      <circle cx={x} cy={NODE_Y} r={entry.lane === 'main' && !entry.future ? 5.5 : 6} className={nodeClass} strokeWidth={entry.future || entry.lane === 'side' ? 2 : 3} />
    </svg>
  );
}

const legend = [
  { label: 'main: school and projects', dot: 'bg-ink' },
  { label: 'upstream: open source', dot: 'bg-sun' },
  ...(journey.some((e) => e.lane === 'side') ? [{ label: 'side branch', dot: 'border-2 border-lead bg-paper' }] : []),
];

export default function Journey() {
  return (
    <Section id="journey">
      <SectionHeader
        index="01"
        eyebrow="Journey"
        title="The story so far."
        lede="Newest first, like git log. The main line is school and my own projects. The orange branch is open source, and it's still going."
      >
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] text-muted">
          {legend.map((l) => (
            <li key={l.label} className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${l.dot}`} />
              {l.label}
            </li>
          ))}
        </ul>
      </SectionHeader>

      <div className="mb-3 pl-[56px] font-mono text-xs text-muted md:pl-[200px]">
        <span className="text-sun-ink">$</span> git log --graph --since=2023
      </div>

      <ol>
        {journey.map((e, i) => (
          <motion.li
            key={`${e.when}-${e.title}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -8% 0px' }}
            transition={{ duration: 0.6 }}
            className="relative grid min-h-[96px] grid-cols-[56px_1fr] pb-10 md:grid-cols-[56px_144px_1fr]"
          >
              <Graph entry={e} i={i} />
              <span aria-hidden />

              <p className="hidden pt-[26px] font-mono text-xs leading-4 text-muted md:block">{e.when}</p>

              <div className={`max-w-2xl ${e.future ? 'opacity-80' : ''}`}>
                <p className="font-mono text-[11px] leading-5">
                  <span className="text-muted md:hidden">{e.when} · </span>
                  <span className={e.lane === 'oss' ? 'text-sun-ink' : e.lane === 'side' ? 'text-lead' : 'text-muted'}>
                    {e.tag}
                  </span>
                  {e.future && <span className="ml-2 rounded-sm border border-dashed border-line/40 px-1.5 text-muted">upcoming</span>}
                </p>
                <h3 className="text-lg font-medium leading-7 tracking-tight">{e.title}</h3>
                {e.body && <p className="mt-1.5 leading-relaxed text-muted">{e.body}</p>}
                {(e.refs || e.link) && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {e.refs?.map((r) => <PRRef key={`${r.repo}${r.num}`} {...r} />)}
                    {e.link && (
                      <a
                        href={e.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chip gap-1 transition-colors hover:border-line/60 hover:text-ink"
                      >
                        {e.link.label} <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
