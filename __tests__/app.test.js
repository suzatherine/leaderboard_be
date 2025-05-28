const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");

// require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Non-existant path", () => {
  test("404: path not found", () => {
    return request(app)
      .get("/notAPath")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Path not found");
      });
  });
});

describe("200 GET /teamnames", () => {
  test("200: returns all team names", () => {
    return request(app)
      .get("/teamnames")
      .then(({ body: { teamnames } }) => {
        expect(teamnames.length).toBeGreaterThan(0);
        teamnames.forEach((teamName) => {
          expect(teamName).toMatchObject({
            name: expect.any(String),
            used: expect.any(Boolean),
          });
        });
      });
  });
});

describe("201 POST /teams", () => {
  test("201: add a team to the list of teams, ", () => {
    return request(app)
      .post("/teams")
      .send({ id: 1 })
      .expect(201)
      .then(({ body }) => {
        console.log(body);
        // expect(addedTeam).toMatchObject({
        //   team_id: expect.any(Number),
        //   name_id: 1,
        //   score: 0,
        // });
      });
  });
  // todo("Can't post an existing teamname to the list of teams");
  // todo("teamname is marked as used");
});

// an endpoint which patches the score of a team

describe("GET /api", () => {
  test("200: should return healthcheck message", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Api connected successfully");
      });
  });
});
