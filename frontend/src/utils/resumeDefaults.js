export const createDefaultResumeContent = (initialName = '', initialEmail = '') => ({
  personal: {
    fullName: initialName || '',
    email: initialEmail || '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Acme Corp',
      position: 'Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2022-01',
      endDate: 'Present',
      current: true,
      description: 'Built scalable microservices and real-time backend systems.',
      highlights: [
        'Improved system throughput by 35% through query caching and index optimization.',
        'Spearheaded the migration of monolithic services to event-driven architectures.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'State University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'Austin, TX',
      startDate: '2018-09',
      endDate: '2022-05',
      current: false,
      gpa: '3.8',
      highlights: ['Dean’s Honor List', 'Undergraduate Research in Distributed Systems'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'ResumeForge Platform',
      description: 'AI-assisted resume generator with real-time compilation and version snapshots.',
      technologies: ['Node.js', 'React', 'LaTeX', 'MongoDB', 'Socket.IO'],
      link: 'https://github.com/example/resumeforge',
      github: 'https://github.com/example/resumeforge',
      highlights: ['Integrated Gemini AI for automated resume summarization and text refinement.'],
    },
  ],
  skills: [
    {
      id: 'skill-1',
      category: 'Languages & Core',
      items: ['JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML/CSS'],
    },
    {
      id: 'skill-2',
      category: 'Frameworks & Tools',
      items: ['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'Git'],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2023',
      url: '',
    },
  ],
  languages: [
    {
      id: 'lang-1',
      language: 'English',
      proficiency: 'Native / Bilingual',
    },
  ],
});
