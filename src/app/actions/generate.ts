"use server";

import { GoogleGenAI, Type } from "@google/genai";
import type { ResumeData, FormInput } from "@/lib/types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const resumeSchema = {
  type: Type.OBJECT,
  properties: {
    fullName: {
      type: Type.STRING,
      description: "The candidate's full name, exactly as provided",
    },
    email: {
      type: Type.STRING,
      description: "The candidate's email address, exactly as provided",
    },
    phone: {
      type: Type.STRING,
      description: "The candidate's phone number, exactly as provided",
    },
    location: {
      type: Type.STRING,
      description: "The candidate's location (city, state/country)",
    },
    linkedin: {
      type: Type.STRING,
      description: "The candidate's LinkedIn URL, exactly as provided",
    },
    summary: {
      type: Type.STRING,
      description:
        "A compelling 2-3 sentence professional summary tailored to the target role, mirroring JD language",
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description:
        "Flat list of relevant technical and soft skills, prioritizing keywords from the job description for ATS matching",
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Job title" },
          company: { type: Type.STRING, description: "Company name" },
          location: { type: Type.STRING, description: "Job location" },
          startDate: {
            type: Type.STRING,
            description: "Start date (e.g., Jan 2022)",
          },
          endDate: {
            type: Type.STRING,
            description: "End date (e.g., Present)",
          },
          bullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description:
              "3-5 achievement bullet points rewritten using the STAR method, quantified with metrics",
          },
        },
        required: [
          "title",
          "company",
          "location",
          "startDate",
          "endDate",
          "bullets",
        ],
      },
      description: "Work experience entries in reverse chronological order",
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING, description: "Degree name" },
          institution: {
            type: Type.STRING,
            description: "University or school name",
          },
          location: { type: Type.STRING, description: "Institution location" },
          graduationDate: {
            type: Type.STRING,
            description: "Graduation date (e.g., May 2020)",
          },
          gpa: {
            type: Type.STRING,
            description: "GPA if available, otherwise empty string",
          },
          highlights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Notable achievements, relevant coursework, or honors",
          },
        },
        required: [
          "degree",
          "institution",
          "location",
          "graduationDate",
          "gpa",
          "highlights",
        ],
      },
      description: "Education entries",
    },
  },
  required: [
    "fullName",
    "email",
    "phone",
    "location",
    "linkedin",
    "summary",
    "skills",
    "experience",
    "education",
  ],
};

export async function generateResume(
  formData: FormInput
): Promise<{ success: boolean; data?: ResumeData; error?: string }> {
  try {
    const prompt = `You are a ruthless, expert technical recruiter and ATS-optimized resume writer with 20+ years of experience placing top candidates at Fortune 500 companies. Your job is to analyze a candidate's raw experience notes against a specific target job description, then produce a perfectly tailored, ATS-compliant resume that maximizes interview callback rates.

YOUR STRICT RULES:
1. KEYWORD OPTIMIZATION: Extract ALL relevant skills, technologies, certifications, and qualifications from the candidate's notes that match or relate to the target job description. Mirror exact keywords and phrases from the JD to beat ATS scanners.
2. STAR METHOD BULLETS: Rewrite ALL experience bullet points using the STAR method (Situation, Task, Action, Result). Each bullet MUST be concise (1-2 lines max), start with a powerful action verb, and be quantified with specific metrics (percentages, dollar amounts, team sizes, time saved) wherever possible. If exact numbers aren't provided, infer reasonable and professional estimates.
3. PROFESSIONAL SUMMARY: Write a compelling 2-3 sentence professional summary that positions the candidate as THE ideal person for this specific role. Use the job description's exact language and required qualifications.
4. SKILLS PRIORITIZATION: List the most relevant skills first (matching JD requirements), followed by supporting skills.
5. CHRONOLOGICAL ORDER: List experience most recent first.
6. CONTACT INFO: Use the contact information EXACTLY as provided — NEVER modify, fabricate, or hallucinate contact details.
7. PROFESSIONAL TONE: Maintain a confident, results-oriented tone throughout. Eliminate filler words and weak language.

CANDIDATE'S CONTACT INFORMATION:
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || "Not provided"}
Location: ${formData.location || "Not provided"}
LinkedIn: ${formData.linkedin || "Not provided"}

CANDIDATE'S RAW EXPERIENCE, SKILLS & NOTES:
---
${formData.experience}
---

TARGET JOB DESCRIPTION:
---
${formData.jobDescription}
---

Generate the optimized, ATS-tailored resume data now. Be aggressive in matching the candidate to the role.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    });

    const text = response.text;
    if (!text) {
      return { success: false, error: "No response received from AI." };
    }

    const data = JSON.parse(text) as ResumeData;
    return { success: true, data };
  } catch (error) {
    console.error("Resume generation error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate resume. Please try again.",
    };
  }
}
