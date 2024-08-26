import app from './app';
import mongoConnect from './utils/db';

const port = process.env.PORT || 3000;

(async () => {
  try {
    await mongoConnect();
    app.listen(3000, () => {
      console.log('Listening: http://localhost:3000');
    });
  } catch (error) {
    console.log('Server error', (error as Error).message);
  }
})();
