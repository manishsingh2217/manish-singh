import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { projects } from '@/data/cms';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Clock } from 'lucide-react';

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const activeProjects = projects.filter(p => !p.comingSoon);
  const upcomingProjects = projects.filter(p => p.comingSoon);

  return (
    <section id="projects" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background accents */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-aurora-start/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-4xl mb-4 block">🚀</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Data-driven solutions that deliver real business value
          </p>
        </motion.div>

        {/* Active Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {activeProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative glass-card rounded-2xl overflow-hidden hover-glow">
                {/* Project Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  
                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/50 hover:bg-primary/10"
                      asChild
                    >
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </a>
                    </Button>
                    {project.liveUrl && (
                      <Button size="sm" className="flex-1" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Projects Section */}
        {upcomingProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-display font-bold">More Projects Coming Soon</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {upcomingProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  className="glass-card p-6 rounded-2xl border-dashed border-2 border-border/50 relative overflow-hidden"
                >
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Coming Soon
                  </div>

                  <h4 className="text-lg font-display font-semibold mb-2 text-muted-foreground">
                    {project.title}
                  </h4>
                  <p className="text-sm text-muted-foreground/70 mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
