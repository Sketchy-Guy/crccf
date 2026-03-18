/**
 * Styled live preview that mirrors the generated resume content.
 */
function ResumePreview({ resumeData }) {
  return (
    <section className="editorial-panel p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="section-title">Live Preview</h3>
        <span className="mono-meta">A4 PAPER</span>
      </div>

      <div className="mx-auto mt-6 min-h-[860px] max-w-[640px] rounded-[var(--radius-md)] bg-white px-12 py-12 text-[#1A1A2E] shadow-[0_32px_80px_rgba(0,0,0,0.6),0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-200 hover:scale-[1.005]">
        <header className="border-b border-slate-200 pb-4">
          <h1 className="font-heading text-[32px] font-bold text-[#1A1A2E]">{resumeData.full_name || "Your Name"}</h1>
          <p className="mt-3 font-body text-[12px] uppercase tracking-[0.15em] text-[#666]">Contact</p>
          <p className="mt-2 font-body text-[13px] text-[#333]">
            {[resumeData.email, resumeData.phone, resumeData.location].filter(Boolean).join(" | ")}
          </p>
          <p className="mt-1 font-body text-[13px] text-[#333]">
            {[resumeData.linkedin, resumeData.github].filter(Boolean).join(" | ")}
          </p>
          {resumeData.dob && (
            <p className="mt-2 font-body text-[13px] text-[#333]">
              DOB: {new Date(resumeData.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
          )}
        </header>

        <PreviewSection title="Summary" content={resumeData.summary} />
        <PreviewListSection title="Experience" items={resumeData.experience} primary="role" secondary="company" />
        <PreviewListSection title="Education" items={resumeData.education} primary="degree" secondary="institution" />
        <PreviewSection title="Skills" content={(resumeData.skills || []).join(", ")} />
        <PreviewListSection title="Projects" items={resumeData.projects} primary="title" secondary="tech_stack" />
      </div>
    </section>
  );
}

function PreviewSection({ title, content }) {
  if (!content) {
    return null;
  }

  return (
    <section className="mt-6">
      <h2 className="border-b border-[#E8E8E8] pb-2 font-body text-[11px] uppercase tracking-[0.15em] text-[#E8A838]">{title}</h2>
      <p className="mt-3 font-body text-[13px] leading-[1.6] text-[#333]">{content}</p>
    </section>
  );
}

function PreviewListSection({ title, items = [], primary, secondary }) {
  const visibleItems = items.filter((item) => Object.values(item || {}).some(Boolean));
  if (!visibleItems.length) {
    return null;
  }

  return (
    <section className="mt-6">
      <h2 className="border-b border-[#E8E8E8] pb-2 font-body text-[11px] uppercase tracking-[0.15em] text-[#E8A838]">{title}</h2>
      <div className="space-y-3">
        {visibleItems.map((item, index) => (
          <article className="mt-3" key={`${title}-${index}`}>
            <h3 className="font-body text-[13px] font-medium text-[#1A1A2E]">
              {item[primary]} {item[secondary] ? `| ${item[secondary]}` : ""}
            </h3>
            <p className="font-body text-[13px] leading-[1.6] text-[#333]">{Object.values(item).filter(Boolean).join(" | ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ResumePreview;
