import { useEffect, useState } from "react";
import { Wizard, Steps, Step } from "react-albus";
import { css, StyleSheet } from "aphrodite";
import { every, find, get, isEmpty, last } from "lodash";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const animationSS = StyleSheet.create({
  enter: {
    opacity: 0.01,
  },
  enterActive: {
    opacity: 1,
    transition: "opacity 200ms ease-in",
  },
  exit: {
    opacity: 1,
  },
  exitActive: {
    opacity: 0.01,
    transition: "opacity 200ms ease-in",
  },
});

/* ======= Functions ======= */

/**
 * Checks if a step should be skipped based on conditions and an optional conditions handler
 * from the step config.
 * Conditions should be formatted as an array of arrays, with each array element having
 * the trigger field path first and the trigger value second.
 * Optional conditions handler should take a values object and
 * execute a custom method to determine whether to skip the step or not
 * Example conditions: [["field", "value"]] or [["field.nestedField", "value"]]
 *    [["field1", "value1"], [["field2", "value2"]]
 * @param {string} stepId - The string identifier of the step in question
 * @param {Object} stepConfig - Step configuration object
 * @param {Object} values - All values for the wizard subject
 * @returns {boolean}
 */
const shouldSkipStep = ({ step, stepConfig, values }) => {
  const { conditions, conditionsHandler } = stepConfig[step.id];

  if (conditionsHandler) {
    return !conditionsHandler(values);
  }
  if (conditions) {
    return !every(conditions, (condition) => {
      const [triggerFieldPath, triggerValue] = condition;
      return get(values, triggerFieldPath) === triggerValue;
    });
  }
  return false;
};

/**
 * Creates a props object to be passed to the ProgressBar component.
 * Gets a count of all completed non-conditional questions + a total count of
 * all non-conditional questions in the form.
 * @param {Object} stepConfig - Step configuration object
 * @param {Array} steps - An ordered array of step objects
 * @param {Object} values - All values for the wizard subject
 * @returns {number}
 */
const getProgressBarProps = ({ stepConfig, steps, values }) => {
  const props = {
    stepsCompleted: 0,
    totalSteps: 0,
  };

  steps.forEach((step) => {
    const { conditions, conditionsHandler, fields, isComplete } =
      stepConfig[step.id];

    if (!conditions && !conditionsHandler) {
      props.totalSteps += 1;
      const stepIsIncomplete = isComplete
        ? !isComplete(values)
        : find(fields, (fieldPath) => {
            const value = get(values, fieldPath);
            if (value === false) {
              return false;
            }
            return !value;
          });
      if (!stepIsIncomplete) {
        props.stepsCompleted += 1;
      }
    }
  });
  return props;
};

/**
 * Handles the action after clicking next to advance.
 * It gets called after the mutation takes place.
 * Default behavior is to navigate to the next step.
 * If there is no next step, the onComplete function is called.
 * If shouldSkipStep returns true for the next step, the function gets called
 * again recursively until there is no next step or the next step should not be skipped.
 * Call an onStepChange function if passed as a prop with currentStep and nextStep as arguments.
 * @param {string} nextStep - The string identifier of the next step
 * @param {Function} onComplete Function that gets called when advancing past the final step
 * @param {Object} options Options for handling the update callback. Includes customCallback
 *  function that can be called instead of navigating to the next step.
 * @param {Function} push Receives a step ID (string) and navigates to that step
 * @param {Object} stepConfig - Step configuration object
 * @param {Array} steps - An ordered array of step objects
 * @param {Object} subject - The main entity of the wizard, ex: project, company
 */
const handleUpdateCallback = async (args) => {
  const {
    navigate,
    nextStep,
    onComplete,
    onStepChange,
    options,
    push,
    setProgressData,
    step: currentStep,
    stepConfig,
    steps,
    subject,
  } = args;
  const { customCallback } = options || {};

  if (!nextStep) {
    onComplete();
  } else if (shouldSkipStep({ stepConfig, step: nextStep, values: subject })) {
    handleUpdateCallback({
      ...args,
      nextStep: steps[nextStep.index + 1],
      step: currentStep,
    });
  } else {
    if (onStepChange) {
      onStepChange(currentStep, nextStep);
    }

    if (customCallback) {
      const { redirect } = await customCallback(args);

      if (redirect) {
        navigate(redirect);
        return;
      }
    }

    if (setProgressData) {
      setProgressData(
        getProgressBarProps({ stepConfig, steps, values: subject })
      );
    }
    window.location.hash = nextStep.hashKey;
    push(nextStep.id);
  }
};

/**
 * Checks if the values on a particular step have changed before calling the mutation.
 * @param {Object} currentValues - Current values of the wizard subject
 * @param {Array} fields - A list of fields included in the current step
 * @param {Boolean} isLastCompletedStep - is the current step the furthest completed
 *  step in the form
 * @param {Object} newValues - Object containing new values being submitted currently
 */
const shouldMutate = ({
  currentValues,
  fields,
  isLastCompletedStep,
  newValues,
}) => {
  if (isLastCompletedStep) {
    return true;
  }
  if (isEmpty(newValues)) {
    return false;
  }
  return !!find(fields, (fieldPath) => {
    const currentValue = get(currentValues, fieldPath);
    const nextValue = get(newValues, fieldPath);
    if (currentValue !== nextValue) {
      return true;
    }
    return false;
  });
};

/**
 * Determines if the current step being mutated should be set as the last completed step.
 * @param {Object} currentStep - Object representing the current step
 * @param {String} lastCompletedStep - Name of the last step that was completed furthest
 *  in the order of all of the steps.
 * @param {Array} steps - An ordered array of step objects
 */
const shouldSetLastCompletedStep = ({
  currentStep,
  lastCompletedStep,
  steps,
}) => {
  if (currentStep.id === lastCompletedStep) {
    return false;
  }
  const currentLastCompletedStep = find(
    steps,
    (step) => step.id === lastCompletedStep
  );
  // Returns true if no steps have been completed or if the found step is
  // earlier than the current step
  if (
    !currentLastCompletedStep ||
    currentLastCompletedStep.index < currentStep.index
  ) {
    return true;
  }
  return false;
};

/**
 * If data has changed, the update mutation is called. Calls handleUpdateCallback
 * when updating is complete.
 * @param {Object} currentStep - Object representing the current step
 * @param {Function} onComplete Function that gets called when advancing past the final step
 * @param {Function} push Receives a step ID (string) and navigates to that step
 * @param {Object} stepConfig - Step configuration object
 * @param {Array} steps - An ordered array of step objects
 * @param {Object} subject - The main entity of the wizard, ex: project, company
 * @param {Function} update - The mutation that updates "subject"
 */
const handleUpdate = (args) => {
  const {
    step: currentStep,
    stepConfig,
    steps,
    subject,
    values,
    onUpdate,
  } = args;
  const nextStep = steps[currentStep.index + 1];
  const { fields: currentStepFields, update } = stepConfig[currentStep.id];
  const isLastCompletedStep = shouldSetLastCompletedStep({
    currentStep,
    lastCompletedStep: subject.lastCompletedStep,
    steps,
  });
  if (
    shouldMutate({
      currentValues: subject,
      fields: currentStepFields,
      isLastCompletedStep,
      newValues: values,
    })
  ) {
    if (isLastCompletedStep) {
      values.lastCompletedStep = currentStep.id;
    }
    update(values, subject.id, onUpdate);
    handleUpdateCallback({
      ...args,
      nextStep,
      subject,
    });
  } else {
    handleUpdateCallback({ ...args, nextStep });
  }
};

/**
 * Gets called when clicking the "back" CTA.
 * Default behavior is to navigate back one step.
 * If there is no previous step, the onClickBackFirstStep function is called.
 * If the previous step should be skipped, the function gets called again
 * recursively until it gets to a step that should not be skipped.
 * Call an onStepChange function if passed as a prop with currentStep and nextStep as arguments.
 * @param {Object} currentStep - Object representing the current step
 * @param {Function} onClickBackFirstStep Function that gets called
 *  when advancing before the first step
 * @param {Function} push Receives a step ID (string) and navigates to that step
 * @param {Object} stepConfig - Step configuration object
 * @param {Array} steps - An ordered array of step objects
 * @param {Object} values - All values for the wizard subject
 */
const handleBack = (args) => {
  const {
    step: currentStep,
    onClickBackFirstStep,
    onStepChange,
    push,
    stepConfig,
    steps,
    values,
  } = args;
  const previousStep = steps[currentStep.index - 1];

  if (!previousStep) {
    onClickBackFirstStep();
  } else if (shouldSkipStep({ stepConfig, step: previousStep, values })) {
    handleBack({ ...args, step: previousStep });
  } else {
    if (onStepChange) {
      onStepChange(currentStep, previousStep);
    }
    window.location.hash = previousStep.hashKey;
    push(steps[previousStep.index].id);
  }
};

const handleSkip = (args) => {
  const {
    step: currentStep,
    onStepChange,
    push,
    stepConfig,
    steps,
    values,
    onComplete,
    setProgressData,
  } = args;
  const nextStep = steps[currentStep.index + 1];

  if (!nextStep) {
    onComplete();
  } else if (shouldSkipStep({ stepConfig, step: nextStep, values })) {
    handleSkip({
      ...args,
      step: nextStep,
    });
  } else {
    if (onStepChange) {
      onStepChange(currentStep, nextStep);
    }
    if (setProgressData) {
      setProgressData(getProgressBarProps({ stepConfig, steps, values }));
    }
    window.location.hash = nextStep.hashKey;
    push(nextStep.id);
  }
};

/**
 * Finds the first incomplete step in the form.
 * Only considers steps where shouldSkipStep is false.
 * Returns undefined if all steps are complete.
 * Handles steps containing multiple fields.
 * @param {Object} stepConfig - Step configuration object
 * @param {Array} steps - An ordered array of step objects
 * @param {Object} values - All values for the wizard subject
 * @returns {number}
 */
const findFirstBlankStep = ({ stepConfig, steps, values }) =>
  find(steps, (step) => {
    if (!shouldSkipStep({ stepConfig, step, values })) {
      const { fields, isComplete } = stepConfig[step.id];
      // Checks if any fields for "step" are blank
      return isComplete
        ? !isComplete(values)
        : find(fields, (fieldPath) => {
            const value = get(values, fieldPath);
            if (value === false) {
              return false;
            }
            return !value;
          });
    }
    return false;
  });

/**
 * Creates a mapping of hash keys (#hash-key) to step objects.
 * @param {Array} steps - An ordered array of step objects
 * @returns {Object}
 */
const locationHashKeysToSteps = (steps) => {
  const result = {};
  steps.forEach((step) => {
    const { hashKey } = step;

    result[`#${hashKey}`] = step;
  });
  return result;
};

/**
 * Sets the initial step when a user loads the wizard form.
 * If no hash key is appended to the URL, the initial step will be the first
 * incomplete step in the form.
 * If a hash key is provided and exists in the result of locationHashKeysToSteps:
 *  - Navigates to the requested step if it is the first incomplete step
 *    or has already been completed.
 *  - Navigates to the first incomplete step if the requested step happens after
 *    the first incomplete step.
 * @param {Function} onSetInitialStep - Optional function that runs after the
 *  initial step is set and receives the initial step object as an argument
 * @param {Function} replace - Clears the wizard's history and adds the passed in step
 *  as the first entry
 * @param {Object} stepConfig - Step configuration object
 * @param {Array} steps - An ordered array of step objects
 * @param {Object} values - All values for the wizard subject
 */
const setInitialStep = ({
  allowIncompleteInitialStep,
  onSetInitialStep,
  replace,
  stepConfig,
  steps,
  values,
}) => {
  const firstBlankStep = findFirstBlankStep({
    stepConfig,
    steps,
    values,
  });
  let initialStep;

  if (window.location.hash) {
    const hashKeyMapping = locationHashKeysToSteps(steps);
    const requestedStep = hashKeyMapping[window.location.hash];
    if (requestedStep) {
      const formIsComplete = !firstBlankStep;

      if (
        formIsComplete ||
        allowIncompleteInitialStep ||
        requestedStep.index <= firstBlankStep.index
      ) {
        initialStep = requestedStep;
      } else {
        initialStep = firstBlankStep;
      }
    } else {
      // Clears the hash key if the requested step doesn't exist
      window.location.hash = "";
      if (firstBlankStep) {
        initialStep = firstBlankStep;
      }
    }
  } else if (firstBlankStep) {
    initialStep = firstBlankStep;
  } else {
    // If they are targeting the journey endpoint without a hash and no
    // blank steps (form is complete), then go to the last step.
    initialStep = last(steps);
  }

  if (onSetInitialStep) {
    onSetInitialStep(initialStep);
  }
  window.location.hash = initialStep.hashKey;
  replace(initialStep.id);
};

/* ======= Components ======= */

const WizardContent = (props) => {
  const {
    allowIncompleteInitialStep,
    bodyAphStyle,
    onSetInitialStep,
    onStepChange,
    push,
    replace,
    onUpdate,
    setProgressData,
    setReplaceStep,
    step: currentStep,
    stepConfig,
    steps,
    stepList,
    subject,
    shouldAllowBackFromFirstStep,
    useTransitions,
    refetchSubject,
  } = props;

  const [handleSubmit, setHandleSubmit] = useState(null);
  const currentStepConfig = stepConfig[currentStep.id];
  const { hasSkipOption, preventNavigateBack } = currentStepConfig || {};
  const shouldHideBack =
    (currentStep.index === 0 && !shouldAllowBackFromFirstStep) ||
    preventNavigateBack;
  const isLastStep = currentStep.index === steps.length - 1;
  const shouldShowSkip = hasSkipOption
    ? currentStepConfig.hasSkipOption(subject)
    : false;

  useEffect(() => {
    if (steps && steps.length) {
      setInitialStep({
        allowIncompleteInitialStep,
        onSetInitialStep,
        replace,
        stepConfig,
        steps,
        values: subject,
      });
    }
    if (setProgressData) {
      setProgressData(
        getProgressBarProps({ stepConfig, steps, values: subject })
      );
    }
  }, [steps.length]);

  useEffect(() => {
    if (setReplaceStep) {
      setReplaceStep(() => (previousStep, nextStep) => {
        replace(nextStep.id);
        onStepChange(previousStep, nextStep);
      });
    }
  }, []);

  const footerProps = {
    currentStep,
    handleBack: () =>
      handleBack({
        ...props,
        step: currentStep,
        values: subject,
      }),
    handleSkip: () =>
      handleSkip({
        ...props,
        step: currentStep,
        setProgressData,
        values: subject,
      }),
    handleSubmit,
    isLastStep,
    onStepChange,
    push,
    shouldHideBack,
    shouldShowSkip,
    subject,
    stepConfig,
    stepList,
  };

  if (useTransitions) {
    return (
      <div className={css(bodyAphStyle)} style={{ position: "relative" }}>
        <TransitionGroup>
          <CSSTransition
            key={currentStep.id}
            timeout={{ enter: 500, exit: 500 }}
            classNames={{
              enter: css(animationSS.enter),
              enterActive: css(animationSS.enterActive),
              exit: css(animationSS.exit),
              exitActive: css(animationSS.exitActive),
            }}
          >
            <div style={{ position: "absolute", left: 0, right: 0 }}>
              <Steps key={currentStep.id} step={currentStep}>
                {stepList.map((step, idx) => {
                  const {
                    component: StepComponent,
                    hashKey,
                    stepName,
                    update,
                  } = stepConfig[step];

                  return (
                    <Step
                      hashKey={hashKey}
                      id={step}
                      index={idx}
                      key={step}
                      stepName={stepName}
                      update={update}
                    >
                      <StepComponent
                        footerProps={footerProps}
                        isActive={currentStep.id === step}
                        onStepChange={(nextStep) =>
                          onStepChange(currentStep, nextStep)
                        }
                        push={push}
                        refetchSubject={refetchSubject}
                        setHandleSubmit={setHandleSubmit}
                        onUpdate={onUpdate}
                        subject={subject}
                        stepConfig={stepConfig}
                        stepList={stepList}
                        update={(values, options = {}) =>
                          handleUpdate({
                            ...props,
                            options,
                            setProgressData,
                            values,
                            onUpdate,
                          })
                        }
                      />
                    </Step>
                  );
                })}
              </Steps>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }

  return (
    <div className={css(bodyAphStyle)}>
      <Steps key={currentStep.id} step={currentStep}>
        {stepList.map((step, idx) => {
          const {
            component: StepComponent,
            hashKey,
            stepName,
            update,
          } = stepConfig[step];

          return (
            <Step
              hashKey={hashKey}
              id={step}
              index={idx}
              key={step}
              stepName={stepName}
              update={update}
            >
              <StepComponent
                footerProps={footerProps}
                isActive={currentStep.id === step}
                onStepChange={(nextStep) => onStepChange(currentStep, nextStep)}
                push={push}
                refetchSubject={refetchSubject}
                setHandleSubmit={setHandleSubmit}
                onUpdate={onUpdate}
                subject={subject}
                stepConfig={stepConfig}
                stepList={stepList}
                update={(values, options = {}) =>
                  handleUpdate({
                    ...props,
                    options,
                    setProgressData,
                    values,
                    onUpdate,
                  })
                }
              />
            </Step>
          );
        })}
      </Steps>
    </div>
  );
};

const AlbusWizard = (props) => (
  <Wizard
    render={(wizardProps) => <WizardContent {...props} {...wizardProps} />}
  />
);

AlbusWizard.defaultProps = {
  allowIncompleteInitialStep: false,
  shouldAllowBackFromFirstStep: true,
};

export default AlbusWizard;
