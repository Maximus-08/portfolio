import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { nav, profile } from '../data/profile';
import { useTheme } from '../lib/theme';
import { Avatar } from './ui';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === 'dark' ? 'paper (light)' : 'cyanotype (dark)';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="grid h-9 w-9 place-items-center rounded-sm border border-line/20 text-ink transition-colors hover:border-line/50 hover:bg-ink/5"
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const ids = nav.map((n) => n.href.slice(1));

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? 'border-line/15 bg-paper/90 backdrop-blur-md' : 'border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-4 sm:px-6" aria-label="Main">
        <a href="#top" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Avatar className="h-8 w-8 rounded-full border border-line/20 object-cover" eager />
          <span className="font-medium tracking-tight">{profile.name}</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {nav.map((n) => {
            const isActive = active === n.href.slice(1);
            return (
              <a
                key={n.href}
                href={n.href}
                aria-current={isActive ? 'true' : undefined}
                className={`relative text-sm transition-colors hover:text-ink ${isActive ? 'text-ink' : 'text-muted'}`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-sun transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            );
          })}
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-sm border border-line/25 px-3 py-1.5 text-sm transition-colors hover:border-line/60 hover:bg-ink/5"
          >
            Résumé <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-9 w-9 place-items-center rounded-sm border border-line/20"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line/10 px-4 pb-5 pt-2 md:hidden">
          {[...nav, { label: 'Résumé ↗', href: profile.resume }].map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              {...(n.href.endsWith('.pdf') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="block border-b border-line/10 py-3 font-serif text-2xl"
            >
              {n.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
