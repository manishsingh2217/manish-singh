import { motion } from 'framer-motion';
import { Download, Mail, Instagram, Linkedin, Github, Youtube, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePersonalInfo, useSocialLinks } from '@/hooks/useCMSData';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram,
  Linkedin,
  Github,
  Youtube,
  Facebook,
};

const ProfileCard = () => {
  const { data: personalInfo, isLoading: loadingInfo } = usePersonalInfo();
  const { data: socialLinks, isLoading: loadingSocial } = useSocialLinks();

  if (loadingInfo) {
    return (
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <Skeleton className="w-full aspect-square rounded-xl" />
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="w-10 h-10 rounded-full" />
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-12 flex-1" />
          <Skeleton className="h-12 flex-1" />
        </div>
      </div>
    );
  }

  if (!personalInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card rounded-2xl p-6 space-y-6"
    >
      {/* Profile Image */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl blur-xl" />
        <img
          src={personalInfo.profile_image || '/placeholder.svg'}
          alt={personalInfo.name}
          className="relative w-full aspect-square object-cover rounded-xl"
        />
      </div>

      {/* Available Badge */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Available for work</span>
        </div>
      </div>

      {/* Name */}
      <h2 className="text-2xl font-display font-bold text-center text-foreground">
        {personalInfo.name}
      </h2>

      {/* Social Links */}
      {!loadingSocial && socialLinks && (
        <div className="flex justify-center gap-2">
          {socialLinks.map((link) => {
            const Icon = iconMap[link.icon] || Instagram;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </div>
      )}

      {/* CTA Buttons */}
      <div className="grid grid-cols-2 gap-2 w-full overflow-hidden">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-border/50 hover:bg-secondary/50 px-2 py-2 text-[10px] lg:text-xs"
          asChild
        >
          <a
            href={personalInfo.cv_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1"
          >
            <Download className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
            <span className="truncate">Download CV</span>
          </a>
        </Button>
        <Button
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-2 text-[10px] lg:text-xs"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <Mail className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
          <span className="truncate">Contact Me</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
