import { useState } from "react";

import { findDuplicateSkill } from "../../utils/duplicates";

/**
 * Tag-style skill editor with duplicate detection.
 */
function SkillsForm({ resumeData, updateResumeField }) {
  const [inputValue, setInputValue] = useState("");
  const duplicateSkill = findDuplicateSkill(resumeData.skills);

  const addSkill = () => {
    if (!inputValue.trim()) {
      return;
    }
    updateResumeField("skills", [...resumeData.skills, inputValue.trim()]);
    setInputValue("");
  };

  return (
    <div className="space-y-4">
      {duplicateSkill && (
        <div className="animate-shake rounded-[var(--radius-sm)] border-l-[3px] border-l-danger bg-[rgba(229,62,62,0.08)] px-4 py-3 text-[13px] text-danger">
          Duplicate skill detected: {duplicateSkill}
        </div>
      )}
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          className="editorial-input flex-1"
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Add a skill"
          value={inputValue}
        />
        <button className="editorial-button-primary" onClick={addSkill} type="button">
          Add Skill
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {resumeData.skills.map((skill, index) => (
          <button
            className="rounded-[4px] border border-[#E5E7EB] bg-[#F5F5F5] px-[10px] py-[3px] font-body text-[11px] text-[#333]"
            key={`${skill}-${index}`}
            onClick={() => updateResumeField("skills", resumeData.skills.filter((_, itemIndex) => itemIndex !== index))}
            type="button"
          >
            {skill} ×
          </button>
        ))}
      </div>
    </div>
  );
}

export default SkillsForm;
