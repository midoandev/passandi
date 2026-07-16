import { PostHog } from "posthog-react-native";

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

let client: PostHog | null = null;

export const initAnalytics = () => {
  if (!apiKey) return;
  client = new PostHog(apiKey, { host });
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (!client) return;
  client.identify(userId, properties);
};

export const resetAnalytics = () => {
  if (!client) return;
  client.reset();
};

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (!client) return;
  client.capture(event, properties);
};

export const trackScreen = (screenName: string) => {
  trackEvent("$screen", { screen: screenName });
};
