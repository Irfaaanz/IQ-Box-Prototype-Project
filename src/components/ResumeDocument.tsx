import type { ResumeData } from "@/lib/types";

interface ResumeDocumentProps {
  data: ResumeData;
  ref?: React.Ref<HTMLDivElement>;
}

export default function ResumeDocument({ data, ref }: ResumeDocumentProps) {
  return (
    <div ref={ref} className="resume-document">
      {/* ===== Header ===== */}
      <header className="text-center border-b-2 border-slate-800 pb-3 mb-5">
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#1a202c",
            marginBottom: "6px",
          }}
        >
          {data.fullName}
        </h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px 12px",
            fontSize: "10.5px",
            color: "#4a5568",
          }}
        >
          {data.email && <span>{data.email}</span>}
          {data.phone && (
            <>
              <span style={{ color: "#cbd5e0" }}>|</span>
              <span>{data.phone}</span>
            </>
          )}
          {data.location && (
            <>
              <span style={{ color: "#cbd5e0" }}>|</span>
              <span>{data.location}</span>
            </>
          )}
          {data.linkedin && (
            <>
              <span style={{ color: "#cbd5e0" }}>|</span>
              <span>{data.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* ===== Professional Summary ===== */}
      {data.summary && (
        <section style={{ marginBottom: "16px" }}>
          <h2 className="resume-section-title">Professional Summary</h2>
          <p
            style={{
              fontSize: "11.5px",
              lineHeight: "1.65",
              color: "#2d3748",
            }}
          >
            {data.summary}
          </p>
        </section>
      )}

      {/* ===== Skills ===== */}
      {data.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: "16px" }}>
          <h2 className="resume-section-title">Technical Skills</h2>
          <p
            style={{
              fontSize: "11.5px",
              color: "#2d3748",
              lineHeight: "1.65",
            }}
          >
            {data.skills.join("  •  ")}
          </p>
        </section>
      )}

      {/* ===== Professional Experience ===== */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: "16px" }}>
          <h2 className="resume-section-title">Professional Experience</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {data.experience.map((exp, i) => (
              <div key={i}>
                {/* Title + Dates */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#1a202c",
                    }}
                  >
                    {exp.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "10.5px",
                      color: "#718096",
                      whiteSpace: "nowrap",
                      marginLeft: "16px",
                      flexShrink: 0,
                    }}
                  >
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>

                {/* Company + Location */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontStyle: "italic",
                      color: "#4a5568",
                    }}
                  >
                    {exp.company}
                  </span>
                  <span
                    style={{
                      fontSize: "10.5px",
                      color: "#718096",
                    }}
                  >
                    {exp.location}
                  </span>
                </div>

                {/* Bullets */}
                <ul
                  style={{
                    marginTop: "5px",
                    paddingLeft: "14px",
                    listStyleType: "disc",
                  }}
                >
                  {exp.bullets.map((bullet, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: "11px",
                        color: "#2d3748",
                        lineHeight: "1.55",
                        marginBottom: "2px",
                      }}
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Education ===== */}
      {data.education && data.education.length > 0 && (
        <section>
          <h2 className="resume-section-title">Education</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.education.map((edu, i) => (
              <div key={i}>
                {/* Degree + Date */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#1a202c",
                    }}
                  >
                    {edu.degree}
                  </h3>
                  <span
                    style={{
                      fontSize: "10.5px",
                      color: "#718096",
                      whiteSpace: "nowrap",
                      marginLeft: "16px",
                      flexShrink: 0,
                    }}
                  >
                    {edu.graduationDate}
                  </span>
                </div>

                {/* Institution + Location */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11.5px",
                      fontStyle: "italic",
                      color: "#4a5568",
                    }}
                  >
                    {edu.institution}
                  </span>
                  <span
                    style={{
                      fontSize: "10.5px",
                      color: "#718096",
                    }}
                  >
                    {edu.location}
                  </span>
                </div>

                {/* GPA */}
                {edu.gpa && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#4a5568",
                      marginTop: "2px",
                    }}
                  >
                    GPA: {edu.gpa}
                  </p>
                )}

                {/* Highlights */}
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul
                    style={{
                      marginTop: "4px",
                      paddingLeft: "14px",
                      listStyleType: "disc",
                    }}
                  >
                    {edu.highlights.map((h, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: "11px",
                          color: "#2d3748",
                          lineHeight: "1.55",
                          marginBottom: "1px",
                        }}
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
