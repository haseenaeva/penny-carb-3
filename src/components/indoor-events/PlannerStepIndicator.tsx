import React from 'react';
import { cn } from '@/lib/utils';

interface PlannerStepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

const PlannerStepIndicator: React.FC<PlannerStepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="sticky top-14 z-40 bg-background border-b py-3">
      <div className="container px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <button
                onClick={() => index < currentStep && onStepClick(index)}
                disabled={index > currentStep}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  index === currentStep
                    ? "bg-indoor-events text-white"
                    : index < currentStep
                    ? "bg-indoor-events/20 text-indoor-events cursor-pointer hover:bg-indoor-events/30"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <span className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  index === currentStep
                    ? "bg-white/20"
                    : index < currentStep
                    ? "bg-indoor-events/30"
                    : "bg-muted-foreground/20"
                )}>
                  {index + 1}
                </span>
                <span className="hidden sm:inline">{step}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={cn(
                  "h-0.5 w-4 rounded-full",
                  index < currentStep ? "bg-indoor-events/40" : "bg-muted"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlannerStepIndicator;
