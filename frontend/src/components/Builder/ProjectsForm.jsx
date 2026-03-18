/**
 * Dynamic project editor for portfolio items.
 */
function ProjectsForm({ resumeData, updateCollectionItem, addCollectionItem, removeCollectionItem }) {
  return (
    <div className="space-y-4">
      {resumeData.projects.map((item, index) => (
        <div key={`project-${index}`} className="editorial-panel is-active animate-slide-down p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="section-title text-[20px]">Project {index + 1}</h4>
            {resumeData.projects.length > 1 && (
              <button className="text-lg text-danger/50 transition hover:text-danger" onClick={() => removeCollectionItem("projects", index)} type="button">
                ×
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["title", "Title"],
              ["tech_stack", "Tech Stack"],
              ["description", "Description"],
              ["link", "Link"]
            ].map(([key, label]) => (
              <label className={key === "description" ? "block md:col-span-2" : "block"} key={key}>
                <span className="field-label">{label}</span>
                {key === "description" ? (
                  <textarea
                    className="editorial-input min-h-28 resize-y"
                    onChange={(event) => updateCollectionItem("projects", index, key, event.target.value)}
                    value={item[key]}
                  />
                ) : (
                  <input
                    className="editorial-input"
                    onChange={(event) => updateCollectionItem("projects", index, key, event.target.value)}
                    value={item[key]}
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        className="text-[13px] font-medium tracking-[0.04em] text-accent-primary underline-offset-4 hover:underline"
        onClick={() => addCollectionItem("projects", { title: "", tech_stack: "", description: "", link: "" })}
        type="button"
      >
        ＋ Add Project
      </button>
    </div>
  );
}

export default ProjectsForm;
