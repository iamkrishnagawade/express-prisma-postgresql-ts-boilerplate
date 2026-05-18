import request from "supertest";
import app from "../app";

describe("Auth API", () => {
  it("should return 404", async () => {
    const res = await request(app).get("/wrong-route");
    expect(res.status).toBe(404);
  });

  it("should login user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "krishna@test.com",
      password: "123456",
    });
    expect(res.status).toBe(200);
  });
});
