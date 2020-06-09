///<reference path='./stripe-js/index.d.ts' />
///<reference path='./api/index.d.ts' />

declare module '@stripe/stripe-js' {
  const loadStripe: (
    publishableKey: string,
    options?: StripeConstructorOptions | undefined
  ) => Promise<Stripe | null>;
}

interface Window {
  // Stripe.js must be loaded directly from http://ec2-52-22-196-75.compute-1.amazonaws.com/v3, which
  // places a `Stripe` object on the window
  Stripe?: import('@stripe/stripe-js').StripeConstructor;
}
