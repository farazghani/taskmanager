import request from "supertest";
import app from "../src/index.js";

let token = "";
let taskId = "";

beforeAll(async () => {
    const uniqueEmail = `test${Date.now()}@mail.com`;
  
  const register = await request(app)
    .post("/api/user/register")
    .send({
      name: "Test User",
      email: uniqueEmail,
      password: "123456"
    });

  token = register.body.token;
});


describe("Task CRUD Tests", () => {
  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/task")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        priority: "medium",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.task).toBeDefined();
    taskId = res.body.task._id;
  });

  it("should get user tasks", async () => {
    const res = await request(app)
      .get("/api/task")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  it("should update task", async () => {
    const res = await request(app)
      .put(`/api/task/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "done" });

    expect(res.statusCode).toBe(200);
    expect(res.body.task.status).toBe("done");
  });

  it("should delete task", async () => {
    const res = await request(app)
      .delete(`/api/task/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
