import request from "supertest";
import app from "../src/index.js"; // make sure app is exported!

let token = "";

describe("User Auth Tests", () => {
  const user = {
    name: "Test User",
    email: `test${Date.now()}@mail.com`,
    password: "123456",
  };

  it("should register user", async () => {
    const res = await request(app).post("/api/user/register").send(user);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should login user", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: user.email,
      password: user.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
});
