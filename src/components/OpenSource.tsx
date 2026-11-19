import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { allPRsUrl, featureStory, mergedCount, orgCount, prUrl, upstream, type Org } from '../data/profile';
import { Reveal, Section, SectionHeader } from './ui';

function FeatureStory() {
  const s = featureStory;
  return (
    <Reveal className="mb-10 border border-line/20 bg-surface/60 p-6 sm:p-8 md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div>
          <p className="eyebrow">Biggest feature so far</p>
          <h3 className="mt-3 font-serif text-4xl leading-none tracking-tight sm:text-5xl">{s.title}</h3>
          <p className="mt-4 leading-relaxed text-muted">{s.summary}</p>
          <a
            href={prUrl(s.issue).replace('/pull/', '/issues/')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-sun-ink"
          >
            started from {s.issue.label} <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        <ol className="flex flex-col gap-3 self-center sm:flex-row sm:items-stretch sm:gap-0">
          {s.steps.map((step, i) => (
            <li key={step.num} className="flex flex-1 flex-col items-center sm:flex-row">
              <a
                href={prUrl(step)}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full flex-1 self-stretch border border-line/25 bg-paper p-4 transition-colors hover:border-sun"
              >
                <span className="font-mono text-[11px] text-muted">
                  {i + 1} of {s.steps.length} · {step.month}
                </span>
                <span className="mt-3 block font-mono text-sm text-sun-ink">
                  {step.label} #{step.num}
                </span>
                <span className="mt-1 block text-sm text-muted">{step.note}</span>
              </a>
              {i < s.steps.length - 1 && (
                <ArrowRight aria-hidden className="mt-3 h-4 w-4 shrink-0 rotate-90 text-sun sm:mx-2 sm:mt-0 sm:rotate-0" />
              )}
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

function OrgCard({ org }: { org: Org }) {
  const top = org.prs.filter((p) => p.top);
  return (
    <Reveal className="border border-line/15 p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-3xl tracking-tight">{org.name}</h3>
        <span className="shrink-0 font-mono text-xs text-muted">{org.prs.length} merged</span>
      </div>
      <p className="mt-1 text-sm text-muted">{org.blurb}</p>
      <ul className="mt-5 space-y-4">
        {top.map((pr) => (
          <li key={`${pr.repo}${pr.num}`}>
            <a href={prUrl(pr)} target="_blank" rel="noopener noreferrer" className="group block">
              <span className="text-[15px] leading-snug group-hover:underline group-hover:decoration-sun group-hover:underline-offset-4">
                {pr.title}
              </span>
              <span className="mt-0.5 block font-mono text-[11px] text-muted">
                <span className="text-sun-ink">#{pr.num}</span> · {pr.repo}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default function OpenSource() {
  return (
    <Section id="open-source">
      <SectionHeader
        index="02"
        eyebrow="Open source"
        title="Merged upstream."
        lede={`${mergedCount} pull requests merged in ${orgCount} CNCF projects since January 2026. Here are the ones I'd point you to first.`}
      />

      <FeatureStory />

      <div className="grid gap-6 md:grid-cols-3">
        {upstream.map((o) => (
          <OrgCard key={o.name} org={o} />
        ))}
      </div>

      <Reveal className="mt-10">
        <a
          href={allPRsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 font-mono text-sm hover:text-sun-ink"
        >
          See all my merged PRs on GitHub
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </Reveal>
    </Section>
  );
}
