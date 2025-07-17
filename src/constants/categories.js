export const BLOTTER_CATEGORIES = {
  NOISE_COMPLAINT: "Noise Complaint",
  THEFT_OR_BURGLARY: "Theft or Burglary",
  TRESPASSING: "Trespassing",
  DISTURBANCE_OF_PEACE: "Disturbance of Peace",
  ASSAULT: "Assault",
  TRAFFIC_INCIDENT: "Traffic Incident",
  DISORDERLY_CONDUCT: "Disorderly Conduct",
  PROPERTY_DAMAGE: "Property Damage/Vandalism",
  SUSPICIOUS_ACTIVITY: "Suspicious Activity",
  DOMESTIC_VIOLENCE: "Domestic Violence",
};

export const CATEGORY_COLORS = {
  NOISE_COMPLAINT: "bg-blue-100 text-blue-800",
  THEFT_OR_BURGLARY: "bg-red-100 text-red-800",
  TRESPASSING: "bg-yellow-100 text-yellow-800",
  DISTURBANCE_OF_PEACE: "bg-purple-100 text-purple-800",
  ASSAULT: "bg-rose-100 text-rose-800",
  TRAFFIC_INCIDENT: "bg-orange-100 text-orange-800",
  DISORDERLY_CONDUCT: "bg-amber-100 text-amber-800",
  PROPERTY_DAMAGE: "bg-gray-100 text-gray-800",
  SUSPICIOUS_ACTIVITY: "bg-pink-100 text-pink-800",
  DOMESTIC_VIOLENCE: "bg-indigo-100 text-indigo-800",
};

export const BLOTTER_CATEGORY_OPTIONS = Object.entries(BLOTTER_CATEGORIES).map(
  ([value, label]) => ({ value, label })
);
