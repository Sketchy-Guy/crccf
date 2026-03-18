/**
 * Compact admin table for browsing all submitted resumes.
 */
function ResumeTable({ resumes, onSelect, onDelete, selectedResumeId }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-obsidian-border bg-transparent">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-obsidian-border text-text-secondary">
          <tr>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.12em]">ID</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.12em]">Name</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.12em]">Email</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.12em]">Downloads</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.12em]">Shares</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.12em]">Last Share</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.12em]">Recipient</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.12em]">Last Edited</th>
            <th className="px-4 py-3 text-[11px] uppercase tracking-[0.12em]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {resumes.map((resume) => {
            const latestShare = resume.share_history?.[0];

            return (
            <tr
              onClick={() => onSelect(resume.resume_id)}
              className={`border-b border-obsidian-border bg-obsidian-surface transition hover:cursor-pointer hover:bg-obsidian-elevated ${
                selectedResumeId === resume.resume_id ? "bg-obsidian-elevated" : ""
              }`}
              key={resume.resume_id}
            >
              <td className="px-4 py-4 font-mono text-[13px] text-accent-primary">{resume.resume_id}</td>
              <td className="px-4 py-4 text-text-primary">{resume.full_name}</td>
              <td className="px-4 py-4 text-text-secondary">{resume.email}</td>
              <td className="px-4 py-4 font-mono text-text-primary">{resume.download_count}</td>
              <td className="px-4 py-4 font-mono text-text-primary">{resume.share_history?.length || 0}</td>
              <td className="px-4 py-4 text-text-primary">
                {latestShare ? (
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] uppercase tracking-[0.12em] ${
                      latestShare.method === "whatsapp" ? "bg-accent-primary text-[#080C10]" : "bg-accent-secondary text-white"
                    }`}
                  >
                    {latestShare.method}
                  </span>
                ) : (
                  <span className="text-text-muted">None</span>
                )}
              </td>
              <td className="px-4 py-4 text-text-secondary">{latestShare?.recipient || "No recipient yet"}</td>
              <td className="px-4 py-4 font-mono text-text-secondary">{new Date(resume.updated_at).toLocaleString()}</td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <button className="editorial-button-secondary px-3 py-2" onClick={(event) => {
                    event.stopPropagation();
                    onSelect(resume.resume_id);
                  }} type="button">
                    View
                  </button>
                  <button className="editorial-button-danger px-3 py-2" onClick={(event) => {
                    event.stopPropagation();
                    onDelete(resume.resume_id);
                  }} type="button">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}

export default ResumeTable;
