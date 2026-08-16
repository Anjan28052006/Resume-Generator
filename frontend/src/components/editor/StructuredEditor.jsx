import React, { useState } from 'react';
import { PersonalForm } from '../resume/PersonalForm';
import { ExperienceList } from '../resume/ExperienceList';
import { EducationList } from '../resume/EducationList';
import { ProjectsList } from '../resume/ProjectsList';
import { SkillsManager } from '../resume/SkillsManager';
import { CertificationsList } from '../resume/CertificationsList';
import { LanguagesList } from '../resume/LanguagesList';
import { Tabs } from '../common/Tabs';
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
  Award,
  Languages as LangIcon,
} from 'lucide-react';

export const StructuredEditor = ({
  content = {},
  onChange,
  onAiGenerateSummary,
  isAiGeneratingSummary = false,
  onAiImproveText,
}) => {
  const [activeSection, setActiveSection] = useState('personal');

  const handleSectionChange = (sectionKey, newSectionData) => {
    onChange({
      ...content,
      [sectionKey]: newSectionData,
    });
  };

  const sections = [
    {
      id: 'personal',
      label: 'Personal',
      icon: <User size={15} />,
    },
    {
      id: 'experience',
      label: 'Experience',
      badge: (content.experience || []).length || undefined,
      icon: <Briefcase size={15} />,
    },
    {
      id: 'education',
      label: 'Education',
      badge: (content.education || []).length || undefined,
      icon: <GraduationCap size={15} />,
    },
    {
      id: 'projects',
      label: 'Projects',
      badge: (content.projects || []).length || undefined,
      icon: <FolderGit2 size={15} />,
    },
    {
      id: 'skills',
      label: 'Skills',
      badge: (content.skills || []).length || undefined,
      icon: <Cpu size={15} />,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      badge: (content.certifications || []).length || undefined,
      icon: <Award size={15} />,
    },
    {
      id: 'languages',
      label: 'Languages',
      badge: (content.languages || []).length || undefined,
      icon: <LangIcon size={15} />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Section Navigation Tabs */}
      <div
        style={{
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        <Tabs
          tabs={sections}
          activeTab={activeSection}
          onChange={setActiveSection}
          size="md"
        />
      </div>

      {/* Active Section Content */}
      <div className="card" style={{ padding: '24px', backgroundColor: 'var(--bg-card)' }}>
        {activeSection === 'personal' && (
          <PersonalForm
            personal={content.personal || {}}
            onChange={(updated) => handleSectionChange('personal', updated)}
            onAiGenerateSummary={onAiGenerateSummary}
            isAiGenerating={isAiGeneratingSummary}
          />
        )}

        {activeSection === 'experience' && (
          <ExperienceList
            items={content.experience || []}
            onChange={(updated) => handleSectionChange('experience', updated)}
            onAiImprove={onAiImproveText}
          />
        )}

        {activeSection === 'education' && (
          <EducationList
            items={content.education || []}
            onChange={(updated) => handleSectionChange('education', updated)}
          />
        )}

        {activeSection === 'projects' && (
          <ProjectsList
            items={content.projects || []}
            onChange={(updated) => handleSectionChange('projects', updated)}
            onAiImprove={onAiImproveText}
          />
        )}

        {activeSection === 'skills' && (
          <SkillsManager
            skills={content.skills || []}
            onChange={(updated) => handleSectionChange('skills', updated)}
          />
        )}

        {activeSection === 'certifications' && (
          <CertificationsList
            items={content.certifications || []}
            onChange={(updated) => handleSectionChange('certifications', updated)}
          />
        )}

        {activeSection === 'languages' && (
          <LanguagesList
            items={content.languages || []}
            onChange={(updated) => handleSectionChange('languages', updated)}
          />
        )}
      </div>
    </div>
  );
};
