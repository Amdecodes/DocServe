import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center space-x-4 overflow-x-auto no-scrollbar",
        className,
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : isCurrent
                    ? "border-primary text-primary"
                    : "border-muted-foreground text-muted-foreground",
              )}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span
              className={cn(
                "ml-2 text-sm font-medium",
                isCompleted || isCurrent
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className="mx-4 h-0.5 w-8 bg-border" />
            )}
          </div>
        );
      })}
    </div>
  );
}
