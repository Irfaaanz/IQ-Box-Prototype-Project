"use client";

import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import InputPanel from "@/components/InputPanel";
import ResumeDocument from "@/components/ResumeDocument";
import { generateResume } from "@/app/actions/generate";
import type { ResumeData, FormInput } from "@/lib/types";

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: resumeData?.fullName
      ? `${resumeData.fullName} - Resume`
      : "Resume",
  });

  const handleGenerate = async (formData: FormInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateResume(formData);

      if (result.success && result.data) {
        setResumeData(result.data);
      } else {
        setError(result.error || "Failed to generate resume. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden app-container">
      {/* ===== Left Panel — Input ===== */}
      <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 panel-border border-r no-print">
        <InputPanel
          onGenerate={handleGenerate}
          isLoading={isLoading}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* ===== Right Panel — Preview ===== */}
      <div className="flex-1 flex flex-col min-h-[600px] lg:min-h-0 overflow-hidden preview-panel-bg">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b panel-border toolbar-bg flex-shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  resumeData
                    ? "bg-blue-500 shadow-sm shadow-blue-500/50 animate-pulse"
                    : "bg-slate-400 dark:bg-slate-600"
                }`}
              />
              <h2 className="text-xs font-semibold text-main-color">
                {isLoading
                  ? "Generating Resume..."
                  : resumeData
                    ? "ATS Resume Ready"
                    : "Live Resume Preview"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border panel-border toolbar-bg text-xs font-semibold text-main-color hover:border-blue-500 transition-all duration-200"
            >
              {isDarkMode ? (
                <>
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            {resumeData && (
              <button
                onClick={() => handlePrint()}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-lg active:scale-[0.98]"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download PDF
              </button>
            )}
          </div>
        </div>

        {/* Preview Canvas */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="flex justify-center">
            {/* Error State */}
            {error && (
              <div className="w-full max-w-md p-5 rounded-2xl bg-red-500/10 border border-red-500/20 animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                      Generation Failed
                    </p>
                    <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && !resumeData && !error && (
              <div className="flex flex-col items-center gap-5 mt-32 animate-fade-in">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/25">
                    <svg
                      className="w-7 h-7 text-white animate-spin"
                      viewBox="0 0 24 24"
                    >
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
                  </div>
                  <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-xl" />
                </div>
                <div className="text-center relative">
                  <p className="text-sm font-semibold text-main-color">
                    Crafting your resume...
                  </p>
                  <p className="text-xs text-sub-color mt-1.5 max-w-xs leading-relaxed">
                    AI is analyzing the job description and tailoring your
                    experience for maximum ATS compatibility
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!resumeData && !isLoading && !error && (
              <div className="flex flex-col items-center gap-5 mt-32 animate-fade-in">
                <div className="w-20 h-20 rounded-2xl empty-icon-card flex items-center justify-center border">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-main-color">
                    Your resume will appear here
                  </p>
                  <p className="text-xs text-sub-color mt-1.5">
                    Fill in the form and click{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      Generate ATS Resume
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Resume Preview */}
            {resumeData && (
              <div className="animate-slide-up w-full overflow-x-auto flex justify-center pb-6">
                <ResumeDocument data={resumeData} ref={contentRef} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
