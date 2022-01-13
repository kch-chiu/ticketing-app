import { app } from './app';

const start = () => {
  console.log("Starting............");

  app.listen(5000, () => console.log("Listening on port 5000!"));
};

start();
