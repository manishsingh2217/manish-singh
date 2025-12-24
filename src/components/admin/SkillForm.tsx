import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { Skill } from '@/hooks/useCMSData';

interface SkillFormProps {
  skill?: Skill | null;
  onClose: () => void;
}

const ICON_OPTIONS = [
  'Code', 'Database', 'BarChart', 'Brain', 'Server', 'Cloud', 
  'Cpu', 'Terminal', 'FileCode', 'LineChart', 'PieChart', 'Layers'
];

const CATEGORY_OPTIONS = [
  'Languages', 'Frameworks', 'Tools', 'Databases', 'Cloud', 'AI/ML', 'Other'
];

const SkillForm = ({ skill, onClose }: SkillFormProps) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'Languages',
    description: '',
    icon: 'Code',
    display_order: 0,
  });

  useEffect(() => {
    if (skill) {
      setForm({
        name: skill.name || '',
        category: skill.category || 'Languages',
        description: skill.description || '',
        icon: skill.icon || 'Code',
        display_order: skill.display_order || 0,
      });
    }
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const skillData = {
      name: form.name,
      category: form.category,
      description: form.description,
      icon: form.icon,
      display_order: form.display_order,
    };

    let error;

    if (skill) {
      const result = await supabase
        .from('skills')
        .update(skillData)
        .eq('id', skill.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('skills')
        .insert(skillData);
      error = result.error;
    }

    setSaving(false);

    if (error) {
      toast.error('Failed to save: ' + error.message);
    } else {
      toast.success(skill ? 'Skill updated!' : 'Skill created!');
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      onClose();
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{skill ? 'Edit Skill' : 'New Skill'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Python"
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
              <SelectTrigger>
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
            <Label>Display Order</Label>
            <Input
              type="number"
              value={form.display_order}
              onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {skill ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;
