import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { personalInfo } from '@/data/cms';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>{personalInfo.name} | Data Scientist & Data Analyst Portfolio</title>
        <meta name="description" content={personalInfo.bio.substring(0, 160)} />
        <meta name="keywords" content="Data Scientist, Data Analyst, Power BI, Python, SQL, Machine Learning, Portfolio" />
        <meta property="og:title" content={`${personalInfo.name} - Data Scientist Portfolio`} />
        <meta property="og:description" content={personalInfo.bio.substring(0, 160)} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${personalInfo.name} - Data Scientist`} />
        <meta name="twitter:description" content={personalInfo.bio.substring(0, 160)} />
        <link rel="canonical" href="https://manish-singh.com" />
      </Helmet>

      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <ServicesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
