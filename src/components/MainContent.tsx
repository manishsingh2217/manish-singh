import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Briefcase, GraduationCap, ArrowUpRight, ChevronDown } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersonalInfo, useProjects, useExperiences, useSkills } from "@/hooks/useCMSData";
import { Skeleton } from "@/components/ui/skeleton";
import ContactSection from "@/components/ContactSection";

const INITIAL_PROJECTS_SHOWN = 4;

const TypewriterText = ({ texts }: { texts: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = texts[currentIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentWord.length) {
            setDisplayText(currentWord.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 50 : 100,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, texts]);

  return (
    <span className="text-emerald-400">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const getIcon = (iconName: string | null): React.ComponentType<{ className?: string }> => {
  if (!iconName) return Briefcase;
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[iconName] || Briefcase;
};

const MainContent = () => {
  const { data: personalInfo, isLoading: loadingInfo } = usePersonalInfo();
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: experiences, isLoading: loadingExperiences } = useExperiences();
  const { data: skills, isLoading: loadingSkills } = useSkills();
  const [projectsToShow, setProjectsToShow] = useState(INITIAL_PROJECTS_SHOWN);

  const workExperiences = experiences?.filter((exp) => exp.type === "work") || [];
  const education = experiences?.filter((exp) => exp.type === "education") || [];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xl">👋</span>
          <span>Say Hello</span>
        </div>

        {loadingInfo ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          personalInfo && (
            <>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight">
                I'm {personalInfo.name},
                <br />
                <TypewriterText texts={personalInfo.roles || ["Data Scientist"]} />
                <br />
                <span className="text-foreground">Based in {personalInfo.location}</span>
              </h1>

              <p className="text-muted-foreground text-lg max-w-3xl">{personalInfo.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                    {personalInfo.stats_projects}+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Completed Projects</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                    {personalInfo.stats_experience}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Years of Experience</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                    {personalInfo.stats_clients}+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground">
                    {personalInfo.stats_awards}+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Awards Received</div>
                </div>
              </div>
            </>
          )
        )}
      </motion.section>

      {/* Domains/Experience Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        id="experience"
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-semibold">Domains</h2>
        </div>

        {loadingExperiences ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {workExperiences.map((exp) => {
              const Icon = getIcon(exp.icon);
              return (
                <motion.div key={exp.id} whileHover={{ scale: 1.01 }} className="glass-card rounded-xl p-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{exp.role}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">{exp.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        id="projects"
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-semibold">Projects</h2>
        </div>

        {loadingProjects ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4">
              {projects
                ?.filter((p) => !p.coming_soon)
                .slice(0, projectsToShow)
                .map((project) => (
                  <motion.a
                    key={project.id}
                    href={project.live_url || project.github_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="glass-card rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={project.thumbnail || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{project.title}</h3>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack?.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-xs px-2 py-1 rounded bg-secondary/50 text-muted-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.a>
                ))}
            </div>

            {/* Load More Button */}
            {projects && projects.filter((p) => !p.coming_soon).length > projectsToShow && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setProjectsToShow((prev) => prev + 4)}
                  className="border-border/50 hover:bg-secondary/50"
                >
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Load More Projects
                </Button>
              </div>
            )}
          </>
        )}
      </motion.section>

      {/* Education Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        id="education"
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-semibold">Education</h2>
        </div>

        {loadingExperiences ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="glass-card rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.role}</h3>
                    <p className="text-sm text-muted-foreground">{edu.company}</p>
                    <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-secondary/50 text-muted-foreground whitespace-nowrap">
                    {edu.period}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Skills Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        id="skills"
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
            <LucideIcons.Code className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-semibold">Skills & Tools</h2>
        </div>

        {loadingSkills ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {skills?.map((skill) => {
              const Icon = getIcon(skill.icon);
              return (
                <motion.div
                  key={skill.id}
                  whileHover={{ scale: 1.05 }}
                  className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 text-center"
                >
                  <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm text-foreground">{skill.name}</h3>
                  <p className="text-xs text-muted-foreground">{skill.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>

      {/* Contact Section - Using the real ContactSection component */}
      <ContactSection />
    </div>
  );
};

export default MainContent;
