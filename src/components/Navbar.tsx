import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Lock } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
  { label: 'Resources', href: '/resources', isExternal: true },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navItems
        .filter((item) => !item.isExternal)
        .map((item) => item.href.replace('#', ''));

      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(section);
          return;
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    setIsMobileMenuOpen(false);
    if (item.isExternal) {
      window.open(item.href, '_blank');
    } else {
      const element = document.querySelector(item.href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-2'
            : 'py-4'
        }`}
      >
        <div className="container-custom">
          <div
            className={`flex items-center justify-between rounded-2xl px-6 transition-all duration-500 ${
              isScrolled
                ? 'h-14 bg-background/70 backdrop-blur-2xl border border-border/40 shadow-lg'
                : 'h-16 bg-transparent'
            }`}
          >
            {/* Logo */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-display font-bold text-xl text-gradient relative"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              MS
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary/80 to-transparent rounded-full" />
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = !item.isExternal && activeSection === item.href.replace('#', '');
                return (
                  <motion.button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}

              {/* Admin button - subtle */}
              <motion.button
                onClick={() => window.open('/auth', '_blank')}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="px-2 py-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors rounded-xl"
                title="Admin Login"
              >
                <Lock className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-xl h-9 w-9 hover:bg-primary/10"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {theme === 'dark' ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden rounded-xl h-9 w-9 hover:bg-primary/10"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isMobileMenuOpen ? 'close' : 'open'}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Menu className="h-5 w-5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="relative m-4 mt-24 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="p-4 space-y-1">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => handleNavClick(item)}
                    className="block w-full text-left text-base font-medium py-3 px-4 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  >
                    {item.label}
                  </motion.button>
                ))}
                
                {/* Admin in mobile */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.04 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.open('/auth', '_blank');
                  }}
                  className="flex items-center gap-2 w-full text-left text-sm font-medium py-3 px-4 rounded-xl text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30 transition-all duration-200"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Admin
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
