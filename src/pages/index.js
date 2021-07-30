import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import React, { useState } from 'react';
import { object, mixed, number } from 'yup';

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default function Home() {
  return (
    <Card>
      <CardContent>
        <FormikStepper
          initialValues={{ firstName: '', lastName: '', millionaire: false, money: 0, description: '' }}
          onSubmit={async (values) => { await sleep(3000); console.log("value", values); }}>

          <FormikStep label="General info">
            <Box pb={2}>
              <Field fullWidth name="firstName" component={TextField} label="First Name" />
            </Box>
            <Box pb={2}>
              <Field fullWidth name="lastName" component={TextField} label="Last Name" />
            </Box>
            <Box pb={2}>
              <Field name="millionaire" type="checkbox" component={CheckboxWithLabel} Label={{ label: 'I am millionaire' }} />
            </Box>
          </FormikStep>

          <FormikStep label="Money In Pocket" validationSchema={object({ money: mixed().when('millionaire', { is: true, then: number().required().min(1000000, "Because you said you are a millionaire you need to have atleast 1 million"), otherwise: number().required() }) })}>
            <Box pb={2}>
              <Field fullWidth name="money" type="number" component={TextField} label="All the money I have" />
            </Box>
          </FormikStep>

          <FormikStep label="Final Step">
            <Box pb={2}>
              <Field fullWidth name="description" component={TextField} label="Description" />
            </Box>
          </FormikStep>

        </FormikStepper>
      </CardContent>
    </Card>
  );
}


export function FormikStep({ children }) {
  return <>{children}</>
}


export function FormikStepper({ children, ...props }) {

  const childrenArray = React.Children.toArray(children);
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik {...props} validationSchema={currentChild.props.validationSchema} onSubmit={async (values, helpers) => {
      if (isLastStep()) {
        await props.onSubmit(values, helpers);
        setCompleted(true);
      } else {
        setStep(currentStep => currentStep + 1);
      }
    }}>

      {({ isSubmitting }) => (
        <Form autoComplete="off">

          <Stepper alternativeLabel activeStep={step} >
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentChild}

          <Grid container spacing={2}>
            <Grid item>
              {step > 0 ? <Button disabled={isSubmitting} variant="contained" color="primary" onClick={() => setStep(currentStep => currentStep - 1)}>Back</Button> : null}
            </Grid>
            <Grid item>
              <Button startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null} disabled={isSubmitting} variant="contained" color="primary" type="submit">{isSubmitting ? "Submitting" : isLastStep() ? "Submit" : "Next"}</Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}