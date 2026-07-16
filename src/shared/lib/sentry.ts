import * as Sentry from "@sentry/react-native";

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

export const initSentry = () => {
  if (!dsn || dsn.includes("examplePublicKey")) return;

  Sentry.init({
    dsn,
    tracesSampleRate: 0.2, // 20% of transactions for performance
    debug: false,
    enabled: !__DEV__,
  });
};

export const logError = (error: Error, context?: Record<string, any>) => {
  if (__DEV__) {
    console.error(error);
    return;
  }
  Sentry.withScope((scope) => {
    if (context) scope.setExtras(context);
    Sentry.captureException(error);
  });
};

export const setUser = (userId: string, email?: string) => {
  if (__DEV__) return;
  Sentry.setUser({ id: userId, email });
};

export const clearUser = () => {
  if (__DEV__) return;
  Sentry.setUser(null);
};
