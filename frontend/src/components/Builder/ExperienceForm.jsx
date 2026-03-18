/**
 * Dynamic experience editor for role history entries.
 */
function ExperienceForm({ resumeData, updateCollectionItem, addCollectionItem, removeCollectionItem }) {
  return (
    <DynamicSection
      title="Experience"
      items={resumeData.experience}
      addLabel="Add Experience"
      onAdd={() => addCollectionItem("experience", { company: "", role: "", duration: "", description: "" })}
      onRemove={(index) => removeCollectionItem("experience", index)}
      fields={[
        ["company", "Company"],
        ["role", "Role"],
        ["duration", "Duration"],
        ["description", "Description"]
      ]}
      updateItem={(index, key, value) => updateCollectionItem("experience", index, key, value)}
    />
  );
}

function DynamicSection({ title, items, addLabel, onAdd, onRemove, fields, updateItem }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="editorial-panel is-active animate-slide-down p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="section-title text-[20px]">{title} {index + 1}</h4>
            {items.length > 1 && (
              <button className="text-lg text-danger/50 transition hover:text-danger" onClick={() => onRemove(index)} type="button">
                ×
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {fields.map(([key, label]) => (
              <label className={key === "description" ? "block md:col-span-2" : "block"} key={key}>
                <span className="field-label">{label}</span>
                {key === "description" ? (
                  <textarea
                    className="editorial-input min-h-28 resize-y"
                    onChange={(event) => updateItem(index, key, event.target.value)}
                    value={item[key]}
                  />
                ) : (
                  <input
                    className="editorial-input"
                    onChange={(event) => updateItem(index, key, event.target.value)}
                    value={item[key]}
                  />
                )}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button className="text-[13px] font-medium tracking-[0.04em] text-accent-primary underline-offset-4 hover:underline" onClick={onAdd} type="button">
        ＋ {addLabel}
      </button>
    </div>
  );
}

export default ExperienceForm;
