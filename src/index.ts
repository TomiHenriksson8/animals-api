import app from './app';
import mongoConnect from './utils/db';

const port = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await mongoConnect();
    app.listen(port, '0.0.0.0', () => {
      console.log(`Listening: http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.log('Server error', (error as Error).message);
  }
})();
