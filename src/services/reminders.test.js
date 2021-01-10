import sinon from "sinon";
import * as chai from "chai";
import promised from "chai-as-promised";

import * as appointments from "../models/appointments";
import * as communications from "../models/communications";
import * as twilio from "./twilioClient";

import db from "../../knex";

import { sendReminder } from "./reminders";

const expect = chai.expect;
chai.use(promised);

const baseAppointment = {
  appointmentId: 1,
  appointmentTime: "2020-11-10 21:30",
  practitionerAddress: "123 Fake St",
  language: "English",
  patientName: "John Smith",
  patientPhoneNumber: "5555555555",
  description: "This is a description",
  specialNotes: "This is a special note",
  appointmentIsConfirmed: null,
};

describe("#sendReminder", () => {
  before(() => {
    sinon.stub(db.db, "transaction").returns({
      commit: () => {},
    });
    sinon.stub(appointments, "updateLastReminderSentAt").returns({});
    sinon.stub(communications, "createMessage").returns({});
    sinon.stub(twilio, "sendMessage").returns({});
    sinon.useFakeTimers({
      now: 1483228800000,
    });
  });

  it("should fail without appointmentTime", async () => {
    const appointment = { ...baseAppointment };
    delete appointment.appointmentTime;
    expect(sendReminder(appointment)).to.be.rejectedWith(Error);
  });

  it("should succeed with reply section", async () => {
    const actual = await sendReminder(baseAppointment);
    const expected = {
      appointmentId: 1,
      messageBody: `Dear John Smith, this message is to inform you of your upcoming appointment:
This is a description
Date: Tuesday, November 10
Time: 9:30 pm
Address: 123 Fake St
Special Notes: This is a special note

Please confirm your attendance by replying “Yes” or “No”.
If you need an interpreter, please reply with the word "interpreter".
If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.`,
      language: "English",
      templateName: "Appointment Reminder",
      timeSent: new Date(1483228800000),
    };

    expect(actual).to.eql(expected);
  });

  it("should succeed without reply section", async () => {
    const appointment = { ...baseAppointment };
    appointment.appointmentIsConfirmed = true;

    const actual = await sendReminder(appointment);
    const expected = {
      appointmentId: 1,
      messageBody: `Dear John Smith, this message is to inform you of your upcoming appointment:
This is a description
Date: Tuesday, November 10
Time: 9:30 pm
Address: 123 Fake St
Special Notes: This is a special note

If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.`,
      language: "English",
      templateName: "Appointment Reminder",
      timeSent: new Date(1483228800000),
    };

    expect(actual).to.eql(expected);
  });

  after(() => {
    sinon.restore();
  });
});
