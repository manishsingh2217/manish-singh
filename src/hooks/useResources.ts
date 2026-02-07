import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  category: 'study_material' | 'project';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useResources = (category?: 'study_material' | 'project') => {
  return useQuery({
    queryKey: ['resources', category],
    queryFn: async () => {
      let query = supabase
        .from('resources')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Resource[];
    },
  });
};

export const useUploadResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      file, 
      title, 
      description, 
      category 
    }: { 
      file: File; 
      title: string; 
      description?: string; 
      category: 'study_material' | 'project';
    }) => {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${category}/${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(fileName);
      
      // Insert record in database
      const { data, error } = await supabase
        .from('resources')
        .insert({
          title,
          description: description || null,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          category,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (resource: Resource) => {
      // Extract file path from URL
      const urlParts = resource.file_url.split('/resources/');
      if (urlParts[1]) {
        await supabase.storage
          .from('resources')
          .remove([urlParts[1]]);
      }
      
      // Delete record from database
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resource.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
};
