/**
 * Create title-case suggestions for user-entered names and labels.
 */
export function getCapitalizationSuggestion(value = "") {
  const suggestion = value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  if (!value || suggestion === value) {
    return "";
  }

  return suggestion;
}
