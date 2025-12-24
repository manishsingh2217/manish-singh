-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  thumbnail TEXT,
  featured BOOLEAN DEFAULT false,
  coming_soon BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Briefcase',
  type TEXT NOT NULL CHECK (type IN ('work', 'education')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('data', 'programming', 'tools', 'web')),
  icon TEXT DEFAULT 'Code',
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create personal_info table (singleton)
CREATE TABLE public.personal_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  roles TEXT[] DEFAULT '{}',
  location TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  cv_url TEXT,
  profile_image TEXT,
  stats_projects INTEGER DEFAULT 0,
  stats_experience TEXT DEFAULT '0',
  stats_clients INTEGER DEFAULT 0,
  stats_awards INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social_links table
CREATE TABLE public.social_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Public read access for portfolio content
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public can view experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public can view personal_info" ON public.personal_info FOR SELECT USING (true);
CREATE POLICY "Public can view social_links" ON public.social_links FOR SELECT USING (true);

-- Admin write access for portfolio content
CREATE POLICY "Admins can insert projects" ON public.projects FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update projects" ON public.projects FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete projects" ON public.projects FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert experiences" ON public.experiences FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update experiences" ON public.experiences FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete experiences" ON public.experiences FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert skills" ON public.skills FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update skills" ON public.skills FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete skills" ON public.skills FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert personal_info" ON public.personal_info FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update personal_info" ON public.personal_info FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete personal_info" ON public.personal_info FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert social_links" ON public.social_links FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update social_links" ON public.social_links FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete social_links" ON public.social_links FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger for profiles on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add updated_at triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON public.personal_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
INSERT INTO public.personal_info (name, roles, location, bio, email, phone, address, cv_url, profile_image, stats_projects, stats_experience, stats_clients, stats_awards)
VALUES (
  'Manish Singh',
  ARRAY['Data Scientist', 'Data Analyst', 'Student'],
  'Noida, Delhi',
  'Manish Singh is a detail-oriented Data Scientist and Data Analyst with expertise in statistical analysis, data visualization, and predictive modeling. Proficient in Python, SQL, Excel, and Power BI, with experience in building interactive dashboards and delivering data-driven business solutions. Skilled at transforming complex datasets into clear insights to support decision-making and optimize performance. Strong problem-solver with a passion for leveraging data to drive innovation and measurable business impact.',
  'engineeringbymanish@gmail.com',
  '+91 6360017828',
  'Noida Sector-12/22, Delhi, India',
  'https://drive.google.com/file/d/1sVBlPf27C9Gr_sjI_zObmziL3LL18HlB/view?usp=drive_link',
  'https://framerusercontent.com/images/z63d8ia6dNx5E5fhVE0IDEE3XGA.jpeg',
  20,
  '1+',
  36,
  10
);

INSERT INTO public.social_links (platform, url, icon, display_order) VALUES
  ('Instagram', 'https://www.instagram.com/bhagwatdas108/', 'Instagram', 1),
  ('LinkedIn', 'https://www.linkedin.com/in/manishsingh22/', 'Linkedin', 2),
  ('GitHub', 'https://github.com/manishsingh2217', 'Github', 3),
  ('YouTube', 'https://www.youtube.com/@mkvlogs2217', 'Youtube', 4),
  ('Facebook', 'https://www.facebook.com/profile.php?id=100031016568400', 'Facebook', 5);

INSERT INTO public.projects (title, description, tech_stack, github_url, thumbnail, featured, coming_soon, display_order) VALUES
  ('Hospital Analysis Dashboard', 'Comprehensive hospital data analysis with interactive visualizations and insights for healthcare management decisions.', ARRAY['Power BI', 'SQL', 'Excel', 'Data Analysis'], 'https://github.com/manishsingh2217/Hospital-Analysis-dashboard.git', 'https://framerusercontent.com/images/uGQ0q1X6S2PscXjW3ceCXNeiT0.png', true, false, 1),
  ('Blinkit Grocery Sales Dashboard', 'Sales analytics dashboard for Blinkit grocery platform with real-time metrics and performance tracking.', ARRAY['Power BI', 'Data Visualization', 'Analytics'], 'https://github.com/manishsingh2217/Blinkit-Grocery-sales.git', 'https://framerusercontent.com/images/nyScq7OaDPUQWiesewOpHGI6E.png', true, false, 2),
  ('Shopify E-commerce Analysis', 'E-commerce analytics solution for Shopify stores with sales trends, customer insights, and revenue forecasting.', ARRAY['Power BI', 'SQL', 'E-commerce Analytics'], 'https://github.com/manishsingh2217/Shopify-Analysis.git', 'https://framerusercontent.com/images/qnWC8UPC7kDrjgyL1z2m5yQJFU.png', true, false, 3),
  ('Coffee Shop Sales Analysis', 'Complete sales analysis for coffee shop business with customer behavior patterns and revenue optimization insights.', ARRAY['Excel', 'Power BI', 'Data Analysis'], 'https://github.com/manishsingh2217/Coffee-Shop-sales-Project.git', 'https://framerusercontent.com/images/48aRhQWe4JVnS0L6CzIjzRMYH4.png', false, false, 4);

INSERT INTO public.experiences (role, company, period, description, icon, type, display_order) VALUES
  ('Data Scientist & Analyst', 'GrasTech', '2024 - Present', 'Data Scientist & Analyst with expertise in data visualization, statistical analysis, and predictive modeling, leveraging Python, SQL, Excel, and Power BI to deliver actionable insights. Focused on driving data-driven strategies that enhance business performance and decision-making.', 'BarChart3', 'work', 1),
  ('Cybersecurity Enthusiast', 'Udemy', '2023 - 2024', 'Cybersecurity Enthusiast with knowledge in Network Security, Windows Security, and Web Security, dedicated to safeguarding systems and ensuring data protection.', 'Shield', 'work', 2),
  ('Web Developer', 'BITS', '2022 - 2023', 'Web Developer skilled in HTML, CSS, JavaScript, React, Node.js, Bootstrap, and Tailwind, with a focus on building responsive and dynamic web applications.', 'Code', 'work', 3),
  ('B.Tech in Computer Science', 'JMS Institute Of Technology & Science, AKTU', '2022 - 2026', 'Pursuing B.Tech in Computer Science and Engineering from Dr. A.P.J. Abdul Kalam Technical University (AKTU).', 'GraduationCap', 'education', 4),
  ('Intermediate & High School', 'New Central Public Academy, CBSE', '2019 - 2022', 'Completed High School and Intermediate in CBSE board with 80% and 67% respectively.', 'School', 'education', 5);

INSERT INTO public.skills (name, category, icon, description, display_order) VALUES
  ('Power BI', 'tools', 'BarChart3', 'EDA tool', 1),
  ('SQL', 'data', 'Database', 'Query Language', 2),
  ('Advanced Excel', 'tools', 'Table', 'Data Visualization', 3),
  ('Machine Learning', 'data', 'Brain', 'Predictive Analysis', 4),
  ('AI', 'data', 'Cpu', 'Creating Model', 5),
  ('Python', 'programming', 'Code', 'Scripting Programming', 6),
  ('Java', 'programming', 'Coffee', 'Programming', 7),
  ('C', 'programming', 'Terminal', 'Programming', 8),
  ('C++', 'programming', 'Terminal', 'Programming', 9),
  ('JavaScript', 'web', 'Braces', 'Programming', 10);