import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalInfo, useProjects, useExperiences, useSkills, useSocialLinks, Project, Experience, Skill, SocialLink } from '@/hooks/useCMSData';
import { useResources, useUploadResource, useDeleteResource, Resource } from '@/hooks/useResources';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Save, LogOut, Home, Shield, Pencil, Link2, Upload, FileText, X, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const { data: resources, isLoading: loadingResources } = useResources();
  const uploadResource = useUploadResource();
  const deleteResourceMutation = useDeleteResource();

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

  // Resource upload states
  const [showResourceUpload, setShowResourceUpload] = useState(false);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [resourceCategory, setResourceCategory] = useState<'study_material' | 'project'>('study_material');
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const resourceFileRef = useRef<HTMLInputElement>(null);

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

  const handleUploadResource = async () => {
    if (!resourceFile || !resourceTitle.trim()) {
      toast.error('Please provide a title and select a file');
      return;
    }
    if (resourceFile.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }
    try {
      await uploadResource.mutateAsync({
        file: resourceFile,
        title: resourceTitle.trim(),
        description: resourceDescription.trim() || undefined,
        category: resourceCategory,
      });
      toast.success('Resource uploaded successfully!');
      setShowResourceUpload(false);
      setResourceTitle('');
      setResourceDescription('');
      setResourceFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload resource');
    }
  };

  const handleDeleteResource = async (resource: Resource) => {
    if (!confirm(`Delete "${resource.title}"?`)) return;
    try {
      await deleteResourceMutation.mutateAsync(resource);
      toast.success('Resource deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete resource');
    }
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
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <h1 className="text-base sm:text-xl font-display font-bold truncate">CMS Admin</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/')} className="text-xs sm:text-sm px-2 sm:px-3">
              <Home className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">View Site</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-xs sm:text-sm px-2 sm:px-3">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="personal" className="space-y-4 sm:space-y-6">
          <TabsList className="w-full h-auto flex flex-wrap gap-1 bg-secondary/30 p-1 rounded-lg">
            <TabsTrigger value="personal" className="flex-1 min-w-[80px] text-xs sm:text-sm py-1.5 sm:py-2">Personal</TabsTrigger>
            <TabsTrigger value="projects" className="flex-1 min-w-[80px] text-xs sm:text-sm py-1.5 sm:py-2">Projects</TabsTrigger>
            <TabsTrigger value="experience" className="flex-1 min-w-[80px] text-xs sm:text-sm py-1.5 sm:py-2">Experience</TabsTrigger>
            <TabsTrigger value="skills" className="flex-1 min-w-[80px] text-xs sm:text-sm py-1.5 sm:py-2">Skills</TabsTrigger>
            <TabsTrigger value="social" className="flex-1 min-w-[80px] text-xs sm:text-sm py-1.5 sm:py-2">Social</TabsTrigger>
            <TabsTrigger value="resources" className="flex-1 min-w-[80px] text-xs sm:text-sm py-1.5 sm:py-2">Resources</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-4 sm:space-y-6">
            <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
              <h2 className="text-base sm:text-lg font-semibold">Personal Information</h2>

              {loadingInfo ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm">Name</Label>
                    <Input
                      value={infoForm.name}
                      onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Roles (comma-separated)</Label>
                    <Input
                      value={infoForm.roles}
                      onChange={(e) => setInfoForm({ ...infoForm, roles: e.target.value })}
                      placeholder="Data Scientist, Data Analyst, Student"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Location</Label>
                    <Input
                      value={infoForm.location}
                      onChange={(e) => setInfoForm({ ...infoForm, location: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Email</Label>
                    <Input
                      type="email"
                      value={infoForm.email}
                      onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Phone</Label>
                    <Input
                      value={infoForm.phone}
                      onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Address</Label>
                    <Input
                      value={infoForm.address}
                      onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">CV URL</Label>
                    <Input
                      value={infoForm.cv_url}
                      onChange={(e) => setInfoForm({ ...infoForm, cv_url: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Profile Image URL</Label>
                    <Input
                      value={infoForm.profile_image}
                      onChange={(e) => setInfoForm({ ...infoForm, profile_image: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-sm">Bio</Label>
                    <Textarea
                      rows={4}
                      value={infoForm.bio}
                      onChange={(e) => setInfoForm({ ...infoForm, bio: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Projects Count</Label>
                    <Input
                      type="number"
                      value={infoForm.stats_projects}
                      onChange={(e) => setInfoForm({ ...infoForm, stats_projects: parseInt(e.target.value) || 0 })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Experience</Label>
                    <Input
                      value={infoForm.stats_experience}
                      onChange={(e) => setInfoForm({ ...infoForm, stats_experience: e.target.value })}
                      placeholder="1+"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Clients Count</Label>
                    <Input
                      type="number"
                      value={infoForm.stats_clients}
                      onChange={(e) => setInfoForm({ ...infoForm, stats_clients: parseInt(e.target.value) || 0 })}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Awards Count</Label>
                    <Input
                      type="number"
                      value={infoForm.stats_awards}
                      onChange={(e) => setInfoForm({ ...infoForm, stats_awards: parseInt(e.target.value) || 0 })}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}

              <Button onClick={handleSavePersonalInfo} disabled={saving} className="w-full sm:w-auto">
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 sm:space-y-6">
            {(showProjectForm || editingProject) ? (
              <ProjectForm 
                project={editingProject} 
                onClose={() => {
                  setShowProjectForm(false);
                  setEditingProject(null);
                }}
              />
            ) : (
              <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-semibold">Projects ({projects?.length || 0})</h2>
                  <Button onClick={() => setShowProjectForm(true)} className="w-full sm:w-auto">
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
                  <div className="space-y-3 sm:space-y-4">
                    {projects?.map((project) => (
                      <div key={project.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/30 rounded-lg">
                        <img
                          src={project.thumbnail || '/placeholder.svg'}
                          alt={project.title}
                          className="w-full sm:w-16 h-32 sm:h-16 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-sm sm:text-base truncate">{project.title}</h3>
                            {project.featured && (
                              <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">Featured</span>
                            )}
                            {project.coming_soon && (
                              <span className="text-xs px-2 py-0.5 rounded bg-accent/20 text-accent">Coming Soon</span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1">{project.description}</p>
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => setEditingProject(project)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {projects?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8 text-sm">No projects yet. Add your first project!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4 sm:space-y-6">
            {(showExperienceForm || editingExperience) ? (
              <ExperienceForm 
                experience={editingExperience} 
                onClose={() => {
                  setShowExperienceForm(false);
                  setEditingExperience(null);
                }}
              />
            ) : (
              <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-semibold">Experience & Education ({experiences?.length || 0})</h2>
                  <Button onClick={() => setShowExperienceForm(true)} className="w-full sm:w-auto">
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
                  <div className="space-y-3 sm:space-y-4">
                    {experiences?.map((exp) => (
                      <div key={exp.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/30 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base">{exp.role}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">{exp.company} • {exp.period}</p>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">
                            {exp.type}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => setEditingExperience(exp)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => handleDeleteExperience(exp.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {experiences?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8 text-sm">No experience yet. Add your first experience!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4 sm:space-y-6">
            {(showSkillForm || editingSkill) ? (
              <SkillForm 
                skill={editingSkill} 
                onClose={() => {
                  setShowSkillForm(false);
                  setEditingSkill(null);
                }}
              />
            ) : (
              <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-semibold">Skills & Tools ({skills?.length || 0})</h2>
                  <Button onClick={() => setShowSkillForm(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
                </div>

                {loadingSkills ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skills?.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{skill.name}</p>
                          <p className="text-xs text-muted-foreground">{skill.category}</p>
                        </div>
                        <div className="flex gap-1 ml-2">
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
                      <p className="text-center text-muted-foreground py-8 col-span-full text-sm">No skills yet. Add your first skill!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social" className="space-y-4 sm:space-y-6">
            {(showSocialLinkForm || editingSocialLink) ? (
              <SocialLinkForm 
                socialLink={editingSocialLink} 
                onClose={() => {
                  setShowSocialLinkForm(false);
                  setEditingSocialLink(null);
                }}
              />
            ) : (
              <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-semibold">Social Links ({socialLinks?.length || 0})</h2>
                  <Button onClick={() => setShowSocialLinkForm(true)} className="w-full sm:w-auto">
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
                  <div className="space-y-3 sm:space-y-4">
                    {socialLinks?.map((link) => (
                      <div key={link.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/30 rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Link2 className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm sm:text-base">{link.platform}</h3>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm text-muted-foreground hover:text-primary truncate block"
                            >
                              {link.url}
                            </a>
                          </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => setEditingSocialLink(link)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => handleDeleteSocialLink(link.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {socialLinks?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8 text-sm">No social links yet. Add your first link!</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4 sm:space-y-6">
            {showResourceUpload ? (
              <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold">Upload Resource</h2>
                  <Button variant="ghost" size="icon" onClick={() => { setShowResourceUpload(false); setResourceFile(null); setResourceTitle(''); setResourceDescription(''); }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm">Title</Label>
                    <Input value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)} placeholder="Resource title" className="text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Category</Label>
                    <Select value={resourceCategory} onValueChange={(v) => setResourceCategory(v as 'study_material' | 'project')}>
                      <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="study_material">Study Material</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-sm">Description (optional)</Label>
                    <Textarea value={resourceDescription} onChange={(e) => setResourceDescription(e.target.value)} placeholder="Brief description" rows={3} className="text-sm" />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label className="text-sm">File</Label>
                    <input ref={resourceFileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setResourceFile(f); }} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar" />
                    {resourceFile ? (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30 border">
                        <FileText className="w-5 h-5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{resourceFile.name}</p>
                          <p className="text-xs text-muted-foreground">{(resourceFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setResourceFile(null)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button type="button" variant="outline" className="w-full h-20 border-dashed" onClick={() => resourceFileRef.current?.click()}>
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Click to select a file (max 50MB)</span>
                        </div>
                      </Button>
                    )}
                  </div>
                </div>
                <Button onClick={handleUploadResource} disabled={uploadResource.isPending} className="w-full sm:w-auto">
                  {uploadResource.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {uploadResource.isPending ? 'Uploading...' : 'Upload Resource'}
                </Button>
              </div>
            ) : (
              <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-base sm:text-lg font-semibold">Resources ({resources?.length || 0})</h2>
                  <Button onClick={() => setShowResourceUpload(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Resource
                  </Button>
                </div>

                {loadingResources ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {resources?.map((resource) => (
                      <div key={resource.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-secondary/30 rounded-lg">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-sm sm:text-base truncate">{resource.title}</h3>
                            <span className="text-xs px-2 py-0.5 rounded bg-primary/20 text-primary">
                              {resource.category === 'study_material' ? 'Study Material' : 'Project'}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                            {resource.file_name} • {resource.file_size ? `${(resource.file_size / (1024 * 1024)).toFixed(1)} MB` : 'Unknown size'}
                          </p>
                        </div>
                        <div className="flex gap-2 self-end sm:self-auto">
                          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" asChild>
                            <a href={resource.file_url} target="_blank" rel="noopener noreferrer" download>
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button variant="destructive" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => handleDeleteResource(resource)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {resources?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8 text-sm">No resources yet. Upload your first resource!</p>
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
