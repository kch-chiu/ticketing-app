import { app } from './app';

const start = () => {
  console.log("Starting............");

  app.listen(4000, () => console.log("Listening on port 4000!"));
};

start();
