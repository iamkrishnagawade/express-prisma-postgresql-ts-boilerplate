import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(
    `Server running on port: ${env.PORT} and Environment: ${env.NODE_ENV}`,
  );
});
