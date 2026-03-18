import FeatureToggles from "./FeatureToggles";
import ResumeTable from "./ResumeTable";

/**
 * Admin dashboard layout that combines resume management and feature controls.
 */
function AdminDashboard({
  resumes,
  configRows,
  selectedResume,
  onSelectResume,
  onDeleteResume,
  onToggleFeature
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
      <div className="space-y-6">
        <ResumeTable
          onDelete={onDeleteResume}
          onSelect={onSelectResume}
          resumes={resumes}
          selectedResumeId={selectedResume?.resume_id}
        />
        {!resumes.length && (
          <section className="editorial-panel p-5">
            <p className="eyebrow">Admin Status</p>
            <p className="mt-3 text-[14px] text-text-secondary">No resumes found yet. Create one from the builder and refresh this dashboard.</p>
          </section>
        )}
        {selectedResume && (
          <section className="editorial-panel p-5">
            <h3 className="section-title">{selectedResume.full_name}</h3>
            <p className="mono-meta mt-2">{selectedResume.resume_id}</p>
            <div className="gold-divider my-4" />
            <div className="mb-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-[var(--radius-md)] border border-obsidian-border bg-obsidian-surface px-4 py-3">
                <p className="eyebrow">Downloads</p>
                <p className="mt-2 font-mono text-[22px] text-accent-primary">{selectedResume.download_count}</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-obsidian-border bg-obsidian-surface px-4 py-3">
                <p className="eyebrow">Total Shares</p>
                <p className="mt-2 font-mono text-[22px] text-accent-primary">{selectedResume.share_history?.length || 0}</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-obsidian-border bg-obsidian-surface px-4 py-3">
                <p className="eyebrow">Last Updated</p>
                <p className="mt-2 font-mono text-[13px] text-text-primary">{new Date(selectedResume.updated_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-5 text-sm text-text-secondary">
              <div>
                <p className="eyebrow mb-3">Share History</p>
                {(selectedResume.share_history || []).length ? (
                  (selectedResume.share_history || []).map((entry) => (
                    <div className="mb-2 rounded-[var(--radius-md)] border border-obsidian-border bg-obsidian-surface px-4 py-3" key={entry.id}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className={`rounded-full px-2 py-1 text-[11px] uppercase tracking-[0.12em] ${
                            entry.method === "whatsapp" ? "bg-accent-primary text-[#080C10]" : "bg-accent-secondary text-white"
                          }`}>
                            {entry.method === "whatsapp" ? "WhatsApp Sent" : "Email Sent"}
                          </span>
                          <p className="mt-2 text-text-primary">{entry.recipient}</p>
                        </div>
                        <span className="font-mono text-[12px] text-text-secondary">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[var(--radius-md)] border border-obsidian-border bg-obsidian-surface px-4 py-3">
                    No share history yet.
                  </div>
                )}
              </div>
              <div>
                <p className="eyebrow mb-3">Activity Log</p>
                {(selectedResume.activity_logs || []).length ? (
                  (selectedResume.activity_logs || []).map((entry) => (
                    <div className="mb-2 rounded-[var(--radius-md)] border border-obsidian-border bg-obsidian-surface px-4 py-3" key={entry.id}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="capitalize text-text-primary">{entry.action.replaceAll("_", " ")}</span>
                        <span className="font-mono text-[12px] text-text-secondary">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[var(--radius-md)] border border-obsidian-border bg-obsidian-surface px-4 py-3">
                    No activity logs yet.
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      <FeatureToggles configRows={configRows} onToggle={onToggleFeature} />
    </div>
  );
}

export default AdminDashboard;
