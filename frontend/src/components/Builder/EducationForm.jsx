/**
 * Dynamic education editor for academic history.
 */
function EducationForm({ resumeData, updateCollectionItem, addCollectionItem, removeCollectionItem }) {
  return (
    <div className="space-y-4">
      {resumeData.education.map((item, index) => (
        <div key={`education-${index}`} className="editorial-panel is-active animate-slide-down p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="section-title text-[20px]">Education {index + 1}</h4>
            {resumeData.education.length > 1 && (
              <button className="text-lg text-danger/50 transition hover:text-danger" onClick={() => removeCollectionItem("education", index)} type="button">
                ×
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["degree", "Degree"],
              ["institution", "Institution"],
              ["year", "Year"],
              ["grade", "Grade"]
            ].map(([key, label]) => (
              <label className="block" key={key}>
                <span className="field-label">{label}</span>
                <input
                  className="editorial-input"
                  onChange={(event) => updateCollectionItem("education", index, key, event.target.value)}
                  value={item[key]}
                />
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        className="text-[13px] font-medium tracking-[0.04em] text-accent-primary underline-offset-4 hover:underline"
        onClick={() => addCollectionItem("education", { degree: "", institution: "", year: "", grade: "" })}
        type="button"
      >
        ＋ Add Education
      </button>
    </div>
  );
}

export default EducationForm;
