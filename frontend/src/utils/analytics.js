/**
 * Compute display-friendly analytics for resume text content.
 */
export function getResumeAnalytics(resumeData) {
  const sections = [
    resumeData.full_name,
    resumeData.email,
    resumeData.phone,
    resumeData.location,
    resumeData.linkedin,
    resumeData.github,
    resumeData.summary,
    ...(resumeData.experience || []).flatMap((item) => Object.values(item || {})),
    ...(resumeData.education || []).flatMap((item) => Object.values(item || {})),
    ...(resumeData.projects || []).flatMap((item) => Object.values(item || {})),
    ...(resumeData.skills || [])
  ];

  const content = sections.filter(Boolean).join("\n");
  const trimmed = content.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = trimmed.length;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;

  return {
    words,
    characters,
    lettersIncludingSpaces: characters,
    paragraphs,
    estimatedReadingTime: Math.max(1, Math.ceil(words / 200))
  };
}
