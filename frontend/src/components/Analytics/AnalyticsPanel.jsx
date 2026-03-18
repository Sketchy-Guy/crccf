import { getResumeAnalytics } from "../../utils/analytics";
import { RESUME_WORD_WARNING_LIMIT } from "../../utils/constants";

/**
 * Live analytics summary for the current resume draft.
 */
function AnalyticsPanel({ resumeData }) {
  const analytics = getResumeAnalytics(resumeData);

  return (
    <section className="editorial-panel mt-6 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="section-title">Content Analytics</h3>
        <span className="mono-meta">LIVE</span>
      </div>

      {analytics.words > RESUME_WORD_WARNING_LIMIT && (
        <div className="editorial-warning mb-5">
          The recommended resume length is under 700 words.
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Words", analytics.words],
          ["Characters", analytics.characters],
          ["Letters", analytics.lettersIncludingSpaces],
          ["Paragraphs", analytics.paragraphs],
          ["Reading Time", `${analytics.estimatedReadingTime} min`]
        ].map(([label, value], index) => (
          <div className={`rounded-[var(--radius-md)] border border-obsidian-border bg-obsidian-surface p-4 ${index === 4 ? "md:col-span-4" : ""}`} key={label}>
            <div className="mb-4 h-0.5 w-full bg-accent-primary" />
            <div className="font-mono text-[28px] text-accent-primary">{value}</div>
            <div className="mt-2 font-body text-[10px] uppercase tracking-[0.14em] text-text-secondary">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AnalyticsPanel;
