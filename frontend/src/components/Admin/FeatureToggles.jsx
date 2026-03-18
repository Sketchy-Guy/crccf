/**
 * Editable feature toggles for admin-controlled actions.
 */
function FeatureToggles({ configRows, onToggle }) {
  return (
    <div className="editorial-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="section-title">Feature Toggles</h3>
        <span className="mono-meta">ADMIN</span>
      </div>
      <div className="space-y-3">
        {configRows.map((row) => (
          <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-obsidian-border bg-obsidian-surface px-4 py-3" key={row.feature}>
            <span className="text-[13px] capitalize text-text-primary">{row.feature.replaceAll("_", " ")}</span>
            <button
              aria-pressed={row.is_enabled}
              className={`relative h-7 w-14 rounded-full transition-all duration-200 ${row.is_enabled ? "bg-accent-primary" : "bg-obsidian-border"}`}
              onClick={() => onToggle(row.feature, !row.is_enabled)}
              type="button"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all duration-200 ${row.is_enabled ? "left-8" : "left-1 bg-text-muted"}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeatureToggles;
