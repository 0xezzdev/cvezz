import bcrypt from 'bcryptjs';

interface Admin {
  username: string;
  password: string;
}

interface PersonalInfo {
  name: string;
  title: string;
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email: string;
  heroTitles: string[];
  heroSubtitles: string[];
}

// Project categories
export type ProjectCategory = 
  | 'web' 
  | 'mobile'
  | 'desktop'
  | 'game'
  | 'ai'
  | 'backend'
  | 'frontend'
  | 'fullstack'
  | 'other';

interface Project {
  id: string;
  _id?: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: ProjectCategory;
  githubLink?: string;
  liveLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Contact {
  id: string;
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'responded';
  createdAt: Date;
}

export type SkillCategory = 
  | 'برمجة'
  | 'تصميم'
  | 'قواعد بيانات'
  | 'تطوير واجهات'
  | 'تطوير تطبيقات'
  | 'أخرى';

interface Skill {
  id: string;
  _id?: string;
  title: string;
  description: string;
  image: string;
  level: number;
  category: SkillCategory;
  createdAt: Date;
  updatedAt: Date;
}

interface Store {
  admin: Admin;
  projects: Project[];
  contacts: Contact[];
  personalInfo: PersonalInfo;
  skills: Skill[];
}

// In-memory storage
const store: Store = {
  admin: {
    username: 'admin',
    password: 'admin123'
  } as Admin,
  projects: [],
  contacts: [],
  personalInfo: {
    name: 'عزالدين محمد',
    title: 'مطور ويب Full Stack',
    bio: 'مرحباً بك في موقعي الشخصي. أنا مطور ويب متخصص في بناء تطبيقات الويب المتكاملة باستخدام أحدث التقنيات. أقدم حلولاً مبتكرة ومخصصة لتحقيق أهداف عملائي.',
    email: 'ezz.web.dev@gmail.com',
    githubUrl: 'https://github.com/yourusername',
    linkedinUrl: 'https://linkedin.com/in/yourusername',
    heroTitles: [
      'مرحباً، أنا عز الدين',
      'Full Stack Developer',
      'مطور مواقع محترف',
      'UI/UX Designer'
    ],
    heroSubtitles: [
      'أطور تجارب رقمية مميزة',
      'أصمم واجهات مستخدم احترافية',
      'أبني مواقع ويب متكاملة',
      'أحول أفكارك إلى واقع'
    ]
  },
  skills: [],
};

// Initialize with test data
if (store.contacts.length === 0) {
  const testContact: Contact = {
    id: '1',
    name: 'مستخدم تجريبي',
    email: 'test@example.com',
    subject: 'رسالة تجريبية',
    message: 'هذه رسالة تجريبية للتأكد من عمل النظام',
    status: 'pending',
    createdAt: new Date()
  };
  store.contacts.push(testContact);
  console.log('Initialized test contact:', testContact);
}

export { store, Admin, Project, Contact, PersonalInfo };

// Contact methods
export const getAllContacts = async (): Promise<Contact[]> => {
  console.log('Getting all contacts from store:', store.contacts);
  return store.contacts.map(contact => ({
    ...contact,
    _id: contact.id
  }));
};

export const createContact = async (contactData: Omit<Contact, 'id' | 'status' | 'createdAt'>): Promise<Contact> => {
  console.log('Creating new contact with data:', contactData);
  const contact: Contact = {
    id: Date.now().toString(),
    ...contactData,
    status: 'pending',
    createdAt: new Date()
  };
  store.contacts.push(contact);
  console.log('Contact created and stored:', contact);
  return { ...contact, _id: contact.id };
};

export const deleteContact = async (id: string): Promise<boolean> => {
  console.log('Attempting to delete contact with id:', id);
  const index = store.contacts.findIndex(c => c.id === id || c._id === id);
  if (index === -1) {
    console.log('Contact not found');
    return false;
  }
  store.contacts.splice(index, 1);
  console.log('Contact deleted successfully');
  return true;
};

// Admin methods
export const findAdminByUsername = async (username: string): Promise<Admin | null> => {
  if (store.admin.username === username) {
    return store.admin;
  }
  return null;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return password === hashedPassword;
};

// Project methods
export const getAllProjects = async (): Promise<Project[]> => {
  return store.projects;
};

export const createProject = async (projectData: Omit<Project, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  const id = Date.now().toString();
  const project: Project = {
    id,
    _id: id,
    ...projectData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  store.projects.push(project);
  return project;
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project | null> => {
  const index = store.projects.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  store.projects[index] = {
    ...store.projects[index],
    ...projectData,
    updatedAt: new Date()
  };
  return store.projects[index];
};

export const deleteProject = async (id: string): Promise<boolean> => {
  const index = store.projects.findIndex(p => p.id === id || p._id === id);
  if (index === -1) return false;
  
  store.projects.splice(index, 1);
  return true;
};

// Personal Info methods
export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  return store.personalInfo;
};

export const updatePersonalInfo = async (data: Partial<PersonalInfo>): Promise<PersonalInfo> => {
  store.personalInfo = {
    ...store.personalInfo,
    ...data
  };
  return store.personalInfo;
};

// Skills methods
export const getAllSkills = async (): Promise<Skill[]> => {
  return store.skills;
};

export const createSkill = async (skillData: Omit<Skill, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<Skill> => {
  const id = Date.now().toString();
  const skill: Skill = {
    id,
    _id: id,
    ...skillData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  store.skills.push(skill);
  return skill;
};

export const updateSkill = async (id: string, skillData: Partial<Skill>): Promise<Skill | null> => {
  const index = store.skills.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  store.skills[index] = {
    ...store.skills[index],
    ...skillData,
    updatedAt: new Date()
  };
  return store.skills[index];
};

export const deleteSkill = async (id: string): Promise<boolean> => {
  const index = store.skills.findIndex(s => s.id === id || s._id === id);
  if (index === -1) return false;
  
  store.skills.splice(index, 1);
  return true;
}; 