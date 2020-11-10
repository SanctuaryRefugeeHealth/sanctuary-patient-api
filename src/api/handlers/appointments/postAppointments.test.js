import sinon from "sinon";
import request from "supertest";
import express from "express";
import bodyParser from "body-parser";

import * as appointments from "../../../models/appointments";
import * as sendReminders from "./sendReminders";
import api from "../../../api";
import config from "../../../config";

config.jwtConfig.jwtSecret = "secret";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", api({ config }));

describe("POST /appointments", () => {
  before(() => {
    sinon.stub(appointments, "createAppointment").callsFake(() => {
      return [1];
    });

    sinon.stub(sendReminders, "sendReminder").callsFake(() => {
      return;
    });
  });

  it("should succeed on valid appointment", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(200, done);
  });

  it("should succeed without description", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        specialNotes: "This is a special note",
      })
      .expect(200, done);
  });

  it("should fail on empty description", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "",
        specialNotes: "This is a special note",
      })
      .expect(500,{message: '"description" is not allowed to be empty'}, done);
  });


  it("should fail on whitespace only description", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "     ",
        specialNotes: "This is a special note",
      })
      .expect(500,{message: '"description" is not allowed to be empty'}, done);
  });

  it("should succeed without special notes", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
      })
      .expect(200, done);
  });

  it("should fail on empty special notes", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "",
      })
      .expect(500, {message: '"specialNotes" is not allowed to be empty'}, done);
  });

  it("should fail on whitespace only special notes", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "     ",
      })
      .expect(500, {message: '"specialNotes" is not allowed to be empty'}, done);
  });

  it("should fail on empty date", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(500, { message: '"date" must be a valid date' }, done);
  });

  it("should fail on whitespace only date", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "     ",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(500, { message: '"date" must be a valid date' }, done);
  });

  it("should fail on bad date", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-13-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(500, { message: '"date" must be a valid date' }, done);
  });

  it("should fail on missing date", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(500, { message: '"date" is required' }, done);
  });

  it("should fail on empty address", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(
        500,
        { message: '"practitionerAddress" is not allowed to be empty' },
        done
      );
  });

  it("should fail on whitespace only address", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "     ",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(
        500,
        { message: '"practitionerAddress" is not allowed to be empty' },
        done
      );
  });

  it("should fail on missing address", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(500, { message: '"practitionerAddress" is required' }, done);
  });

  it("should fail on empty language", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(
        500,
        { message: '"patientLanguage" is not allowed to be empty' },
        done
      );
  });

  it("should fail on whitespace only language", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "     ",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(
        500,
        { message: '"patientLanguage" is not allowed to be empty' },
        done
      );
  });

  it("should fail on missing language", (done) => {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientName: "John Smith",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(500, { message: '"patientLanguage" is required' }, done);
  });

  it("should fail on empty name", function (done) {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(
        500,
        { message: '"patientName" is not allowed to be empty' },
        done
      );
  });

  it("should fail on whitespace only name", function (done) {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "     ",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(
        500,
        { message: '"patientName" is not allowed to be empty' },
        done
      );
  });

  it("should fail on missing name", function (done) {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientPhoneNumber: "5555555555",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(500, { message: '"patientName" is required' }, done);
  });

  it("should fail on empty phone number", function (done) {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(
        500,
        { message: '"patientPhoneNumber" is not allowed to be empty' },
        done
      );
  });

  it("should fail on whitespace only phone number", function (done) {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        patientPhoneNumber: "     ",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(
        500,
        { message: '"patientPhoneNumber" is not allowed to be empty' },
        done
      );
  });

  it("should fail on missing phone number", function (done) {
    request(app)
      .post("/api/appointments")
      .send({
        date: "2020-11-10 21:30",
        practitionerAddress: "123 Fake St",
        patientLanguage: "English",
        patientName: "John Smith",
        description: "This is a description",
        specialNotes: "This is a special note",
      })
      .expect(500, { message: '"patientPhoneNumber" is required' }, done);
  });

  after(() => {
    sinon.restore();
  });
});
