"use client";

import { PrimaryButton, SecondaryButton } from "@/components";

const FormNavigation = ({
  activeStep,
  setActiveStep,
  onNext,
  isSubmit = false,
}) => {
  const isLastStep = activeStep === 4;
  const isFirstStep = activeStep === 0;

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      if (!isLastStep) {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <div className="flex justify-between gap-4">
      <SecondaryButton
        onClick={handleBack}
        disabled={isFirstStep}
        type="button"
        isForm
      >
        Back
      </SecondaryButton>
      <PrimaryButton
        className="w-full"
        type={isSubmit ? "submit" : "button"}
        onClick={isSubmit ? undefined : handleNext}
        isForm
      >
        {isLastStep ? "Submit" : "Next"}
      </PrimaryButton>
    </div>
  );
};

export default FormNavigation;
