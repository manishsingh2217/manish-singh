import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import MainContent from '@/components/MainContent';
import FloatingContactButton from '@/components/FloatingContactButton';
import Navbar from '@/components/Navbar';
import { usePersonalInfo } from '@/hooks/useCMSData';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { data: personalInfo } = usePersonalInfo();
  const { user, isAdmin } = useAuth();

  return (
    <>
      <Helmet>
        <title>{personalInfo?.name || 'Manish Singh'} | Data Scientist & Data Analyst Portfolio</title>
        <meta name="description" content={personalInfo?.bio?.substring(0, 160) || 'Data Scientist and Data Analyst portfolio'} />
        <meta name="keywords" content="Data Scientist, Data Analyst, Power BI, Python, SQL, Machine Learning, Portfolio" />
        <meta property="og:title" content={`${personalInfo?.name || 'Manish Singh'} - Data Scientist Portfolio`} />
        <meta property="og:description" content={personalInfo?.bio?.substring(0, 160) || 'Data Scientist portfolio'} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${personalInfo?.name || 'Manish Singh'} - Data Scientist`} />
        <meta name="twitter:description" content={personalInfo?.bio?.substring(0, 160) || 'Data Scientist portfolio'} />
        <link rel="canonical" href="https://manish-singh.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        {/* Admin Link */}
        {user && isAdmin && (
          <div className="fixed top-4 right-4 z-50">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-16">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar - Profile Card */}
            <aside className="w-full lg:w-72 xl:w-80 lg:flex-shrink-0">
              <div className="lg:sticky lg:top-8">
                <ProfileCard />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <MainContent />
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 mt-16">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} {personalInfo?.name || 'Manish Singh'}. All rights reserved.</p>
          </div>
        </footer>

        {/* Floating Contact Button */}
        <FloatingContactButton />
      </div>
    </>
  );
};

export default Index;
