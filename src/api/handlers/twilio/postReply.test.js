import sinon from "sinon";
const postReplyFunctions = require("./postReply.js");
import * as appointments from "../../../models/appointments.js";
import * as communications from "../../../models/communications.js";
import { assert } from "chai";
const tClient = require("../../../services/twilioClient.js");
const db = require("../../../../knex.js");

describe("Sending A Reply", function () {
  let confirmAppointment;
  let requestTranslator;

  before(() => {
    sinon.stub(db.db, "transaction").returns({
      commit: () => {},
      rollback: () => {},
    });
    sinon.stub(tClient, "getMessageResponse").callsFake((message) => {
      return message;
    });
    sinon.stub(appointments, "getAppointments").callsFake((phoneNumber) => {
      return {
        orderBy: async (sortBy, order) => {
          return [
            { appointmentId: 1, phoneNumber: "123", language: "Turkish" },
            { appointmentId: 2, phoneNumber: "123", language: "English" },
            { appointmentId: 3, phoneNumber: "321", language: "English" },
            { appointmentId: 4, phoneNumber: "321", language: "Turkish" },
            { appointmentId: 4, phoneNumber: "333", language: "Somali" },
          ]
            .filter((item) => {
              return item.phoneNumber === phoneNumber;
            })
            .sort((a, b) => {
              if (order === "desc") {
                return a[sortBy] < b[sortBy] ? 1 : -1;
              }
              return a[sortBy] > b[sortBy] ? 1 : -1;
            });
        },
      };
    });
    sinon.stub(communications, "insertReply").callsFake(() => {
      return true;
    });
    confirmAppointment = sinon
      .stub(appointments, "confirmAppointment")
      .callsFake(() => {
        return true;
      });
    requestTranslator = sinon
      .stub(appointments, "requestTranslator")
      .callsFake(() => {
        return true;
      });
  });

  beforeEach(() => {
    confirmAppointment.resetHistory();
    requestTranslator.resetHistory();
  });

  it("Response with confirmation when they say yes", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("123", "yes"),
      "Thank you!"
    );
  });

  it("Confirms appointment when they say yes", async function () {
    await postReplyFunctions.handlePostReply("123", "yes");
    assert.isTrue(confirmAppointment.called);
  });

  it("Confirms appointment when Somali", async function () {
    await postReplyFunctions.handlePostReply("333", "haa");
    assert.isTrue(confirmAppointment.called);
  });

  it("Response with confirmation when Yes", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("123", "Yes"),
      "Thank you!"
    );
  });

  it("Works when they say interpreter", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("123", "interpreter"),
      "Thank you. We will ask for an interpreter."
    );
  });

  it("Requests interpreter when requested", async function () {
    await postReplyFunctions.handlePostReply("123", "interpreter");
    assert.isTrue(requestTranslator.called);
  });

  it("Requests interpreter when requested in Somali", async function () {
    await postReplyFunctions.handlePostReply("333", "turjubaan");
    assert.isTrue(requestTranslator.called);
  });

  it("Response with Turkish when they say yes", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("321", "yes"),
      "Teşekkür ederim!"
    );
  });

  it("Response with confirmation when they say evet", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("321", "evet"),
      "Teşekkür ederim!"
    );
  });

  it("Response with cancellation when they say hayır", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("321", "hayır"),
      "Teşekkür ederim. Başka bir zaman ayarlamak için sizi arayacağız."
    );
  });

  it("Response with confirmation when they say haa", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("333", "evet"),
      "Mahadsanid!"
    );
  });

  it("Response with cancelletion when they say maya", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("333", "maya"),
      "Mahadsanid. Waan ku soo wici doonnaa si aan waqti kale kuugu dhigno."
    );
  });

  it("Response with interpreter when they say turjubaan", async function () {
    assert.equal(
      await postReplyFunctions.handlePostReply("333", "turjubaan"),
      "Mahadsanid. Waxaan codsan doonaa turjubaan."
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
