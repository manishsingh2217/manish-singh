import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { Experience } from '@/hooks/useCMSData';

interface ExperienceFormProps {
  experience?: Experience | null;
  onClose: () => void;
}

const ICON_OPTIONS = [
  'Briefcase', 'GraduationCap', 'Building', 'Code', 'Database', 
  'Server', 'LineChart', 'Brain', 'Laptop', 'BookOpen'
];

const ExperienceForm = ({ experience, onClose }: ExperienceFormProps) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    type: 'work',
    icon: 'Briefcase',
    display_order: 0,
  });

  useEffect(() => {
    if (experience) {
      setForm({
        role: experience.role || '',
        company: experience.company || '',
        period: experience.period || '',
        description: experience.description || '',
        type: experience.type || 'work',
        icon: experience.icon || 'Briefcase',
        display_order: experience.display_order || 0,
      });
    }
  }, [experience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const expData = {
      role: form.role,
      company: form.company,
      period: form.period,
      description: form.description,
      type: form.type,
      icon: form.icon,
      display_order: form.display_order,
    };

    let error;

    if (experience) {
      const result = await supabase
        .from('experiences')
        .update(expData)
        .eq('id', experience.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('experiences')
        .insert(expData);
      error = result.error;
    }

    setSaving(false);

    if (error) {
      toast.error('Failed to save: ' + error.message);
    } else {
      toast.success(experience ? 'Experience updated!' : 'Experience created!');
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      onClose();
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold">{experience ? 'Edit Experience' : 'New Experience'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm">Role / Title *</Label>
            <Input
              required
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Data Scientist"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Company / Institution *</Label>
            <Input
              required
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company Name"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Period *</Label>
            <Input
              required
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              placeholder="2023 - Present"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work Experience</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Icon</Label>
            <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((icon) => (
                  <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="Describe your role..."
              className="text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {experience ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceForm;
