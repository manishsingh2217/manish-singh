import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { skills } from '@/data/cms';
import { 
  BarChart3, Database, Table, Brain, Cpu, Code, Coffee, Terminal, Braces, Atom 
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  BarChart3, Database, Table, Brain, Cpu, Code, Coffee, Terminal, Braces, Atom
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const categories = [
    { key: 'data', label: 'Data Science', icon: '📊' },
    { key: 'programming', label: 'Programming', icon: '💻' },
    { key: 'tools', label: 'Tools', icon: '🛠️' },
    { key: 'web', label: 'Web Development', icon: '🌐' },
  ];

  return (
    <section id="skills" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background accents */}
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-aurora-mid/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-4xl mb-4 block">🎯</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Skills & Tools
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <div className="grid gap-12">
          {categories.map((category, catIndex) => {
            const categorySkills = skills.filter(s => s.category === category.key);
            if (categorySkills.length === 0) return null;

            return (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: catIndex * 0.15 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-xl font-display font-semibold">{category.label}</h3>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categorySkills.map((skill, index) => {
                    const IconComponent = iconMap[skill.icon] || Code;
                    
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: catIndex * 0.15 + index * 0.08 }}
                        className="glass-card p-5 rounded-2xl hover-glow cursor-default group text-center"
                      >
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-display font-medium mb-1">{skill.name}</h4>
                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
