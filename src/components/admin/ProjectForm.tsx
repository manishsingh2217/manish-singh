import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { Project } from '@/hooks/useCMSData';

interface ProjectFormProps {
  project?: Project | null;
  onClose: () => void;
}

const ProjectForm = ({ project, onClose }: ProjectFormProps) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    thumbnail: '',
    github_url: '',
    live_url: '',
    tech_stack: '',
    featured: false,
    coming_soon: false,
    display_order: 0,
  });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || '',
        description: project.description || '',
        thumbnail: project.thumbnail || '',
        github_url: project.github_url || '',
        live_url: project.live_url || '',
        tech_stack: project.tech_stack?.join(', ') || '',
        featured: project.featured || false,
        coming_soon: project.coming_soon || false,
        display_order: project.display_order || 0,
      });
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const projectData = {
      title: form.title,
      description: form.description,
      thumbnail: form.thumbnail,
      github_url: form.github_url,
      live_url: form.live_url,
      tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      featured: form.featured,
      coming_soon: form.coming_soon,
      display_order: form.display_order,
    };

    let error;

    if (project) {
      const result = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', project.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('projects')
        .insert(projectData);
      error = result.error;
    }

    setSaving(false);

    if (error) {
      toast.error('Failed to save project: ' + error.message);
    } else {
      toast.success(project ? 'Project updated!' : 'Project created!');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onClose();
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold">{project ? 'Edit Project' : 'New Project'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm">Title *</Label>
            <Input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Project title"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Display Order</Label>
            <Input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
              className="text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm">Description</Label>
            <Textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Project description"
              className="text-sm"
            />
          </div>
          
          {/* Thumbnail URL with Preview */}
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm">Thumbnail URL</Label>
            <Input
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              placeholder="https://i.ibb.co/... (use direct image URL)"
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Use a direct image URL (ending in .jpg, .png, etc). For ImgBB, right-click the image and copy the image address.
            </p>
            {form.thumbnail && (
              <div className="mt-2 relative">
                <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                <div className="w-full max-w-xs aspect-video bg-secondary/30 rounded-lg overflow-hidden">
                  <img
                    src={form.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                    onLoad={(e) => {
                      (e.target as HTMLImageElement).style.display = 'block';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.add('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center text-xs text-destructive p-2 text-center">
                    Failed to load image. Check if URL is a direct image link.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Tech Stack (comma-separated)</Label>
            <Input
              value={form.tech_stack}
              onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
              placeholder="React, TypeScript, Tailwind"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">GitHub URL</Label>
            <Input
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              placeholder="https://github.com/..."
              className="text-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm">Live URL</Label>
            <Input
              value={form.live_url}
              onChange={(e) => setForm({ ...form, live_url: e.target.value })}
              placeholder="https://..."
              className="text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.featured}
                onCheckedChange={(checked) => setForm({ ...form, featured: checked })}
              />
              <Label className="text-sm">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.coming_soon}
                onCheckedChange={(checked) => setForm({ ...form, coming_soon: checked })}
              />
              <Label className="text-sm">Coming Soon</Label>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {project ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
