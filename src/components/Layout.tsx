import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, Calendar, User } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/add', icon: Plus, label: 'Add' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 bg-gradient-primary shadow-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary-foreground">Medicine Reminder</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center justify-center gap-1 p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon size={28} strokeWidth={2.5} />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
