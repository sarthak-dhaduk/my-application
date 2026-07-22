import Constants from 'expo-constants';

export const getApiUrl = (path: string): string => {
  if (typeof window !== 'undefined') {
    return path;
  }
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:8081${path}`;
  }
  return `http://localhost:8081${path}`;
};
