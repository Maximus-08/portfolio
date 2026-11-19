import { useEffect, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Reveal, Section, SectionHeader } from './ui';

/*
 * "Keep the cluster up" — a 30-second chaos experiment.
 * A chaos monkey deletes pods (faster as time goes on) and twice takes a whole
 * node NotReady. Click dead pods to reschedule them. Whenever fewer than 75% of
 * pods are Running, the error budget drains; run out and the SLO is breached.
 */

const NODES = ['node-a', 'node-b', 'node-c'];
const PER_NODE = 4;
const DURATION = 30_000;
const TICK = 100;
const SLO = 0.75;
const DRAIN = 4; // budget lost per tick, per unit of availability below SLO
const RESTART_MS = 600;
const NODE_FAILURES = [11_000, 21_000];
const NODE_DOWN_MS = 2_500;
const CHAOS_START_MS = 1200; // average gap between pod kills at the start...
const CHAOS_END_MS = 550; // ...and at the end

type PodState = 'running' | 'dead' | 'creating';
type Pod = { name: string; state: PodState; readyAt: number };
type Phase = 'idle' | 'playing' | 'won' | 'lost';
type Game = {
  phase: Phase;
  t: number;
  pods: Pod[];
  down: number | null;
  downUntil: number;
  failures: number;
  nextChaos: number;
  budget: number;
  availSum: number;
  ticks: number;
  log: string[];
};

const hex = () => Math.random().toString(16).slice(2, 6);
const newPod = (state: PodState = 'running', readyAt = 0): Pod => ({ name: `api-${hex()}`, state, readyAt });
const nodeOf = (i: number) => Math.floor(i / PER_NODE);
const pushLog = (log: string[], line: string) => [line, ...log].slice(0, 4);
const running = (pods: Pod[]) => pods.filter((p) => p.state === 'running').length;

function fresh(phase: Phase): Game {
  return {
    phase,
    t: 0,
    pods: Array.from({ length: NODES.length * PER_NODE }, () => newPod()),
    down: null,
    downUntil: 0,
    failures: 0,
    nextChaos: 900,
    budget: 100,
    availSum: 0,
    ticks: 0,
    log: [phase === 'playing' ? '$ litmus run chaos-monkey --duration=30s' : '$ kubectl get pods   # 12/12 Running'],
  };
}

function step(g: Game): Game {
  if (g.phase !== 'playing') return g;
  const t = g.t + TICK;
  let { down, downUntil, failures, nextChaos, log } = g;
  let pods = g.pods.map((p) => (p.state === 'creating' && p.readyAt <= t ? { ...p, state: 'running' as const } : p));

  if (down !== null && t >= downUntil) {
    log = pushLog(log, `${NODES[down]} is Ready again`);
    down = null;
  }

  if (failures < NODE_FAILURES.length && t >= NODE_FAILURES[failures]) {
    const n = Math.floor(Math.random() * NODES.length);
    pods = pods.map((p, i) => (nodeOf(i) === n ? { ...p, state: 'dead' as const } : p));
    down = n;
    downUntil = t + NODE_DOWN_MS;
    failures += 1;
    log = pushLog(log, `node-failure → ${NODES[n]} NotReady`);
  }

  if (t >= nextChaos) {
    const live = pods.flatMap((p, i) => (p.state === 'running' ? [i] : []));
    if (live.length) {
      const i = live[Math.floor(Math.random() * live.length)];
      log = pushLog(log, `pod-delete → ${pods[i].name} on ${NODES[nodeOf(i)]}`);
      pods = pods.map((p, j) => (j === i ? { ...p, state: 'dead' as const } : p));
    }
    const gap = CHAOS_START_MS - (CHAOS_START_MS - CHAOS_END_MS) * (t / DURATION);
    nextChaos = t + gap * (0.7 + Math.random() * 0.6);
  }

  const avail = running(pods) / pods.length;
  const budget = Math.max(0, g.budget - (avail < SLO ? (SLO - avail) * DRAIN : 0));
  const next: Game = {
    ...g, t, pods, down, downUntil, failures, nextChaos, log, budget,
    availSum: g.availSum + avail,
    ticks: g.ticks + 1,
  };

  if (budget <= 0) return { ...next, phase: 'lost', log: pushLog(log, `✕ SLO breached at ${(t / 1000).toFixed(1)}s`) };
  if (t >= DURATION) return { ...next, phase: 'won', log: pushLog(log, '✓ experiment passed') };
  return next;
}

function readBest(): number | null {
  try {
    const v = Number(localStorage.getItem('chaos-best'));
    return v > 0 ? v : null;
  } catch {
    return null;
  }
}

export default function ChaosGame() {
  const [game, setGame] = useState<Game>(() => fresh('idle'));
  const [best, setBest] = useState<number | null>(readBest);

  useEffect(() => {
    if (game.phase !== 'playing') return;
    const id = window.setInterval(() => setGame(step), TICK);
    return () => window.clearInterval(id);
  }, [game.phase]);

  const avg = game.ticks ? game.availSum / game.ticks : 1;

  useEffect(() => {
    if (game.phase !== 'won' || (best !== null && avg <= best)) return;
    setBest(avg);
    try {
      localStorage.setItem('chaos-best', String(avg));
    } catch {
      /* best score is a nicety */
    }
  }, [game.phase, avg, best]);

  const reschedule = (i: number) =>
    setGame((g) => {
      if (g.phase !== 'playing' || g.pods[i].state !== 'dead') return g;
      if (g.down === nodeOf(i)) return { ...g, log: pushLog(g.log, `${NODES[g.down]} NotReady: can't schedule yet`) };
      const pods = g.pods.slice();
      pods[i] = newPod('creating', g.t + RESTART_MS);
      return { ...g, pods, log: pushLog(g.log, `reschedule → ${pods[i].name}`) };
    });

  const live = running(game.pods);
  const availNow = live / game.pods.length;
  const left = Math.max(0, (DURATION - game.t) / 1000);
  const playing = game.phase === 'playing';

  return (
    <Section id="play">
      <SectionHeader
        index="05"
        eyebrow="Play"
        title="Keep the cluster up."
        lede="A 30 second chaos experiment. A chaos monkey keeps deleting pods, and twice it takes a whole node down. Click dead pods to bring them back. If fewer than 75% of pods are running, your error budget drains."
      />

      <Reveal>
        <div className="border border-line/20 bg-surface/60">
          {/* control bar */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-line/15 p-4 sm:p-5">
            <Stat label="time left" value={`${left.toFixed(1)}s`} />
            <Stat label="running" value={`${live}/${game.pods.length}`} warn={availNow < SLO} />
            <div className="min-w-[9rem] flex-1">
              <div className="flex justify-between font-mono text-[11px] text-muted">
                <span>error budget</span>
                <span>{Math.ceil(game.budget)}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full bg-ink/10" role="meter" aria-label="Error budget" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.ceil(game.budget)}>
                <div className="h-full bg-sun transition-[width] duration-100" style={{ width: `${game.budget}%` }} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGame(fresh('playing'))}
              disabled={playing}
              className="btn-ink disabled:pointer-events-none disabled:opacity-50"
            >
              {game.phase === 'idle' ? <Play className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
              {game.phase === 'idle' ? 'Start experiment' : playing ? 'Running…' : 'Run again'}
            </button>
          </div>

          {/* the cluster */}
          <div className="grid grid-cols-3 gap-2 p-3 sm:gap-6 sm:p-6">
            {NODES.map((node, n) => {
              const isDown = game.down === n;
              return (
                <div key={node} className={`border p-2 transition-colors sm:p-3 ${isDown ? 'border-sun bg-sun/5' : 'border-line/15'}`}>
                  <div className="mb-2 flex items-center justify-between gap-1 font-mono text-[10px] sm:text-[11px]">
                    <span>{node}</span>
                    <span className={isDown ? 'text-sun-ink' : 'text-muted'}>{isDown ? 'NotReady' : 'Ready'}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 min-[420px]:grid-cols-2 sm:gap-2">
                    {game.pods.slice(n * PER_NODE, (n + 1) * PER_NODE).map((p, k) => {
                      const i = n * PER_NODE + k;
                      const pending = p.state === 'dead' && isDown;
                      const status = pending ? 'Pending' : p.state === 'dead' ? 'Dead, click to reschedule' : p.state === 'creating' ? 'ContainerCreating' : 'Running';
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => reschedule(i)}
                          disabled={!playing || p.state !== 'dead'}
                          aria-label={`${p.name} on ${node}: ${status}`}
                          className={`flex h-11 flex-col items-center justify-center rounded-sm font-mono text-[10px] leading-tight transition-colors sm:h-14 ${
                            p.state === 'running'
                              ? 'bg-ink text-paper'
                              : p.state === 'creating'
                                ? 'animate-pulse border-2 border-dashed border-ink/50 text-muted'
                                : pending
                                  ? 'cursor-not-allowed border border-dashed border-line/40 text-muted'
                                  : 'border-2 border-sun bg-sun/10 text-sun-ink hover:bg-sun/25'
                          }`}
                        >
                          <span>{p.state === 'running' ? p.name.slice(4) : p.state === 'creating' ? '…' : pending ? 'pending' : '✕ dead'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* result + event log */}
          <div className="grid gap-4 border-t border-line/15 p-4 sm:grid-cols-[1fr_auto] sm:items-end sm:p-5">
            <ol className="space-y-0.5 font-mono text-[11px] text-muted" aria-live="polite">
              {game.log.map((l, i) => (
                <li key={`${game.t}-${i}`} className={i === 0 ? 'text-ink' : ''}>
                  {l}
                </li>
              ))}
            </ol>
            <p className="font-mono text-xs sm:text-right">
              {game.phase === 'won' && <span className="text-ink">Passed · average availability {(avg * 100).toFixed(1)}%</span>}
              {game.phase === 'lost' && <span className="text-sun-ink">Outage · error budget exhausted</span>}
              {(game.phase === 'idle' || playing) && <span className="text-muted">SLO: 75% of pods Running</span>}
              {best !== null && <span className="block text-muted">your best: {(best * 100).toFixed(1)}%</span>}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Stat({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[11px] text-muted">{label}</div>
      <div className={`font-serif text-3xl leading-none tabular-nums ${warn ? 'text-sun-ink' : ''}`}>{value}</div>
    </div>
  );
}
