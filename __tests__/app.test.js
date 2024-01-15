const app = require("../app");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  it("makes a successful get request to the data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.status).toBe(200);
      });
  });
});
it("returns topics table with correct array length", () => {
  return request(app)
    .get("/api/topics")
    .then((response) => {
      const {
        body: { topics },
      } = response;
      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBe(3);
    });
});
it("returns correct keys in topics", () => {
  return request(app)
    .get("/api/topics")
    .then((response) => {
      const {
        body: { topics },
      } = response;
      topics.forEach((topic) => {
        expect(topic).toHaveProperty("slug");
        expect(topic).toHaveProperty("description");
      });
    });
});
