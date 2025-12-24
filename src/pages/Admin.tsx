import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalInfo, useProjects, useExperiences, useSkills, useSocialLinks, Project, Experience, Skill, SocialLink } from '@/hooks/useCMSData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Save, LogOut, Home, Shield, Pencil, Link2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectForm from '@/components/admin/ProjectForm';
import ExperienceForm from '@/components/admin/ExperienceForm';
import SkillForm from '@/components/admin/SkillForm';
import SocialLinkForm from '@/components/admin/SocialLinkForm';

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

  // Modal states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [showSocialLinkForm, setShowSocialLinkForm] = useState(false);

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

  const handleDeleteSocialLink = async (id: string) => {
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete social link');
    } else {
      toast.success('Social link deleted');
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
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
          <h1 className="text-xl font-display font-bold">CMS Admin Panel</h1>
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
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
            {(showProjectForm || editingProject) ? (
              <ProjectForm 
                project={editingProject} 
                onClose={() => {
                  setShowProjectForm(false);
                  setEditingProject(null);
                }}
              />
            ) : (
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Projects ({projects?.length || 0})</h2>
                  <Button onClick={() => setShowProjectForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
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
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{project.title}</h3>
                            {project.featured && (
                              <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">Featured</span>
                            )}
                            {project.coming_soon && (
                              <span className="text-xs px-2 py-0.5 rounded bg-accent/20 text-accent">Coming Soon</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingProject(project)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {projects?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No projects yet. Add your first project!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            {(showExperienceForm || editingExperience) ? (
              <ExperienceForm 
                experience={editingExperience} 
                onClose={() => {
                  setShowExperienceForm(false);
                  setEditingExperience(null);
                }}
              />
            ) : (
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Experience & Education ({experiences?.length || 0})</h2>
                  <Button onClick={() => setShowExperienceForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
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
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingExperience(exp)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteExperience(exp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {experiences?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No experience yet. Add your first experience!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            {(showSkillForm || editingSkill) ? (
              <SkillForm 
                skill={editingSkill} 
                onClose={() => {
                  setShowSkillForm(false);
                  setEditingSkill(null);
                }}
              />
            ) : (
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Skills & Tools ({skills?.length || 0})</h2>
                  <Button onClick={() => setShowSkillForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>

                {loadingSkills ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills?.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{skill.name}</p>
                          <p className="text-xs text-muted-foreground">{skill.category}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingSkill(skill)}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteSkill(skill.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {skills?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8 col-span-full">No skills yet. Add your first skill!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social" className="space-y-6">
            {(showSocialLinkForm || editingSocialLink) ? (
              <SocialLinkForm 
                socialLink={editingSocialLink} 
                onClose={() => {
                  setShowSocialLinkForm(false);
                  setEditingSocialLink(null);
                }}
              />
            ) : (
              <div className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Social Links ({socialLinks?.length || 0})</h2>
                  <Button onClick={() => setShowSocialLinkForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Social Link
                  </Button>
                </div>

                {loadingSocial ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {socialLinks?.map((link) => (
                      <div key={link.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Link2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{link.platform}</h3>
                          <a 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-muted-foreground hover:text-primary truncate block max-w-md"
                          >
                            {link.url}
                          </a>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingSocialLink(link)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteSocialLink(link.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {socialLinks?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No social links yet. Add your first link!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
