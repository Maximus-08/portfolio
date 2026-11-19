import { toolbox } from '../data/profile';
import { Reveal, Section, SectionHeader } from './ui';

export default function Toolbox() {
  return (
    <Section id="toolbox">
      <SectionHeader index="04" eyebrow="Toolbox" title="What I work with." />
      <Reveal>
        <dl className="grid gap-px border border-line/15 bg-line/15 sm:grid-cols-2 lg:grid-cols-3">
          {toolbox.map((g) => (
            <div key={g.area} className="bg-paper p-6 sm:p-7">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-sun-ink">{g.area}</dt>
              <dd className="mt-4 flex flex-wrap gap-x-2 gap-y-1.5 text-[15px] leading-snug">
                {g.items.map((it, i) => (
                  <span key={it}>
                    {it}
                    {i < g.items.length - 1 && <span className="ml-2 text-line/30">/</span>}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
