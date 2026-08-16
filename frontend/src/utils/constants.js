export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000');

export const STORAGE_KEYS = {
  TOKEN: 'resumeforge_token',
  USER: 'resumeforge_user',
};

export const RESUME_STATUSES = {
  DRAFT: 'draft',
  READY: 'ready',
  GENERATING: 'generating',
  FAILED: 'failed',
};

export const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Executive',
    description: 'Clean modern typography with accent dividers and organized experience sections.',
    badge: 'Popular',
  },
  {
    id: 'classic',
    name: 'Classic Academic',
    description: 'Traditional serif styling, standard margins, and formal hierarchy.',
    badge: 'Standard',
  },
  {
    id: 'minimal',
    name: 'Minimal Tech',
    description: 'Compact layout optimized for software engineers and data science roles.',
    badge: 'ATS Optimized',
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    description: 'Bold header section highlighting leadership, metrics, and career milestones.',
    badge: 'Senior Roles',
  },
];
