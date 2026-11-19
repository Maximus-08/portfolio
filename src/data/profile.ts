/**
 * Everything the site says lives in this file. Edit here, not in components.
 *
 * Sources: Resume.pdf (Oct 2026), the git history of each repo (dates are the
 * month of the work), and upstream master/main of each CNCF fork for merges.
 * Lines marked TODO need you to confirm them.
 *
 * Style rule for copy: no em dashes, no semicolons, no AI-sounding phrases.
 */

export const profile = {
  name: 'Avnish Jaltare',
  handle: 'Maximus-08',
  // TODO: confirm. Change or delete if you've already taken an offer.
  availability: 'Open to backend and infra roles from 2027',
  email: 'avnishjaltare8@gmail.com',
  resume: '/Resume.pdf',
  github: 'https://github.com/Maximus-08',
  linkedin: 'https://www.linkedin.com/in/avnish-jaltare-508abb288/',
  leetcode: 'https://leetcode.com/u/Maximus-08/',
  leetcodeRating: 1887,
  leetcodeRank: 'Knight',
  leetcodeSolved: '600+',
  // TODO: this is my draft from your recent folders. Rewrite it in your words and update it monthly.
  now: {
    updated: 'Nov 2026',
    text: 'Final year. Reading the checkpointctl and OpenKruise codebases to find my next PRs.',
  },
};

export const nav = [
  { label: 'Journey', href: '#journey' },
  { label: 'Open source', href: '#open-source' },
  { label: 'Work', href: '#work' },
  { label: 'Play', href: '#play' },
  { label: 'Contact', href: '#contact' },
];

/* ───────────────────────────── Open source ───────────────────────────── */

export type PR = {
  repo: string; // owner/name
  num: number;
  title: string;
  month?: string; // YYYY-MM
  top?: boolean; // shown on the site. The rest only count toward the total.
};

export const allPRsUrl =
  'https://github.com/search?q=author%3AMaximus-08+is%3Apr+is%3Amerged+-user%3AMaximus-08&type=pullrequests';

export type Org = { name: string; blurb: string; prs: PR[] };

export const prUrl = (pr: Pick<PR, 'repo' | 'num'>) => `https://github.com/${pr.repo}/pull/${pr.num}`;

export const upstream: Org[] = [
  {
    name: 'LitmusChaos',
    blurb: 'CNCF chaos engineering platform',
    prs: [
      { repo: 'litmuschaos/litmus-helm', num: 495, title: 'Job targeting in the chart CRDs and agent RBAC', month: '2026-09' },
      { repo: 'litmuschaos/litmus-go', num: 796, title: 'Deterministic pod termination order for pod-delete', top: true, month: '2026-07' },
      { repo: 'litmuschaos/litmus', num: 5477, title: 'Docs for deterministic pod termination order', month: '2026-06' },
      { repo: 'litmuschaos/litmus-docs', num: 429, title: 'Merge the duplicate install guides into one', month: '2026-03' },
      { repo: 'litmuschaos/litmus', num: 5433, title: 'Target Kubernetes Jobs in chaos experiments', month: '2026-02' },
      { repo: 'litmuschaos/litmus-go', num: 794, title: 'Job workload type for pod targeting', month: '2026-02' },
      { repo: 'litmuschaos/litmus', num: 5415, title: 'Return 503 when the database is down so probes catch it', top: true, month: '2026-02' },
      { repo: 'litmuschaos/litmus', num: 5424, title: 'Validation schema for image registry settings', month: '2026-02' },
      { repo: 'litmuschaos/litmus', num: 5426, title: 'Fix a duplicate module declaration breaking the ChaosCenter build', month: '2026-02' },
      { repo: 'litmuschaos/litmus', num: 5420, title: 'Remove a broken badge from the README', month: '2026-02' },
    ],
  },
  {
    name: 'Volcano',
    blurb: 'agentcube, a Kubernetes control plane for AI agent workloads',
    prs: [
      { repo: 'volcano-sh/agentcube', num: 361, title: 'Typed informers and listers instead of unstructured lookups', top: true, month: '2026-05' },
      { repo: 'volcano-sh/agentcube', num: 358, title: 'Faster Redis check for session last activity', top: true, month: '2026-05' },
      { repo: 'volcano-sh/agentcube', num: 359, title: 'Run gofmt and enforce it in CI', month: '2026-05' },
      { repo: 'volcano-sh/agentcube', num: 355, title: 'Tests for the workload builder runtime paths', month: '2026-05' },
      { repo: 'volcano-sh/agentcube', num: 306, title: 'Add a CONTRIBUTING guide', month: '2026-05' },
    ],
  },
  {
    name: 'KubeVirt',
    blurb: 'Virtual machines on Kubernetes',
    prs: [
      // TODO: add the month for kubevirt#17150.
      { repo: 'kubevirt/kubevirt', num: 17150, title: 'Clearer failure messages in the storage hotplug tests', top: true },
      { repo: 'kubevirt/project-infra', num: 4821, title: 'Remove the unused ci-usage-exporter', top: true, month: '2026-03' },
    ],
  },
];

export const mergedCount = upstream.reduce((n, o) => n + o.prs.length, 0);
export const orgCount = upstream.length;

export const featureStory = {
  title: 'Kubernetes Jobs as chaos targets',
  issue: { repo: 'litmuschaos/litmus', num: 5000, label: 'issue #5000' },
  summary:
    "LitmusChaos couldn't run chaos experiments against Jobs. Adding it meant changing the control plane, the experiment runtime and the Helm charts, so it shipped as three PRs in three repos.",
  steps: [
    { repo: 'litmuschaos/litmus', num: 5433, label: 'ChaosCenter', note: 'API and agent RBAC', month: 'Feb 2026' },
    { repo: 'litmuschaos/litmus-go', num: 794, label: 'litmus-go', note: 'pod targeting for Jobs', month: 'Feb 2026' },
    { repo: 'litmuschaos/litmus-helm', num: 495, label: 'litmus-helm', note: 'CRDs and chart RBAC', month: 'Sep 2026' },
  ],
};

/* ──────────────────────────────── Journey ─────────────────────────────── */

export type Lane = 'main' | 'oss' | 'side';

export type JourneyEntry = {
  when: string;
  lane: Lane;
  tag: string;
  title: string;
  body?: string;
  refs?: Pick<PR, 'repo' | 'num'>[];
  link?: { label: string; href: string };
  future?: boolean; // dashed, hollow node
  branchStart?: boolean; // the open source lane forks off main here
  solo?: boolean; // a short side branch that forks and merges back in one row
};

/** Newest first, like git log. */
export const journey: JourneyEntry[] = [
  {
    when: 'Jul 2027',
    lane: 'main',
    tag: 'release',
    title: 'Graduating with a B.Tech in Computer Science',
    body: 'ABV-IIITM. GPA 8.26 so far.',
    future: true,
  },
  {
    when: 'Sep 2026',
    lane: 'main',
    tag: 'paper',
    title: 'Presented my first research paper at SEISAE 2026',
    body: 'Strongly Entangled Quantum Contrastive Learning with Temporal Classification for Human Activity Recognition. The conference was in Jabalpur, sponsored by the IEEE MP Section.',
    link: { label: 'QMLHAR', href: 'https://github.com/Maximus-08/QMLHAR' },
  },
  {
    when: 'Sep 2026',
    lane: 'oss',
    tag: 'feat(litmus-helm)',
    title: 'Job targeting lands in the Helm charts',
    body: 'The last of three PRs for Job targeting. The charts now ship the CRD and agent RBAC changes too.',
    refs: [{ repo: 'litmuschaos/litmus-helm', num: 495 }],
  },
  {
    when: 'Jul 2026',
    lane: 'oss',
    tag: 'feat(litmus-go)',
    title: 'Deterministic pod termination order',
    body: 'Added a POD_TERMINATION_ORDER setting to the pod-delete experiment. Pods can be killed in alphabetical or reverse order instead of only at random, with an optional gap between kills, so a run can be repeated. I wrote the docs for it too.',
    refs: [
      { repo: 'litmuschaos/litmus-go', num: 796 },
      { repo: 'litmuschaos/litmus', num: 5477 },
    ],
  },
  {
    when: 'Jun to Sep 2026',
    lane: 'main',
    tag: 'build',
    title: 'Underthehood: a shell, a DNS resolver and an HTTP server in Go',
    body: 'Rebuilt tools I use every day from raw sockets and syscalls, to understand how they actually work.',
    link: { label: 'Underthehood', href: 'https://github.com/Maximus-08/Underthehood' },
  },
  {
    when: 'May 2026',
    lane: 'oss',
    tag: 'feat(volcano)',
    title: '5 PRs merged into Volcano agentcube',
    body: 'Moved the workload manager to typed informers and listers, which started as an issue I filed. Also sped up a Redis session check, added tests and turned on gofmt in CI.',
    refs: [
      { repo: 'volcano-sh/agentcube', num: 361 },
      { repo: 'volcano-sh/agentcube', num: 358 },
    ],
  },
  {
    when: 'May 2026',
    lane: 'main',
    tag: 'build',
    title: 'kb, a CLI for my notes',
    body: 'Turns my Obsidian notes and PDFs into a linked wiki using LLMs, then lets me ask questions over it.',
    link: { label: 'kbcli', href: 'https://github.com/Maximus-08/kbcli' },
  },
  {
    when: 'Apr 2026',
    lane: 'main',
    tag: 'hack',
    title: 'Finalist at the Meta × Scaler OpenEnv Hackathon',
    body: 'Built PromptZip, an RL environment where an agent learns to shorten prompts without breaking them.',
    link: { label: 'PromptZip', href: 'https://github.com/Maximus-08/PromptZip' },
  },
  {
    when: 'Mar 2026',
    lane: 'oss',
    tag: 'chore(kubevirt)',
    title: 'First PR merged in KubeVirt',
    refs: [{ repo: 'kubevirt/project-infra', num: 4821 }],
  },
  {
    when: 'Feb 2026',
    lane: 'oss',
    tag: 'feat(litmus)',
    title: 'First PRs merged in LitmusChaos',
    body: 'Chaos experiments can now target Kubernetes Jobs. I also fixed the health endpoint so it returns 503 when MongoDB is down (I reported that bug first), and added a validation schema for image registry settings.',
    refs: [
      { repo: 'litmuschaos/litmus', num: 5433 },
      { repo: 'litmuschaos/litmus', num: 5415 },
      { repo: 'litmuschaos/litmus', num: 5424 },
    ],
  },
  {
    when: 'Jan 2026',
    lane: 'oss',
    tag: 'checkout -b upstream',
    title: 'Started contributing to CNCF projects',
    body: 'Picked LitmusChaos, read through the codebase, talked to the maintainers and opened my first PRs.',
    branchStart: true,
  },
  {
    when: 'Jan 2026',
    lane: 'main',
    tag: 'build',
    title: 'Goops Monitor',
    body: 'A small Go service that checks endpoints on an interval, tracks uptime and runs shell commands to fix things when a check fails.',
    link: { label: 'Goops Monitor', href: 'https://github.com/Maximus-08/Goops_monitor' },
  },
  {
    when: 'Aug 2023',
    lane: 'main',
    tag: 'init',
    title: 'Started a B.Tech in CS at ABV-IIITM',
  },
];

/* ───────────────────────────────── Work ───────────────────────────────── */

export type FlowNode = { label: string; sub?: string; accent?: boolean };

export type Figure =
  | { kind: 'flow'; caption: string; nodes: FlowNode[]; edges: string[] }
  | { kind: 'stats'; caption: string; stats: { value: string; label: string }[] };

export type Project = {
  name: string;
  kicker: string;
  summary: string;
  points?: string[];
  compare?: { real: string; mine: string; how: string }[]; // "the real one vs mine" table
  stack: string[];
  repo: string;
  figure: Figure;
};

export const projects: Project[] = [
  {
    name: 'Underthehood',
    kicker: 'Systems programming in Go',
    summary: 'Four tools I use every day, rebuilt in Go from raw sockets and syscalls.',
    compare: [
      { real: 'bash', mine: 'tish', how: 'fork/exec, pipes, I/O redirection, built-ins' },
      { real: 'dnsmasq', mine: 'dns_resolver', how: 'RFC 1035 parsing over UDP, a TTL cache in a sync.Map, singleflight for duplicate lookups' },
      { real: 'nginx', mine: 'http_server', how: 'HTTP/1.1 on a raw TCP listener, one goroutine per connection' },
      { real: 'a job queue', mine: 'task_scheduler', how: 'a goroutine worker pool with lock-free metrics, stress tested' },
    ],
    stack: ['Go', 'TCP', 'UDP', 'RFC 1035'],
    repo: 'https://github.com/Maximus-08/Underthehood',
    figure: {
      kind: 'flow',
      caption: 'dns_resolver handling a cache miss',
      nodes: [
        { label: 'UDP query', sub: 'from a client' },
        { label: 'Decode', sub: 'RFC 1035 header and question' },
        { label: 'TTL cache', sub: 'sync.Map', accent: true },
        { label: 'singleflight', sub: 'merges duplicate lookups' },
        { label: 'Upstream resolver' },
      ],
      edges: ['parse', 'look up', 'miss', 'forward once'],
    },
  },
  {
    name: 'kb',
    kicker: 'CLI in Go, with LLMs',
    summary: 'One binary that turns a messy folder of notes and PDFs into a linked wiki I can ask questions over.',
    points: [
      'An fsnotify watcher feeds a debounced compile queue, with a polling fallback for WSL',
      'One LLM interface over Gemini, OpenRouter, Groq and Ollama that falls back if a provider fails',
      'A SHA-256 content cache, so the same note or image never goes to an API twice',
      '12 lint rules for the vault, with auto-fix for broken wiki links',
    ],
    stack: ['Go', 'Cobra', 'fsnotify', 'RAG'],
    repo: 'https://github.com/Maximus-08/kbcli',
    figure: {
      kind: 'flow',
      caption: 'kb watch, from new file to wiki page',
      nodes: [
        { label: 'Drop zone', sub: 'notes and PDFs' },
        { label: 'Compile queue', sub: 'one job at a time' },
        { label: 'LLM layer', sub: 'Gemini, OpenRouter, Groq, Ollama', accent: true },
        { label: 'Wiki vault', sub: 'Obsidian compatible' },
      ],
      edges: ['fsnotify, debounced', 'cache miss only', 'articles and links'],
    },
  },
  {
    name: 'SE-MPSQCL-LSTM',
    kicker: 'Research paper, SEISAE 2026',
    summary:
      'A hybrid quantum and classical model that recognises human activity from phone and wearable sensor data. I presented it at SEISAE 2026.',
    points: [
      'Started from MPSQCL, an existing quantum contrastive learning framework',
      'Unfroze the pretrained encoder during fine-tuning instead of keeping it fixed',
      'Replaced the linear classifier with an LSTM to pick up patterns over time, and changed the quantum circuit in the projection head',
      'Benchmarked against MPSQCL and QCLHAR on 8 public HAR datasets',
    ],
    stack: ['Python', 'PyTorch', 'PennyLane'],
    repo: 'https://github.com/Maximus-08/QMLHAR',
    figure: {
      kind: 'stats',
      caption: 'best-case gains over the MPSQCL and QCLHAR baselines',
      stats: [
        { value: '+10.83%', label: 'accuracy' },
        { value: '+6.09%', label: 'macro F1' },
        { value: '8', label: 'HAR datasets' },
      ],
    },
  },
  {
    name: 'PromptZip',
    kicker: 'RL environment, hackathon finalist',
    summary:
      'An OpenEnv environment where an agent learns to cut a prompt down to 55% of its tokens without breaking it. Finalist at the Meta × Scaler OpenEnv Hackathon.',
    points: [
      'The prompt is split into sentence spans and the agent acts on one span per step',
      'Three actions: elide a span, rephrase it shorter, or preserve it so nothing can touch it',
      'Final reward is an LLM judge’s quality score times the share of tokens saved, with a penalty if quality falls below 0.6',
      'Tasks go from padded QA questions to multi-step reasoning, where cutting the wrong span breaks the answer',
    ],
    stack: ['Python', 'RL', 'OpenEnv', 'Docker'],
    repo: 'https://github.com/Maximus-08/PromptZip',
    figure: {
      kind: 'flow',
      caption: 'one episode',
      nodes: [
        { label: 'Bloated prompt', sub: 'split into spans' },
        { label: 'Agent', sub: 'elide, rephrase or preserve', accent: true },
        { label: 'Token budget', sub: '55% of the original' },
        { label: 'LLM judge', sub: 'quality × tokens saved' },
      ],
      edges: ['one span per step', 'until under', 'score'],
    },
  },
];

export const alsoBuilt = [
  {
    name: 'Goops Monitor',
    what: 'Endpoint health checks, uptime tracking and a task runner for fixes',
    tags: 'Go · Docker',
    href: 'https://github.com/Maximus-08/Goops_monitor',
  },
  {
    name: 'Ghost IDE',
    what: 'Browser IDE that runs code in Docker containers and streams output over WebSockets',
    tags: 'React · Node.js · Docker',
    href: 'https://github.com/Maximus-08/Ghost_IDE',
  },
  {
    name: 'Store Intelligence',
    what: 'Hackathon build. Retail analytics from store CCTV footage with a live FastAPI dashboard',
    tags: 'Python · FastAPI',
    href: 'https://github.com/Maximus-08/purpllehack',
  },
  {
    name: 'Habits',
    what: 'A local-first habit tracker built around the ideas in Atomic Habits',
    tags: 'React · Firestore',
    href: 'https://github.com/Maximus-08/Habits',
  },
];

/* ──────────────────────────────── Toolbox ─────────────────────────────── */

export const toolbox = [
  { area: 'Languages', items: ['Go', 'Python', 'C++', 'SQL', 'JavaScript'] },
  { area: 'Kubernetes', items: ['client-go', 'controller-runtime', 'Operators', 'CRDs and RBAC', 'Helm'] },
  { area: 'Systems', items: ['Goroutines and channels', 'TCP/IP and UDP', 'fork/exec', 'Docker'] },
  { area: 'Backend and testing', items: ['FastAPI', 'Redis', 'GraphQL', 'Ginkgo/Gomega', 'envtest', 'GitHub Actions'] },
  { area: 'AI and ML', items: ['PyTorch', 'PennyLane', 'LLM APIs', 'RAG', 'Ollama'] },
  { area: 'Practice', items: [`${profile.leetcodeSolved} LeetCode problems`, `${profile.leetcodeRank}, ${profile.leetcodeRating} rating`] },
];
