import sinon from "sinon";
const postReplyFunctions = require("./postReply.js");
import { assert } from "chai";
const tClient = require("../../../services/twilioClient");

describe("", function () {
  let getAppointments;
  let getMessageResponseStub;
  before(() => {
    getMessageResponseStub = sinon
      .stub(tClient, "getMessageResponse")
      .callsFake((message) => {
        console.log("getMessageResponse Stub");
        return message;
      });
    getAppointments = sinon
      .stub(postReplyFunctions, "getAppointments")
      .callsFake((patientPhoneNumber) => {
        console.log("getAppointments Stub");
        return [{}];
      });
  });

  it.only("Test 1", function () {
    assert.equal(postReplyFunctions.handlePostReply("123", "yes"), "something");
  });

  after(() => {
    getAppointments.restore();
    getMessageResponseStub.restore();
  });
});
