/**
 * Summary textarea with a live character counter.
 */
function SummaryForm({ resumeData, updateResumeField }) {
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="field-label">Professional Summary</span>
        <textarea
          className="editorial-input min-h-[120px] resize-y px-[14px] py-[10px]"
          maxLength={1500}
          onChange={(event) => updateResumeField("summary", event.target.value)}
          value={resumeData.summary}
        />
      </label>
      <p className="mono-meta">{resumeData.summary.length}/1500 characters</p>
    </div>
  );
}

export default SummaryForm;
