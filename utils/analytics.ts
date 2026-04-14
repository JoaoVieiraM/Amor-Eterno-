/* eslint-disable @typescript-eslint/no-explicit-any */
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, params ?? {});
  }
};
