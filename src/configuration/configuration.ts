export const configuration = () => ({
  nodeEnv: process.env.NODE_ENV,
  server: {
    port: Number(process.env.PORT),
  },
  front: {
    url: process.env.FRONT_URL,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },
  openai: {
    apiKey: process.env.OPEN_API_KEY,
  },
});
