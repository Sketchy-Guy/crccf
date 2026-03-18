/**
 * Detect duplicate skill tags while preserving original casing for messaging.
 */
export function findDuplicateSkill(skills = []) {
  const seen = new Set();
  for (const skill of skills) {
    const normalized = String(skill).trim().toLowerCase();
    if (!normalized) {
      continue;
    }
    if (seen.has(normalized)) {
      return skill;
    }
    seen.add(normalized);
  }
  return "";
}
