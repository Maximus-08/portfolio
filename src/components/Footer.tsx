import { ArrowUp } from 'lucide-react';
import { profile } from '../data/profile';

export default function Footer() {
  return (
    <footer className="rule relative">
      {/* by the bottom of the page, the sun has set */}
      <span aria-hidden className="absolute -top-[13px] left-1/2 h-3 w-6 -translate-x-1/2 rounded-t-full bg-sun" />
      <div className="mx-auto flex max-w-page flex-col gap-3 px-4 py-8 font-mono text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a href="#top" className="inline-flex items-center gap-1 hover:text-ink">
          Back to top <ArrowUp className="h-3 w-3" />
        </a>
      </div>
    </footer>
  );
}
