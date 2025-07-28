"use client";

import React, {
  useState,
  Children,
  useRef,
  useLayoutEffect,
  HTMLAttributes,
  ReactNode,
} from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader } from "./card";

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  activeStep: number;
  onStepClick: (step: number) => void;
  onNextClick: () => void;
  onPrevClick: () => void;
  onFinalStepCompleted: () => void;
  finalStepButtonText?: string;
  stepCircleContainerClassName?: string;
  stepContainerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
}

export function Stepper({
  children,
  activeStep,
  onStepClick,
  onNextClick,
  onPrevClick,
  onFinalStepCompleted,
  finalStepButtonText = "Complete",
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  ...rest
}: Readonly<StepperProps>) {
  const [direction, setDirection] = useState<number>(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isLastStep = activeStep === totalSteps - 1;

  const handleStepClick = (clickedStepIndex: number) => {
    setDirection(clickedStepIndex > activeStep ? 1 : -1);
    onStepClick(clickedStepIndex);
  };

  const handleBack = () => {
    setDirection(-1);
    onPrevClick();
  };

  const handleNext = () => {
    setDirection(1);
    onNextClick();
  };

  return (
    <div {...rest}>
      <Card className={`mx-auto w-full ${stepCircleContainerClassName}`}>
        <CardHeader className={`${stepContainerClassName} flex w-full items-center`}>
          {stepsArray.map((_, index) => {
            const isNotLast = index < totalSteps - 1;
            return (
              <React.Fragment key={index}>
                <StepIndicator
                  step={index}
                  currentStep={activeStep}
                  disableStepIndicators={disableStepIndicators}
                  onClickStep={handleStepClick}
                />
                {isNotLast && <StepConnector isComplete={activeStep > index} />}
              </React.Fragment>
            );
          })}
        </CardHeader>

        <CardContent className={`px-8 ${contentClassName}`}>
          <StepContentWrapper currentStep={activeStep} direction={direction} className="space-y-2">
            {stepsArray[activeStep]}
          </StepContentWrapper>
        </CardContent>

        <CardFooter className={`flex flex-col px-8 ${footerClassName}`}>
          <div
            className={`mt-10 flex w-full ${activeStep !== 0 ? "justify-between" : "justify-end"}`}
          >
            {activeStep !== 0 && (
              <Button variant="secondary" onClick={handleBack} {...backButtonProps}>
                {backButtonText}
              </Button>
            )}
            <Button onClick={isLastStep ? onFinalStepCompleted : handleNext} {...nextButtonProps}>
              {isLastStep ? finalStepButtonText : nextButtonText}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

interface StepContentWrapperProps {
  currentStep: number;
  direction: number;
  children: ReactNode;
  className?: string;
}

function StepContentWrapper({
  currentStep,
  direction,
  children,
  className = "",
}: Readonly<StepContentWrapperProps>) {
  const [parentHeight, setParentHeight] = useState<number | "auto">("auto");

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <SlideTransition
          key={currentStep}
          direction={direction}
          onHeightReady={(h) => setParentHeight(h)}
        >
          {children}
        </SlideTransition>
      </AnimatePresence>
    </motion.div>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (height: number) => void;
}

function SlideTransition({ children, direction, onHeightReady }: Readonly<SlideTransitionProps>) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      onHeightReady(containerRef.current.offsetHeight);
    }
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", width: "100%" }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

export function Step({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (clicked: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators = false,
}: Readonly<StepIndicatorProps>) {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";

  const handleClick = () => {
    if (step < currentStep && !disableStepIndicators) {
      onClickStep(step);
    }
  };

  return (
    <motion.div onClick={handleClick} className="relative cursor-pointer" animate={status}>
      <motion.div
        variants={{
          inactive: { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" },
          active: { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" },
          complete: { backgroundColor: "var(--primary)", color: "var(--primary-foreground)" },
        }}
        transition={{ duration: 0.3 }}
        className="flex h-8 w-8 items-center justify-center rounded-full font-semibold"
      >
        {status === "complete" ? <CheckIcon className="h-4 w-4" /> : step + 1}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="h-0.5 flex-1 bg-border">
      <motion.div
        className="h-full bg-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isComplete ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}

function CheckIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
