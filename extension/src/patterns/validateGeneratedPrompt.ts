// Validates a generated Cursor/Codex prompt against the PromptGen architecture
// (docs/PROMPT_GENERATION_PRINCIPLES.md) and safety rules.

export type PromptValidationResult = {
  ok: boolean;
  warnings: string[];
  errors: string[];
};

export type PromptValidationContext = {
  // Whether detected Uncodixify findings exist for this prompt.
  hasFindings?: boolean;
  // Whether the user actively selected a design direction.
  designDirectionSelected?: boolean;
};

const REQUIRED_SECTIONS: Array<{ heading: string; label: string }> = [
  { heading: "# Role", label: "Role" },
  { heading: "# Context", label: "Context" },
  { heading: "# Task", label: "Task" },
  { heading: "# Implementation Plan", label: "Implementation Plan" },
  { heading: "# Style Preservation Rules", label: "Style Preservation Rules" },
  { heading: "# Constraints", label: "Constraints" },
  { heading: "# Expected Output", label: "Expected Output" }
];

// Phrases that indicate a generic redesign prompt — disallowed when no design
// direction was selected.
// Note: phrases must not collide with the prompt's own preservation lines
// (e.g. "Do not redesign this into a different template").
const REDESIGN_PHRASES = [
  "make this ui more modern",
  "make it modern and beautiful",
  "redesign the section",
  "change colors, fonts, layout, and animations freely",
  "use this template and redesign"
];

export function validateGeneratedPrompt(
  prompt: string,
  context: PromptValidationContext = {}
): PromptValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const lower = prompt.toLowerCase();

  // Required sections.
  for (const section of REQUIRED_SECTIONS) {
    if (!prompt.includes(section.heading)) {
      errors.push(`Missing required section: ${section.label}.`);
    }
  }

  // Detected Issues section presence + content when findings exist.
  if (!prompt.includes("# Detected Issues")) {
    errors.push("Missing required section: Detected Issues.");
  } else if (context.hasFindings) {
    const body = sectionBody(prompt, "# Detected Issues");
    if (!body || !/evidence:/i.test(body)) {
      errors.push("Findings exist but no detected issues with evidence appear in the prompt.");
    }
  }

  // Self-check is part of the architecture (warn, not error, if missing).
  if (!prompt.includes("# Self-check")) {
    warnings.push("Self-check section is missing.");
  }

  // Style preservation correctness.
  const hasNoChangeRule = lower.includes("do not change the core visual style");
  const hasInspirationRule = lower.includes("layout inspiration only");

  if (context.designDirectionSelected === true) {
    if (!hasInspirationRule) {
      errors.push('Design direction selected but "layout inspiration only" rule is missing.');
    }
    if (!lower.includes("do not copy external assets")) {
      warnings.push('Design direction selected but "do not copy external assets" is missing.');
    }
  } else if (context.designDirectionSelected === false) {
    if (!hasNoChangeRule) {
      errors.push('No design direction selected but "do not change core visual style" rule is missing.');
    }
  } else if (!hasNoChangeRule && !hasInspirationRule) {
    warnings.push("No recognizable style-preservation rule found.");
  }

  // Generic redesign instructions when no design direction selected.
  if (context.designDirectionSelected !== true) {
    for (const phrase of REDESIGN_PHRASES) {
      if (lower.includes(phrase)) {
        errors.push(`Generic redesign instruction found: "${phrase}".`);
      }
    }
  }

  // Safety: no screenshot base64.
  if (/data:image\/[a-z]+;base64,/i.test(prompt) || /[A-Za-z0-9+/=]{400,}/.test(prompt)) {
    errors.push("Prompt appears to contain screenshot base64 / binary data.");
  }

  // Safety: no API keys.
  if (
    /AIza[0-9A-Za-z_\-]{20,}/.test(prompt) ||
    /sk-[A-Za-z0-9]{20,}/.test(prompt) ||
    /\b(api[_-]?key|access[_-]?token|secret)\b\s*[:=]\s*\S+/i.test(prompt)
  ) {
    errors.push("Prompt appears to contain an API key or secret.");
  }

  return { ok: errors.length === 0, warnings, errors };
}

// Returns the text under a `# Heading` up to the next `# ` heading.
function sectionBody(prompt: string, heading: string): string | null {
  const start = prompt.indexOf(heading);
  if (start < 0) return null;
  const after = start + heading.length;
  const next = prompt.indexOf("\n# ", after);
  return prompt.slice(after, next < 0 ? undefined : next);
}
