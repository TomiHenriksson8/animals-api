import app from './app';
import mongoConnect from './utils/db';

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

(async () => {
  try {
    await mongoConnect();
    app.listen(port, host, () => {
      console.log(`Server is listening at http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Server error:', (error as Error).message);
  }
})();
