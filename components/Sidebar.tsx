'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Overview', href: '/', icon: '📊' },
  { name: 'Ads', href: '/ads', icon: '📈' },
  { name: 'Quiz Funnel', href: '/quiz', icon: '🎯' },
  { name: 'Landing Pages', href: '/pages', icon: '📄' },
  { name: 'Email', href: '/email', icon: '📧' },
  { name: 'Launcher', href: '/launcher', icon: '🚀' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-dgm-gray-dark border-r border-dgm-gray">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-dgm-gray">
        <h1 className="text-2xl font-bold text-dgm-gold">DGM Analytics</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-dgm-gold text-dgm-black'
                    : 'text-gray-300 hover:bg-dgm-gray hover:text-white'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-dgm-gray p-4">
        <p className="text-xs text-gray-500 text-center">
          Daily Growth Map © 2026
        </p>
      </div>
    </div>
  );
}
