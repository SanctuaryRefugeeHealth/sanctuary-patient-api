import { expect } from "chai";
import moment from "moment";
import TemplatesModel from "../../src/models/templates";

describe("#generateMessage()", function () {
  it("should return formatted message in English", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentTime: moment("2020-01-02T03:04").format("YYYY-MM-DD h:mm a"),
      practitionerAddress: "123 Fake St.",
    };

    const actual = TemplatesModel.generateMessage(1, "English", metadata);

    const expected = `This is a message from Dr. Michael Stephenson's office - Sanctuary Refugee Health Centre to John Smith.
You have an appointment for (Consult/ Imaging) on 2020-01-02 3:04 am at the the following address 123 Fake St..
If have any questions, please call us at 226-336-1321.`;

    expect(actual).to.equal(expected);
  });
});
