import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalInfo, useProjects, useExperiences, useSkills, useSocialLinks } from '@/hooks/useCMSData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Save, LogOut, Home, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: personalInfo, isLoading: loadingInfo } = usePersonalInfo();
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: experiences, isLoading: loadingExperiences } = useExperiences();
  const { data: skills, isLoading: loadingSkills } = useSkills();
  const { data: socialLinks, isLoading: loadingSocial } = useSocialLinks();

  const [saving, setSaving] = useState(false);

  // Form states
  const [infoForm, setInfoForm] = useState({
    name: '',
    roles: '',
    location: '',
    bio: '',
    email: '',
    phone: '',
    address: '',
    cv_url: '',
    profile_image: '',
    stats_projects: 0,
    stats_experience: '',
    stats_clients: 0,
    stats_awards: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (personalInfo) {
      setInfoForm({
        name: personalInfo.name || '',
        roles: personalInfo.roles?.join(', ') || '',
        location: personalInfo.location || '',
        bio: personalInfo.bio || '',
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        address: personalInfo.address || '',
        cv_url: personalInfo.cv_url || '',
        profile_image: personalInfo.profile_image || '',
        stats_projects: personalInfo.stats_projects || 0,
        stats_experience: personalInfo.stats_experience || '',
        stats_clients: personalInfo.stats_clients || 0,
        stats_awards: personalInfo.stats_awards || 0,
      });
    }
  }, [personalInfo]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSavePersonalInfo = async () => {
    if (!personalInfo?.id) return;
    setSaving(true);

    const { error } = await supabase
      .from('personal_info')
      .update({
        name: infoForm.name,
        roles: infoForm.roles.split(',').map(r => r.trim()),
        location: infoForm.location,
        bio: infoForm.bio,
        email: infoForm.email,
        phone: infoForm.phone,
        address: infoForm.address,
        cv_url: infoForm.cv_url,
        profile_image: infoForm.profile_image,
        stats_projects: infoForm.stats_projects,
        stats_experience: infoForm.stats_experience,
        stats_clients: infoForm.stats_clients,
        stats_awards: infoForm.stats_awards,
      })
      .eq('id', personalInfo.id);

    setSaving(false);

    if (error) {
      toast.error('Failed to save: ' + error.message);
    } else {
      toast.success('Personal info saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['personal-info'] });
    }
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete project');
    } else {
      toast.success('Project deleted');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  };

  const handleDeleteExperience = async (id: string) => {
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete experience');
    } else {
      toast.success('Experience deleted');
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete skill');
    } else {
      toast.success('Skill deleted');
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 text-center space-y-4 max-w-md">
          <Shield className="w-16 h-16 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-display font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have admin privileges. Please contact the site owner to get access.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
            <Button onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-semibold">Personal Information</h2>

              {loadingInfo ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={infoForm.name}
                      onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Roles (comma-separated)</Label>
                    <Input
                      value={infoForm.roles}
                      onChange={(e) => setInfoForm({ ...infoForm, roles: e.target.value })}
                      placeholder="Data Scientist, Data Analyst, Student"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={infoForm.location}
                      onChange={(e) => setInfoForm({ ...infoForm, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={infoForm.email}
                      onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={infoForm.phone}
                      onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={infoForm.address}
                      onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CV URL</Label>
                    <Input
                      value={infoForm.cv_url}
                      onChange={(e) => setInfoForm({ ...infoForm, cv_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profile Image URL</Label>
                    <Input
                      value={infoForm.profile_image}
                      onChange={(e) => setInfoForm({ ...infoForm, profile_image: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label>Bio</Label>
                    <Textarea
                      rows={4}
                      value={infoForm.bio}
                      onChange={(e) => setInfoForm({ ...infoForm, bio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Projects Count</Label>
                    <Input
                      type="number"
                      value={infoForm.stats_projects}
                      onChange={(e) => setInfoForm({ ...infoForm, stats_projects: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Experience</Label>
                    <Input
                      value={infoForm.stats_experience}
                      onChange={(e) => setInfoForm({ ...infoForm, stats_experience: e.target.value })}
                      placeholder="1+"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Clients Count</Label>
                    <Input
                      type="number"
                      value={infoForm.stats_clients}
                      onChange={(e) => setInfoForm({ ...infoForm, stats_clients: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Awards Count</Label>
                    <Input
                      type="number"
                      value={infoForm.stats_awards}
                      onChange={(e) => setInfoForm({ ...infoForm, stats_awards: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              )}

              <Button onClick={handleSavePersonalInfo} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Projects</h2>
              </div>

              {loadingProjects ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {projects?.map((project) => (
                    <div key={project.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                      <img
                        src={project.thumbnail || '/placeholder.svg'}
                        alt={project.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Experience & Education</h2>
              </div>

              {loadingExperiences ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {experiences?.map((exp) => (
                    <div key={exp.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{exp.role}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company} • {exp.period}</p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                        {exp.type}
                      </span>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteExperience(exp.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Skills & Tools</h2>
              </div>

              {loadingSkills ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {skills?.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{skill.name}</p>
                        <p className="text-xs text-muted-foreground">{skill.category}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteSkill(skill.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
