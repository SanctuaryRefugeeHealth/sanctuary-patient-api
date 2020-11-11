import sinon from "sinon";
const postReplyFunctions = require("./postReply.js");
import * as appointments from "../../../models/appointments";
import * as communications from "../../../models/communications";
import { assert } from "chai";
const tClient = require("../../../services/twilioClient");
const db = require("../../../../knex");

describe("Sending A Reply", function () {
  before(() => {
    sinon.stub(db.db, "transaction").returns({
      commit: () => {},
    });
    sinon.stub(tClient, "getMessageResponse").callsFake((message) => {
      return message;
    });
    sinon.stub(appointments, "getAppointments").callsFake(() => {
      return [{ patientLanguage: "English" }];
    });
    sinon.stub(communications, "insertReply").callsFake(() => {
      return true;
    });
    sinon.stub(appointments, "confirmAppointment").callsFake(() => {
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
    sinon.restore();
  });
});
