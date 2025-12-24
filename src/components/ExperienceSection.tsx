import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { experiences } from '@/data/cms';
import { 
  BarChart3, Shield, Code, GraduationCap, School 
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  BarChart3, Shield, Code, GraduationCap, School
};

const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const workExperiences = experiences.filter(e => e.type === 'work');
  const educationExperiences = experiences.filter(e => e.type === 'education');

  return (
    <section id="experience" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background accents */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-aurora-mid/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Work Experience */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-10"
            >
              <span className="text-3xl">💼</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Experience</h2>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-8">
                {workExperiences.map((exp, index) => {
                  const IconComponent = iconMap[exp.icon] || BarChart3;
                  
                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      className="relative pl-16"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 w-12 h-12 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>

                      <div className="glass-card p-6 rounded-2xl hover-glow">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="font-display font-bold text-lg">{exp.role}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-primary font-medium mb-3">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-10"
            >
              <span className="text-3xl">🎓</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold">Education</h2>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-8">
                {educationExperiences.map((exp, index) => {
                  const IconComponent = iconMap[exp.icon] || GraduationCap;
                  
                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
                      className="relative pl-16"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 w-12 h-12 rounded-full bg-accent/10 border-4 border-background flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-accent" />
                      </div>

                      <div className="glass-card p-6 rounded-2xl hover-glow">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="font-display font-bold text-lg">{exp.role}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs">
                            {exp.period}
                          </span>
                        </div>
                        <p className="text-accent font-medium mb-3">{exp.company}</p>
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
