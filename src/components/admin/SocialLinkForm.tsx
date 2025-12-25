import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { SocialLink } from '@/hooks/useCMSData';

interface SocialLinkFormProps {
  socialLink?: SocialLink | null;
  onClose: () => void;
}

const ICON_OPTIONS = [
  'Instagram', 'Linkedin', 'Github', 'Youtube', 'Facebook', 
  'Twitter', 'Globe', 'Mail', 'Link'
];

const SocialLinkForm = ({ socialLink, onClose }: SocialLinkFormProps) => {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    platform: '',
    url: '',
    icon: 'Link',
    display_order: 0,
  });

  useEffect(() => {
    if (socialLink) {
      setForm({
        platform: socialLink.platform || '',
        url: socialLink.url || '',
        icon: socialLink.icon || 'Link',
        display_order: socialLink.display_order || 0,
      });
    }
  }, [socialLink]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const linkData = {
      platform: form.platform,
      url: form.url,
      icon: form.icon,
      display_order: form.display_order,
    };

    let error;

    if (socialLink) {
      const result = await supabase
        .from('social_links')
        .update(linkData)
        .eq('id', socialLink.id);
      error = result.error;
    } else {
      const result = await supabase
        .from('social_links')
        .insert(linkData);
      error = result.error;
    }

    setSaving(false);

    if (error) {
      toast.error('Failed to save: ' + error.message);
    } else {
      toast.success(socialLink ? 'Link updated!' : 'Link created!');
      queryClient.invalidateQueries({ queryKey: ['social-links'] });
      onClose();
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold">{socialLink ? 'Edit Social Link' : 'New Social Link'}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm">Platform Name *</Label>
            <Input
              required
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              placeholder="Instagram"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">URL *</Label>
            <Input
              required
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://instagram.com/username"
              className="text-sm"
            />
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
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {socialLink ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SocialLinkForm;
