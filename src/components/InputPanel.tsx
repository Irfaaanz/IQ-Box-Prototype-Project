"use client";

import { useState } from "react";
import type { FormInput } from "@/lib/types";

interface InputPanelProps {
  onGenerate: (data: FormInput) => void;
  isLoading: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export default function InputPanel({
  onGenerate,
  isLoading,
  isDarkMode,
  onToggleTheme,
}: InputPanelProps) {
  const [formData, setFormData] = useState<FormInput>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    experience: "",
    jobDescription: "",
  });

  const handleChange = (field: keyof FormInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onGenerate(formData);
  };

  const isValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    formData.experience.trim() &&
    formData.jobDescription.trim();

  return (
    <div className="lg:h-full flex flex-col input-panel-bg">
      {/* Brand Header */}
      <div className="p-6 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">ResumeAI</h1>
              <p className="text-[11px] text-sub-color font-medium -mt-0.5">
                AI-Powered Resume Enhancer
              </p>
            </div>
          </div>

          {/* Theme Toggle Button (Header option) */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl toolbar-bg text-main-color hover:text-blue-600 dark:hover:text-blue-400 border panel-border transition-all duration-200"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                /* Sun Icon */
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                /* Moon Icon */
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          )}
        </div>
        <p className="text-xs text-sub-color mt-3.5 leading-relaxed">
          Paste your experience and a target job description. Our AI will craft
          an ATS-optimized resume tailored specifically to the role.
        </p>
      </div>

      {/* Divider */}
      <div className="px-6">
        <div className="h-px panel-border border-t" />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-6 pt-5 space-y-5"
      >
        {/* Contact Info */}
        <fieldset className="space-y-2.5">
          <legend className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-1">
            <span className="w-4 h-px bg-blue-500/50" />
            Contact Details
          </legend>
          <input
            type="text"
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="input-field"
            required
          />
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="input-field"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="input-field"
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              className="input-field"
            />
          </div>
        </fieldset>

        {/* Experience */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <span className="w-4 h-px bg-blue-500/50" />
            Your Experience &amp; Skills *
          </label>
          <textarea
            placeholder="Paste your work experience, projects, skills, certifications — anything relevant. Don't worry about formatting; our AI will structure it professionally."
            value={formData.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            className="input-field min-h-[160px] resize-y"
            required
          />
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <span className="w-4 h-px bg-blue-500/50" />
            Target Job Description *
          </label>
          <textarea
            placeholder="Paste the full job description you're applying for. The AI will extract keywords and tailor your resume to maximize ATS compatibility."
            value={formData.jobDescription}
            onChange={(e) => handleChange("jobDescription", e.target.value)}
            className="input-field min-h-[160px] resize-y"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="btn-gradient w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/20"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Generating Resume...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Generate ATS Resume
            </>
          )}
        </button>

        {/* Footer hint */}
        <p className="text-[10px] text-muted-color text-center leading-relaxed font-medium">
          Powered by Llama 3.3 AI · High ATS Compatibility
        </p>
      </form>
    </div>
  );
}
