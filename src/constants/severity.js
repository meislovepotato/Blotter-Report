export const CATEGORY_BASE_SCORES = {
  ACCIDENT: 4,
  ANIMAL_COMPLAINT: 2,
  ASSAULT: 5,
  DISORDERLY_CONDUCT: 2,
  DISTURBANCE_OF_PEACE: 2,
  DOMESTIC_VIOLENCE: 5,
  DRUG_RELATED: 3,
  FIRE: 5,
  FRAUD: 2,
  HARASSMENT: 3,
  ILLEGAL_STRUCTURE: 2,
  LOST_AND_FOUND: 1,
  MISSING_PERSON: 4,
  NOISE_COMPLAINT: 2,
  VANDALISM: 3,
  PUBLIC_DISTURBANCE: 2,
  SUSPICIOUS_ACTIVITY: 3,
  THEFT: 3,
  THEFT_OR_BURGLARY: 3,
  TRAFFIC_INCIDENT: 4,
  TRESPASSING: 2,
  VIOLATION_OF_ORDINANCE: 2,
  WEAPONS_OFFENSE: 5,
  OTHER: 1,
  PROPERTY_DAMAGE: 3,
};

export const SEVERITY_SCORE_TO_LABEL = {
  5: "EMERGENCY",
  4: "URGENT",
  3: "MODERATE",
  2: "MINOR",
  1: "INFORMATIONAL",
};

export const SEVERITY_COLOR_MAP = {
  5: "bg-[#fdf3f3]", // EMERGENCY
  4: "bg-[#fff8f0]", // URGENT
  3: "bg-[#fffcf2]", // MODERATE
  2: "bg-[#f6fdf8]", // MINOR
  1: "bg-[#fafafa]", // INFORMATIONAL
};

export const SEVERITY_HOVER_MAP = {
  5: "hover:bg-[#faeaea]",
  4: "hover:bg-[#fff2e2]",
  3: "hover:bg-[#fff9d5]",
  2: "hover:bg-[#eafbef]",
  1: "hover:bg-[#f0f0f0]",
};
