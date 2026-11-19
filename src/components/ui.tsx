import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { prUrl, type PR } from '../data/profile';
import { useTheme } from '../lib/theme';

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Section({ id, children, className = '' }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`rule ${className}`}>
      <div className="mx-auto max-w-page px-4 py-20 sm:px-6 md:py-28">{children}</div>
    </section>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  children,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="eyebrow">
        {index} / {eyebrow}
      </p>
      <h2 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">{title}</h2>
      {lede && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{lede}</p>}
      {children}
    </Reveal>
  );
}

/** Small avatar for the nav. Orange print in light mode, cyanotype in dark. */
export function Avatar({ className = '', eager = false }: { className?: string; eager?: boolean }) {
  const { theme } = useTheme();
  return (
    <img
      src={theme === 'dark' ? '/avatar-cyanotype.webp' : '/avatar.webp'}
      alt=""
      width={128}
      height={128}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  );
}

export function PRRef({ repo, num }: Pick<PR, 'repo' | 'num'>) {
  return (
    <a
      href={prUrl({ repo, num })}
      target="_blank"
      rel="noopener noreferrer"
      className="chip transition-colors hover:border-sun hover:text-sun-ink"
    >
      {repo.split('/')[1]}#{num}
    </a>
  );
}

export function ExtLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`group inline-flex items-center gap-1 ${className}`}>
      <span className="link-u">{children}</span>
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
