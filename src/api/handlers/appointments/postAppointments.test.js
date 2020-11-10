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

const baseAppointment = {
  date: "2020-11-10 21:30",
  practitionerAddress: "123 Fake St",
  patientLanguage: "English",
  patientName: "John Smith",
  patientPhoneNumber: "5555555555",
  description: "This is a description",
  specialNotes: "This is a special note",
};

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
      .send(baseAppointment)
      .expect(200, done);
  });

  it("should succeed without description", (done) => {
    const appointment = { ...baseAppointment };
    delete appointment.description;
    request(app).post("/api/appointments").send(appointment).expect(200, done);
  });

  it("should fail on empty description", (done) => {
    const appointment = { ...baseAppointment };
    appointment.description = "";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"description" is not allowed to be empty' },
        done
      );
  });

  it("should fail on whitespace only description", (done) => {
    const appointment = { ...baseAppointment };
    appointment.description = "     ";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"description" is not allowed to be empty' },
        done
      );
  });

  it("should succeed without special notes", (done) => {
    const appointment = { ...baseAppointment };
    delete appointment.specialNotes;
    request(app).post("/api/appointments").send(appointment).expect(200, done);
  });

  it("should fail on empty special notes", (done) => {
    const appointment = { ...baseAppointment };
    appointment.specialNotes = "";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"specialNotes" is not allowed to be empty' },
        done
      );
  });

  it("should fail on whitespace only special notes", (done) => {
    const appointment = { ...baseAppointment };
    appointment.specialNotes = "     ";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"specialNotes" is not allowed to be empty' },
        done
      );
  });

  it("should fail on empty date", (done) => {
    const appointment = { ...baseAppointment };
    appointment.date = "";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(500, { message: '"date" must be a valid date' }, done);
  });

  it("should fail on whitespace only date", (done) => {
    const appointment = { ...baseAppointment };
    appointment.date = "     ";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(500, { message: '"date" must be a valid date' }, done);
  });

  it("should fail on bad date", (done) => {
    const appointment = { ...baseAppointment };
    appointment.date = "2020-13-10 21:30";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(500, { message: '"date" must be a valid date' }, done);
  });

  it("should fail on missing date", (done) => {
    const appointment = { ...baseAppointment };
    delete appointment.date;
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(500, { message: '"date" is required' }, done);
  });

  it("should fail on empty address", (done) => {
    const appointment = { ...baseAppointment };
    appointment.practitionerAddress = "";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"practitionerAddress" is not allowed to be empty' },
        done
      );
  });

  it("should fail on whitespace only address", (done) => {
    const appointment = { ...baseAppointment };
    appointment.practitionerAddress = "     ";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"practitionerAddress" is not allowed to be empty' },
        done
      );
  });

  it("should fail on missing address", (done) => {
    const appointment = { ...baseAppointment };
    delete appointment.practitionerAddress;
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(500, { message: '"practitionerAddress" is required' }, done);
  });

  it("should fail on empty language", (done) => {
    const appointment = { ...baseAppointment };
    appointment.patientLanguage = "";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"patientLanguage" is not allowed to be empty' },
        done
      );
  });

  it("should fail on whitespace only language", (done) => {
    const appointment = { ...baseAppointment };
    appointment.patientLanguage = "     ";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"patientLanguage" is not allowed to be empty' },
        done
      );
  });

  it("should fail on missing language", (done) => {
    const appointment = { ...baseAppointment };
    delete appointment.patientLanguage;
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(500, { message: '"patientLanguage" is required' }, done);
  });

  it("should fail on empty name", function (done) {
    const appointment = { ...baseAppointment };
    appointment.patientName = "";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"patientName" is not allowed to be empty' },
        done
      );
  });

  it("should fail on whitespace only name", function (done) {
    const appointment = { ...baseAppointment };
    appointment.patientName = "     ";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"patientName" is not allowed to be empty' },
        done
      );
  });

  it("should fail on missing name", function (done) {
    const appointment = { ...baseAppointment };
    delete appointment.patientName;
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(500, { message: '"patientName" is required' }, done);
  });

  it("should fail on empty phone number", function (done) {
    const appointment = { ...baseAppointment };
    appointment.patientPhoneNumber = "";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"patientPhoneNumber" is not allowed to be empty' },
        done
      );
  });

  it("should fail on short phone number", function (done) {
    const appointment = { ...baseAppointment };
    appointment.patientPhoneNumber = "555555555";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"patientPhoneNumber" length must be 10 characters long' },
        done
      );
  });

  it("should fail on long phone number", function (done) {
    const appointment = { ...baseAppointment };
    appointment.patientPhoneNumber = "55555555555";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"patientPhoneNumber" length must be 10 characters long' },
        done
      );
  });

  it("should fail on letters in phone number", function (done) {
    const appointment = { ...baseAppointment };
    appointment.patientPhoneNumber = "A555555555";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        {
          message:
            '"patientPhoneNumber" with value "A555555555" fails to match the required pattern: /^\\d+$/',
        },
        done
      );
  });

  it("should fail on whitespace only phone number", function (done) {
    const appointment = { ...baseAppointment };
    appointment.patientPhoneNumber = "     ";
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(
        500,
        { message: '"patientPhoneNumber" is not allowed to be empty' },
        done
      );
  });

  it("should fail on missing phone number", function (done) {
    const appointment = { ...baseAppointment };
    delete appointment.patientPhoneNumber;
    request(app)
      .post("/api/appointments")
      .send(appointment)
      .expect(500, { message: '"patientPhoneNumber" is required' }, done);
  });

  after(() => {
    sinon.restore();
  });
});
