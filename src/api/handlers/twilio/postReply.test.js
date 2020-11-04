import sinon from "sinon";
const postReplyFunctions = require("./postReply.js");
const postReplyDbFunctions = require("./databaseFunctions");
import { assert } from "chai";
const tClient = require("../../../services/twilioClient");
const db = require("../../../../knex");

describe("Sending A Reply", function () {
  let getAppointments;
  let getMessageResponseStub;
  let insertReplyStub;
  let confirmAppointmentStub;
  let transactionStub;

  before(() => {
    transactionStub = sinon.stub(db.db, "transaction").returns({
      commit: () => {},
    });
    getMessageResponseStub = sinon
      .stub(tClient, "getMessageResponse")
      .callsFake((message) => {
        return message;
      });
    getAppointments = sinon
      .stub(postReplyDbFunctions, "getAppointments")
      .callsFake((patientPhoneNumber) => {
        return [{ language: "English" }];
      });
    insertReplyStub = sinon
      .stub(postReplyDbFunctions, "insertReply")
      .callsFake(
        (trx, patientPhoneNumber, messageFromPatient, appointmentId) => {
          return true;
        }
      );
    confirmAppointmentStub = sinon
      .stub(postReplyDbFunctions, "confirmAppointment")
      .callsFake((trx, appointmentId, appointmentIsConfirmed) => {
        return true;
      });
  });

  it("Works when they say yes", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("123", "yes"),
      "Thank you!"
    );
  });

  it("Works when they say no", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("123", "no"),
      "Thank you. We will call you to arrange another time."
    );
  });

  after(() => {
    getAppointments.restore();
    getMessageResponseStub.restore();
    insertReplyStub.restore();
    confirmAppointmentStub.restore();
    transactionStub.restore();
  });
});
