export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  gpa: string;
  highlights: string[];
}

export interface FormInput {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  experience: string;
  jobDescription: string;
}
