import { expect } from "chai";
import moment from "moment";
import TemplatesModel from "../../src/models/templates";

describe("#generateMessage()", function () {
  it("should return formatted message in English", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentDate: moment("2020-01-02T03:04").format("YYYY-MM-DD"),
      appointmentTime: moment("2020-01-02T03:04").format("h:mm a"),
      practitionerAddress: "123 Fake St.",
    };

    const actual = TemplatesModel.generateMessage(1, "English", metadata);

    const expected = `Dear John Smith, this message is to inform you of your upcoming appointment.

Date: 2020-01-02
Time: 3:04 am
Address: 123 Fake St.

If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.`;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in English with description", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentDate: moment("2020-01-02T03:04").format("YYYY-MM-DD"),
      appointmentTime: moment("2020-01-02T03:04").format("h:mm a"),
      practitionerAddress: "123 Fake St.",
      description: "X-ray",
    };

    const actual = TemplatesModel.generateMessage(1, "English", metadata);

    const expected = `Dear John Smith, this message is to inform you of your upcoming appointment: X-ray.

Date: 2020-01-02
Time: 3:04 am
Address: 123 Fake St.

If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.`;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in English with special notes", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentDate: moment("2020-01-02T03:04").format("YYYY-MM-DD"),
      appointmentTime: moment("2020-01-02T03:04").format("h:mm a"),
      practitionerAddress: "123 Fake St.",
      specialNotes: "This is a special note",
    };

    const actual = TemplatesModel.generateMessage(1, "English", metadata);

    const expected = `Dear John Smith, this message is to inform you of your upcoming appointment.

Date: 2020-01-02
Time: 3:04 am
Address: 123 Fake St.
Special Notes: This is a special note

If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.`;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in English with description and special notes", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentDate: moment("2020-01-02T03:04").format("YYYY-MM-DD"),
      appointmentTime: moment("2020-01-02T03:04").format("h:mm a"),
      practitionerAddress: "123 Fake St.",
      description: "X-ray",
      specialNotes: "This is a special note",
    };

    const actual = TemplatesModel.generateMessage(1, "English", metadata);

    const expected = `Dear John Smith, this message is to inform you of your upcoming appointment: X-ray.

Date: 2020-01-02
Time: 3:04 am
Address: 123 Fake St.
Special Notes: This is a special note

If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.`;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Arabic", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentDateTime: moment("2020-01-02T03:04").format(
        "YYYY-MM-DD h:mm a"
      ),
      practitionerAddress: "123 Fake St.",
    };

    const actual = TemplatesModel.generateMessage(1, "Arabic", metadata);

    const expected = `هذه رسالة من عيادة الدكتور مايكل طبيب العائلة إلى ‎(John Smith). هناك موعد ‎(123 Fake St.) يوم ‎(2020-01-02 3:04 am) على العنوان التالي: (العنوان)
    للاستفسار رجاءًا الاتصال على الرقم التالي:`;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Amharic", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentDateTime: moment("2020-01-02T03:04").format(
        "YYYY-MM-DD h:mm a"
      ),
      practitionerAddress: "123 Fake St.",
    };

    const actual = TemplatesModel.generateMessage(1, "Amharic", metadata);

    const expected = `ይህከዶ / ር ሚካኤል እስጢፋኖስ ቢሮ - ቅዱስ ሥደተኞች የጤና ማእከል ለ John Smith መልእክት ነው ፡፡ በሚተቀለው አድራሻ 123 Fake St. ላይ 2020-01-02 3:04 am ቀጠሮ አልዎት ፡፡
    ማናቸውምጥያቄዎች ካሉዎት እባክዎን በ 226-336-1321 ይደውሉልን ፡`;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Somali", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentDateTime: moment("2020-01-02T03:04").format(
        "YYYY-MM-DD h:mm a"
      ),
      practitionerAddress: "123 Fake St.",
    };

    const actual = TemplatesModel.generateMessage(1, "Somali", metadata);

    const expected = `Tani waa dhambaal ka socda xafiiska Dr.Michael Steaphenson ee Sanctuary (John Smith). Ballan ayaad u leedahay (La-tashi / Sawir Raajo or Computer) maalinta {Taariikhda} (123 Fake St.)cinwaanka soo socda.
    Haddii aad qabtid wax su'aalo ah, fadlan naga soo wac Numbarkan.226-336-1321.`;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Turkish", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentDateTime: moment("2020-01-02T03:04").format(
        "YYYY-MM-DD h:mm a"
      ),
      practitionerAddress: "123 Fake St.",
    };

    const actual = TemplatesModel.generateMessage(1, "Turkish", metadata);

    const expected = `Sayin John Smith,  2020-01-02 3:04 am tarihinde  123 Fake St. adresinde bulunan (Consult/ Imaging) ile randevunuz vardir. Sorulariniz icin bizi 226-336-1321'den arayabilirsiniz.
    Dr Michael Stephensoniun - Sanctuary Refugee Health Centre`;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Spanish", function () {
    const metadata = {
      patientName: "John Smith",
      appointmentDateTime: moment("2020-01-02T03:04").format(
        "YYYY-MM-DD h:mm a"
      ),
      practitionerAddress: "123 Fake St.",
    };

    const actual = TemplatesModel.generateMessage(1, "Spanish", metadata);

    const expected = `Este es un mensaje de la oficina del Dr. Michel Stephenson - Sanctuary Refugee Health Centre para: John Smith. Usted tiene una cita con (Consult)/(Imaging)el 2020-01-02 3:04 am en la siguiente dirección: 123 Fake St..\n    Si usted tiene alguna pregunta, por favor llamenos al 226-336-1321.`;

    expect(actual).to.equal(expected);
  });
});
