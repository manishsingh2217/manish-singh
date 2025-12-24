import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { personalInfo } from '@/data/cms';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding relative overflow-hidden" ref={ref}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-aurora-start/10 rounded-full blur-3xl" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="text-3xl">👋</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold">About Me</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-aurora-start/20 via-aurora-mid/10 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative glass-card rounded-3xl p-8">
                <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                  {personalInfo.bio}
                </p>
                <p className="text-foreground font-medium">
                  Strong problem-solver with a passion for leveraging data to drive innovation and measurable business impact.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: "📊", title: "Data Analysis", desc: "Transforming data into insights" },
              { icon: "🤖", title: "Machine Learning", desc: "Building predictive models" },
              { icon: "📈", title: "Visualization", desc: "Creating interactive dashboards" },
              { icon: "💡", title: "Problem Solving", desc: "Data-driven solutions" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="glass-card p-6 rounded-2xl hover-glow cursor-default group"
              >
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <h3 className="font-display font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
