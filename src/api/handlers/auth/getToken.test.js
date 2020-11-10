import sinon from "sinon";
import request from "supertest";
import express from "express";
import bodyParser from "body-parser";

import * as users from "../../../models/users";
import api from "../../../api";
import config from "../../../config";

config.jwtConfig.jwtSecret = "secret";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", api({ config }));

describe("POST /api/auth", function () {
  before(() => {
    sinon.stub(users, "getUserByEmail").callsFake((email) => {
      if (email === "one@test.com") {
        return {
          email,
          password:
            "d5347c6181685d22bd931418ad6489fe52d3680b306dcaa1ef3597abcc861a13d2f8497ae99bcac5095e8321a1f35f18644eecabdedbdb9e048c7bf5e0f56b0c",
          salt: "36ad01638722f7de9075dfe547065937",
        };
      }
      return undefined;
    });
    sinon.useFakeTimers({
      now: 1483228800000,
    });
  });

  it("should return token on correct user", function (done) {
    request(app)
      .post("/api/auth")
      .send({ email: "one@test.com", password: "sanctuary" })
      .expect(
        200,
        {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJvbmVAdGVzdC5jb20iLCJpYXQiOjE0ODMyMjg4MDAsImV4cCI6MTQ4MzI3MjAwMH0.hQsT0M7hfzh1fj8-ZOEbuuFslRvkpa-1AMyXMnBuAVw",
        },
        done
      );
  });

  it("should fail on unknown user", function (done) {
    request(app)
      .post("/api/auth")
      .send({ email: "two@test.com", password: "sanctuary" })
      .expect(401, done);
  });

  it("should fail on wrong password", function (done) {
    request(app)
      .post("/api/auth")
      .send({ email: "one@test.com", password: "wrong password" })
      .expect(401, done);
  });

  after(() => {
    sinon.restore();
  });
});
