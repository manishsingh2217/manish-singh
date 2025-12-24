import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PersonalInfo {
  id: string;
  name: string;
  roles: string[];
  location: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  cv_url: string | null;
  profile_image: string | null;
  stats_projects: number;
  stats_experience: string;
  stats_clients: number;
  stats_awards: number;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  thumbnail: string | null;
  featured: boolean;
  coming_soon: boolean;
  display_order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string | null;
  icon: string | null;
  type: string;
  display_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  description: string | null;
  display_order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  display_order: number;
}

export const usePersonalInfo = () => {
  return useQuery({
    queryKey: ['personal-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('personal_info')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as PersonalInfo | null;
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Project[];
    },
  });
};

export const useExperiences = () => {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Experience[];
    },
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Skill[];
    },
  });
};

export const useSocialLinks = () => {
  return useQuery({
    queryKey: ['social-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as SocialLink[];
    },
  });
};
