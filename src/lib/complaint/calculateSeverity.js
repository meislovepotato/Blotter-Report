import {
  CATEGORY_BASE_SCORES,
  KEYWORD_GROUPS,
  SEVERITY_SCORE_TO_LABEL,
} from "@/constants";

export function calculateSeverity(category, message) {
  const base = CATEGORY_BASE_SCORES[category] || 3;
  const lowerMsg = message.toLowerCase();

  let totalWeight = 0;
  let totalScore = 0;

  const matchedKeywords = {
    critical: [],
    serious: [],
    trivial: [],
    misuse: [],
  };

  for (const [group, { keywords, weight }] of Object.entries(KEYWORD_GROUPS)) {
    const matched = new Set();
    for (const keyword of keywords) {
      if (lowerMsg.includes(keyword) && !matched.has(keyword)) {
        matched.add(keyword);
        matchedKeywords[group].push(keyword);
        totalScore += weight;
        totalWeight += 1;
      }
    }
  }

  const keywordAvg = totalWeight > 0 ? totalScore / totalWeight : 3.0;
  const adjustment = keywordAvg - 3.0;

  const finalScore = Math.max(1, Math.min(5, base + adjustment));
  const rounded = Math.floor(finalScore + 0.5);

  return {
    score: rounded,
    label: SEVERITY_SCORE_TO_LABEL[rounded],
    matchedKeywords,
  };
}
