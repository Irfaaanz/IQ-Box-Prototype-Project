"use server";

import Groq from "groq-sdk";
import type { ResumeData, FormInput } from "@/lib/types";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const jsonSchema = {
  type: "object" as const,
  properties: {
    fullName: { type: "string" },
    email: { type: "string" },
    phone: { type: "string" },
    location: { type: "string" },
    linkedin: { type: "string" },
    summary: { type: "string" },
    skills: { type: "array", items: { type: "string" } },
    experience: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          company: { type: "string" },
          location: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["title", "company", "location", "startDate", "endDate", "bullets"],
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        properties: {
          degree: { type: "string" },
          institution: { type: "string" },
          location: { type: "string" },
          graduationDate: { type: "string" },
          gpa: { type: "string" },
          highlights: { type: "array", items: { type: "string" } },
        },
        required: ["degree", "institution", "location", "graduationDate", "gpa", "highlights"],
      },
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
    const systemPrompt = `You are a ruthless, expert technical recruiter and ATS-optimized resume writer with 20+ years of experience placing top candidates at Fortune 500 companies. Your job is to analyze a candidate's raw experience notes against a specific target job description, then produce a perfectly tailored, ATS-compliant resume that maximizes interview callback rates.

YOUR STRICT RULES:
1. KEYWORD OPTIMIZATION: Extract ALL relevant skills, technologies, certifications, and qualifications from the candidate's notes that match or relate to the target job description. Mirror exact keywords and phrases from the JD to beat ATS scanners.
2. STAR METHOD BULLETS: Rewrite ALL experience bullet points using the STAR method (Situation, Task, Action, Result). Each bullet MUST be concise (1-2 lines max), start with a powerful action verb, and be quantified with specific metrics (percentages, dollar amounts, team sizes, time saved) wherever possible. If exact numbers aren't provided, infer reasonable and professional estimates.
3. PROFESSIONAL SUMMARY: Write a compelling 2-3 sentence professional summary that positions the candidate as THE ideal person for this specific role. Use the job description's exact language and required qualifications.
4. SKILLS PRIORITIZATION: List the most relevant skills first (matching JD requirements), followed by supporting skills.
5. CHRONOLOGICAL ORDER: List experience most recent first.
6. CONTACT INFO: Use the contact information EXACTLY as provided — NEVER modify, fabricate, or hallucinate contact details.
7. PROFESSIONAL TONE: Maintain a confident, results-oriented tone throughout. Eliminate filler words and weak language.

You MUST respond with ONLY valid JSON (no markdown, no explanation, no extra text) matching this EXACT schema:
{
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "summary": "string (2-3 sentence professional summary)",
  "skills": ["string", "string", "..."],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "string (e.g. Jan 2022)",
      "endDate": "string (e.g. Present)",
      "bullets": ["string (STAR method bullet)", "..."]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "location": "string",
      "graduationDate": "string",
      "gpa": "string (or empty string)",
      "highlights": ["string", "..."]
    }
  ]
}`;

    const userPrompt = `CANDIDATE'S CONTACT INFORMATION:
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

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_object",
      },
      temperature: 0.6,
      max_tokens: 4096,
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      return { success: false, error: "No response received from AI." };
    }

    const data = JSON.parse(text) as ResumeData;
    return { success: true, data };
  } catch (error: unknown) {
    console.error("Resume generation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : String(error);

    if (
      errorMessage.includes("429") ||
      errorMessage.includes("rate_limit") ||
      errorMessage.includes("quota")
    ) {
      return {
        success: false,
        error:
          "Rate limit reached. Please wait a moment and try again.",
      };
    }

    return {
      success: false,
      error:
        "Failed to generate resume. Please check your API key and try again.",
    };
  }
}
