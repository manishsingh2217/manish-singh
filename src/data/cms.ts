// CMS Data Layer - Replace with Supabase/Sanity/Firebase later
// This serves as the single source of truth for all portfolio content

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  thumbnail: string;
  featured: boolean;
  comingSoon: boolean;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  icon: string;
  type: 'work' | 'education';
}

export interface Skill {
  id: string;
  name: string;
  category: 'data' | 'programming' | 'tools' | 'web';
  icon: string;
  description: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface PersonalInfo {
  name: string;
  roles: string[];
  location: string;
  bio: string;
  email: string;
  phone: string;
  address: string;
  cvUrl: string;
  profileImage: string;
  stats: {
    projects: number;
    experience: string;
    clients: number;
    awards: number;
  };
}

// Personal Information
export const personalInfo: PersonalInfo = {
  name: "Manish Singh",
  roles: ["Data Scientist", "Data Analyst", "Student"],
  location: "Noida, Delhi",
  bio: "I'm a detail-oriented Data Scientist and Data Analyst with expertise in statistical analysis, data visualization, and predictive modeling. Proficient in Python, SQL, Excel, and Power BI, with experience in building interactive dashboards and delivering data-driven business solutions. Skilled at transforming complex datasets into clear insights to support decision-making and optimize performance.",
  email: "engineeringbymanish@gmail.com",
  phone: "+91 6360017828",
  address: "Noida Sector-12/22, Delhi, India",
  cvUrl: "https://drive.google.com/file/d/1sVBlPf27C9Gr_sjI_zObmziL3LL18HlB/view?usp=drive_link",
  profileImage: "https://framerusercontent.com/images/z63d8ia6dNx5E5fhVE0IDEE3XGA.jpeg",
  stats: {
    projects: 20,
    experience: "1+",
    clients: 36,
    awards: 10,
  },
};

// Social Links
export const socialLinks: SocialLink[] = [
  { id: "1", platform: "LinkedIn", url: "https://www.linkedin.com/in/manishsingh22/", icon: "Linkedin" },
  { id: "2", platform: "GitHub", url: "https://github.com/manishsingh2217", icon: "Github" },
  { id: "3", platform: "Instagram", url: "https://www.instagram.com/bhagwatdas108/", icon: "Instagram" },
  { id: "4", platform: "YouTube", url: "https://www.youtube.com/@mkvlogs2217", icon: "Youtube" },
  { id: "5", platform: "Facebook", url: "https://www.facebook.com/profile.php?id=100031016568400", icon: "Facebook" },
];

// Projects
export const projects: Project[] = [
  {
    id: "1",
    title: "Hospital Analysis Dashboard",
    description: "Comprehensive hospital data analysis with interactive visualizations and insights for healthcare management decisions.",
    techStack: ["Power BI", "SQL", "Excel", "Data Analysis"],
    githubUrl: "https://github.com/manishsingh2217/Hospital-Analysis-dashboard.git",
    thumbnail: "https://framerusercontent.com/images/uGQ0q1X6S2PscXjW3ceCXNeiT0.png",
    featured: true,
    comingSoon: false,
    order: 1,
  },
  {
    id: "2",
    title: "Blinkit Grocery Sales Dashboard",
    description: "Sales analytics dashboard for Blinkit grocery platform with real-time metrics and performance tracking.",
    techStack: ["Power BI", "Data Visualization", "Analytics"],
    githubUrl: "https://github.com/manishsingh2217/Blinkit-Grocery-sales.git",
    thumbnail: "https://framerusercontent.com/images/nyScq7OaDPUQWiesewOpHGI6E.png",
    featured: true,
    comingSoon: false,
    order: 2,
  },
  {
    id: "3",
    title: "Shopify E-commerce Analysis",
    description: "E-commerce analytics solution for Shopify stores with sales trends, customer insights, and revenue forecasting.",
    techStack: ["Power BI", "SQL", "E-commerce Analytics"],
    githubUrl: "https://github.com/manishsingh2217/Shopify-Analysis.git",
    thumbnail: "https://framerusercontent.com/images/qnWC8UPC7kDrjgyL1z2m5yQJFU.png",
    featured: true,
    comingSoon: false,
    order: 3,
  },
  {
    id: "4",
    title: "Coffee Shop Sales Analysis",
    description: "Complete sales analysis for coffee shop business with customer behavior patterns and revenue optimization insights.",
    techStack: ["Excel", "Power BI", "Data Analysis"],
    githubUrl: "https://github.com/manishsingh2217/Coffee-Shop-sales-Project.git",
    thumbnail: "https://framerusercontent.com/images/48aRhQWe4JVnS0L6CzIjzRMYH4.png",
    featured: false,
    comingSoon: false,
    order: 4,
  },
  {
    id: "5",
    title: "ML Prediction Model",
    description: "Advanced machine learning model for predictive analytics and business forecasting.",
    techStack: ["Python", "Machine Learning", "TensorFlow"],
    githubUrl: "#",
    thumbnail: "",
    featured: false,
    comingSoon: true,
    order: 5,
  },
  {
    id: "6",
    title: "Real-time Analytics Platform",
    description: "Streaming data analytics platform with real-time dashboards and automated reporting.",
    techStack: ["Python", "Apache Kafka", "Power BI"],
    githubUrl: "#",
    thumbnail: "",
    featured: false,
    comingSoon: true,
    order: 6,
  },
];

// Experience & Education
export const experiences: Experience[] = [
  {
    id: "1",
    role: "Data Scientist & Analyst",
    company: "GrasTech",
    period: "2024 - Present",
    description: "Data Scientist & Analyst with expertise in data visualization, statistical analysis, and predictive modeling, leveraging Python, SQL, Excel, and Power BI to deliver actionable insights.",
    icon: "BarChart3",
    type: "work",
  },
  {
    id: "2",
    role: "Cybersecurity Enthusiast",
    company: "Udemy",
    period: "2023 - 2024",
    description: "Cybersecurity knowledge in Network Security, Windows Security, and Web Security, dedicated to safeguarding systems and ensuring data protection.",
    icon: "Shield",
    type: "work",
  },
  {
    id: "3",
    role: "Web Developer",
    company: "BITS",
    period: "2022 - 2023",
    description: "Web Developer skilled in HTML, CSS, JavaScript, React, Node.js, Bootstrap, and Tailwind, with a focus on building responsive and dynamic web applications.",
    icon: "Code",
    type: "work",
  },
  {
    id: "4",
    role: "B.Tech in Computer Science",
    company: "JMS Institute Of Technology & Science, AKTU",
    period: "2022 - 2026",
    description: "Pursuing B.Tech in Computer Science and Engineering from Dr. A.P.J. Abdul Kalam Technical University (AKTU).",
    icon: "GraduationCap",
    type: "education",
  },
  {
    id: "5",
    role: "Intermediate & High School",
    company: "New Central Public Academy, CBSE",
    period: "2019 - 2022",
    description: "Completed High School and Intermediate in CBSE board with 80% and 67% respectively.",
    icon: "School",
    type: "education",
  },
];

// Skills
export const skills: Skill[] = [
  { id: "1", name: "Power BI", category: "tools", icon: "BarChart3", description: "EDA & Visualization" },
  { id: "2", name: "SQL", category: "data", icon: "Database", description: "Query Language" },
  { id: "3", name: "Advanced Excel", category: "tools", icon: "Table", description: "Data Visualization" },
  { id: "4", name: "Machine Learning", category: "data", icon: "Brain", description: "Predictive Analysis" },
  { id: "5", name: "AI", category: "data", icon: "Cpu", description: "Creating Models" },
  { id: "6", name: "Python", category: "programming", icon: "Code", description: "Scripting & Programming" },
  { id: "7", name: "Java", category: "programming", icon: "Coffee", description: "Programming" },
  { id: "8", name: "C/C++", category: "programming", icon: "Terminal", description: "Programming" },
  { id: "9", name: "JavaScript", category: "web", icon: "Braces", description: "Web Development" },
  { id: "10", name: "React", category: "web", icon: "Atom", description: "Frontend Framework" },
];

// Services
export const services = [
  {
    id: "1",
    title: "Data Analysis",
    description: "Transform raw data into actionable insights with comprehensive analysis and visualization.",
    icon: "BarChart3",
  },
  {
    id: "2",
    title: "Data Science Solutions",
    description: "Build predictive models and machine learning solutions for business optimization.",
    icon: "Brain",
  },
  {
    id: "3",
    title: "Dashboard Development",
    description: "Create interactive Power BI dashboards for real-time business monitoring.",
    icon: "LayoutDashboard",
  },
  {
    id: "4",
    title: "Web Development",
    description: "Build modern, responsive web applications with latest technologies.",
    icon: "Globe",
  },
];
