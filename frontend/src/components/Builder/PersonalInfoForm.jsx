import { getCapitalizationSuggestion } from "../../utils/capitalization";

/**
 * Collects the user's core personal details with inline validation hints.
 */
function PersonalInfoForm({ resumeData, updateResumeField }) {
  const suggestion = getCapitalizationSuggestion(resumeData.full_name);
  const phoneInvalid = resumeData.phone && !/^(?:\+91)?[6-9]\d{9}$/.test(resumeData.phone.replace(/\s+/g, ""));
  const emailInvalid = resumeData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resumeData.email);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full Name" value={resumeData.full_name} onChange={(value) => updateResumeField("full_name", value)} />
        <Field label="Email" value={resumeData.email} onChange={(value) => updateResumeField("email", value)} type="email" invalid={emailInvalid} />
        <Field label="Phone" value={resumeData.phone} onChange={(value) => updateResumeField("phone", value)} invalid={phoneInvalid} />
        <Field label="Date of Birth" value={resumeData.dob} onChange={(value) => updateResumeField("dob", value)} type="date" />
        <Field label="LinkedIn" value={resumeData.linkedin} onChange={(value) => updateResumeField("linkedin", value)} />
        <Field label="GitHub" value={resumeData.github} onChange={(value) => updateResumeField("github", value)} />
      </div>
      <Field label="Location" value={resumeData.location} onChange={(value) => updateResumeField("location", value)} />
      {suggestion && (
        <div className="rounded-[var(--radius-sm)] border-l-[3px] border-l-accent-primary bg-accent-glow px-4 py-3 text-[13px] text-text-primary">
          Did you mean: {suggestion}?
        </div>
      )}
      {emailInvalid && <ValidationText message="Please enter a valid email address." />}
      {phoneInvalid && <ValidationText message="Please enter a valid Indian phone number." />}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", invalid = false }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        className={`editorial-input ${
          invalid ? "border-danger text-danger focus:border-danger" : ""
        }`}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function ValidationText({ message }) {
  return <p className="text-[13px] text-danger">{message}</p>;
}

export default PersonalInfoForm;
