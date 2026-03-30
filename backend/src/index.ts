import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Pindows 98 Backend")
  .listen(3000);

console.log(`Pindows 98 backend running at ${app.server?.hostname}:${app.server?.port}`);
