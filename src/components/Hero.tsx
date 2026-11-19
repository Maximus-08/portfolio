import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Code2, Github, Linkedin } from 'lucide-react';
import { mergedCount, orgCount, profile } from '../data/profile';

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

const stats = [
  { value: mergedCount, label: 'PRs merged upstream' },
  { value: orgCount, label: 'CNCF projects' },
  { value: profile.leetcodeRating, label: `LeetCode ${profile.leetcodeRank}` },
];

const socials = [
  { href: profile.github, label: 'GitHub', Icon: Github },
  { href: profile.linkedin, label: 'LinkedIn', Icon: Linkedin },
  { href: profile.leetcode, label: 'LeetCode', Icon: Code2 },
];

/*
 * The sun from the avatar print. It sits above a horizon line with a striped
 * reflection below, and sinks behind the horizon as the hero scrolls away.
 * Light mode: a solid vermilion disc. Dark mode: dimmer, with a soft glow.
 * With reduced motion it just stays put.
 */
function Sun({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const sunY = useTransform(progress, [0, 0.85], ['0%', '105%']);
  const reflectionY = useTransform(progress, [0, 0.85], ['0%', '-105%']);
  const glow = useTransform(progress, [0, 0.85], [1, 0]);

  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.3 }}
      className="pointer-events-none absolute right-[5vw] top-20 w-[clamp(104px,24vw,320px)] md:top-[14%]"
    >
      <motion.div
        style={reduce ? undefined : { opacity: glow }}
        className="absolute -inset-[30%] hidden bg-[radial-gradient(circle_at_50%_45%,rgb(var(--sun)/0.13),transparent_60%)] dark:block"
      />

      {/* sky: the disc is clipped where it meets the horizon */}
      <div className="relative aspect-square overflow-hidden">
        <motion.div
          style={reduce ? undefined : { y: sunY }}
          className="sun-disc absolute inset-x-[6%] bottom-[3%] top-[9%] overflow-hidden rounded-full"
        >
          {/* woodblock-style cloud strokes, cut into the disc so they work on any background */}
          <span className="absolute -left-[4%] top-[33%] h-[3.4%] w-[46%] rounded-full bg-paper" />
          <span className="absolute -right-[4%] top-[50%] h-[2.4%] w-[40%] rounded-full bg-paper" />
          <span className="absolute left-[12%] top-[66%] h-[2.8%] w-[32%] rounded-full bg-paper" />
        </motion.div>
      </div>

      <div className="h-px w-full bg-ink/40" />

      {/* water: a striped reflection that shrinks as the sun goes down */}
      <div className="relative aspect-[100/34] overflow-hidden">
        <motion.div
          style={reduce ? undefined : { y: reflectionY }}
          className="sun-reflection absolute inset-x-[6%] top-0 aspect-square rounded-full"
        />
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  return (
    <section id="top" ref={ref} className="relative overflow-hidden">
      <Sun progress={scrollYProgress} />

      <div className="relative mx-auto max-w-page px-4 pb-20 pt-10 sm:px-6 md:pb-28 md:pt-20">
        <div className="max-w-3xl">
          <motion.p {...rise(0)} className="eyebrow">
            Final-year CS at ABV-IIITM
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-5 font-serif text-[clamp(3.6rem,10vw,8rem)] leading-[0.86] tracking-[-0.02em]"
          >
            Avnish
            <br />
            <span className="italic">Jaltare</span>
            <span className="text-sun">.</span>
          </motion.h1>

          <motion.p {...rise(0.16)} className="mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            I write <span className="text-ink">Go for Kubernetes</span>. Most of it gets merged into CNCF projects
            like <span className="text-ink">LitmusChaos, Volcano and KubeVirt</span>. The rest goes into systems tools
            I build from scratch to learn how they work.
          </motion.p>

          <motion.dl {...rise(0.24)} className="mt-9 grid max-w-lg grid-cols-3 border-y border-line/15">
            {stats.map((s, i) => (
              <div key={s.label} className={`py-4 ${i ? 'border-l border-line/15 pl-4' : 'pr-4'}`}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-serif text-4xl leading-none sm:text-5xl">{s.value}</dd>
                <dd className="mt-2 font-mono text-[11px] leading-tight text-muted">{s.label}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div {...rise(0.32)} className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#journey" className="btn-ink">
              Read the journey <ArrowDown className="h-4 w-4" />
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="btn-line">
              Résumé <ArrowUpRight className="h-4 w-4" />
            </a>
            <div className="ml-1 flex items-center gap-1">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="grid h-11 w-11 place-items-center rounded-sm text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div {...rise(0.4)} className="mt-10 max-w-xl space-y-3 font-mono text-xs leading-relaxed text-muted">
            <p className="flex items-center gap-3">
              <span className="pulse-dot shrink-0" aria-hidden />
              {profile.availability}
            </p>
            <p className="border-l-2 border-sun/60 pl-3">
              <span className="text-ink">Now</span> ({profile.now.updated}): {profile.now.text}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
