"use client";

import { BLOTTER_CATEGORIES } from "@/constants";
import dayjs from "dayjs";

const ReviewRow = ({ label, value }) => {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2 w-full">
      <div className="w-32 text-xs text-text font-bold text-right sm:w-42 sm:text-sm">
        {label}:
      </div>
      <div className="flex-1 whitespace-pre-wrap text-xs text-text sm:text-sm">
        {value}
      </div>
    </div>
  );
};

const Review = ({ formData }) => {
  return (
    <div className="flex flex-col gap-4  flex-1 h-full overflow-y-auto">
      <h3 className="text-sm tracking-tight text-text font-medium">
        Review your details <span className="text-accent">before</span>{" "}
        submitting
      </h3>
      <hr className="text-text/25" />
      <div className="flex flex-col gap-2">
        <ReviewRow
          label="Full Name"
          value={`${formData.complainantLastName}, ${formData.complainantFirstName} ${formData.complainantMiddleName}`}
        />
        <ReviewRow label="Address" value={formData.fullAddress} />
        <ReviewRow label="Mobile Number" value={formData.phoneNumber} />
        <ReviewRow
          label="Category"
          value={BLOTTER_CATEGORIES[formData.category]}
        />
        <ReviewRow label="Subject Name" value={formData.subjectName} />
        <ReviewRow label="Subject Context" value={formData.subjectContext} />
        <ReviewRow label="Incident Description" value={formData.description} />
        <ReviewRow
          label="Incident Date / Time"
          value={dayjs(formData.incidentDateTime).format(
            "MMMM DD, YYYY hh:mm A"
          )}
        />
      </div>
    </div>
  );
};

export default Review;
