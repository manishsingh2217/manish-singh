import { motion } from 'framer-motion';
import { socialLinks, personalInfo } from '@/data/cms';
import { ArrowUp, Heart, Linkedin, Github, Instagram, Youtube, Facebook } from 'lucide-react';

const socialIconMap: Record<string, React.ElementType> = {
  Linkedin, Github, Instagram, Youtube, Facebook
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 border-t border-border/50">
      {/* Background accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-aurora-start/5 to-transparent" />

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="font-display font-bold text-2xl text-gradient mb-2 inline-block"
            >
              {personalInfo.name}
            </a>
            <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> © {new Date().getFullYear()}
            </p>
            <a
              href="/auth"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors mt-1 inline-block"
            >
              Admin
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const IconComponent = socialIconMap[social.icon] || Linkedin;
              return (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 transition-colors group"
                >
                  <IconComponent className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.a>
              );
            })}
          </div>

          {/* Scroll to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full glass-card flex items-center justify-center hover:bg-primary/10 hover-glow transition-all group"
          >
            <ArrowUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
