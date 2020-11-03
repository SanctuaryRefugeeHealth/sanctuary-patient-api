import { expect } from "chai";
import moment from "moment";
import TemplatesModel from "../../src/models/templates";

describe("#generateMessage()", function () {
  const commonMetadata = {
    patientName: "John Smith",
    appointmentDate: moment("2020-01-02T03:04").format("YYYY-MM-DD"),
    appointmentTime: moment("2020-01-02T03:04").format("h:mm a"),
    practitionerAddress: "123 Fake St.",
  };

  it("should return formatted message in English", function () {
    const actual = TemplatesModel.generateMessage(1, "English", commonMetadata);

    const expected = `
      Dear John Smith, this message is to inform you of your upcoming appointment.
      Date: 2020-01-02
      Time: 3:04 am
      Address: 123 Fake St.

      Please confirm your attendance by replying “Yes” or “No”
      If you need an interpreter, please reply with the word "interpreter"
      If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael
      Stephenson) at 226-336-1321
    `;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in English with description", function () {
    const metadata = {
      ...commonMetadata,
      description: "X-ray",
    };

    const actual = TemplatesModel.generateMessage(1, "English", metadata);

    const expected = `
      Dear John Smith, this message is to inform you of your upcoming appointment: X-ray.
      Date: 2020-01-02
      Time: 3:04 am
      Address: 123 Fake St.

      Please confirm your attendance by replying “Yes” or “No”
      If you need an interpreter, please reply with the word "interpreter"
      If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael
      Stephenson) at 226-336-1321
    `;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in English with special notes", function () {
    const metadata = {
      ...commonMetadata,
      specialNotes: "This is a special note",
    };

    const actual = TemplatesModel.generateMessage(1, "English", metadata);

    const expected = `
      Dear John Smith, this message is to inform you of your upcoming appointment.
      Date: 2020-01-02
      Time: 3:04 am
      Address: 123 Fake St.
      Special Notes: This is a special note

      Please confirm your attendance by replying “Yes” or “No”
      If you need an interpreter, please reply with the word "interpreter"
      If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael
      Stephenson) at 226-336-1321
    `;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in English with description and special notes", function () {
    const metadata = {
      ...commonMetadata,
      description: "X-ray",
      specialNotes: "This is a special note",
    };

    const actual = TemplatesModel.generateMessage(1, "English", metadata);

    const expected = `
      Dear John Smith, this message is to inform you of your upcoming appointment: X-ray.
      Date: 2020-01-02
      Time: 3:04 am
      Address: 123 Fake St.
      Special Notes: This is a special note

      Please confirm your attendance by replying “Yes” or “No”
      If you need an interpreter, please reply with the word "interpreter"
      If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael
      Stephenson) at 226-336-1321
    `;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Arabic", function () {
    const actual = TemplatesModel.generateMessage(1, "Arabic", commonMetadata);

    const expected = `
      السّيد(ة) \u200EJohn Smith، هذه رسالة لإعلامك بالموعد
      التّاريخ: \u200E2020-01-02.
      الوقت: \u200E3:04 am.
      العنوان: \u200E123 Fake St..

      يرجى تأكيد الحضور بالإجابة بـِ "نعم" أو "لا".
      إذا كنتم تحتاجون لمترجم، يرجى الرّد بكلمة "مترجم".
      إذا كانت لديكم أيّة استفسارات، يرجى الاتّصال بعيادة السانكتشوري (الدكتور مايكل ستيفنسن) على الرّقم التّالي: \u200E226-336-1321
    `;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Amharic", function () {
    const actual = TemplatesModel.generateMessage(1, "Amharic", commonMetadata);

    const expected = `
      ለ John Smith፣ ይህ መልእክት የሚከተለው ቀጠሮ እንዳለዎት ለማሳወቅ ነው፥.
      ቀን፦ 2020-01-02
      ሰዐት፦ 3:04 am
      አድራሻ፦ 123 Fake St.

      በዚህ ቀጠሮ ላይ እገኛለሁ ወይም አልገኝም በማለት እንዲያሳውቁን በትህትና እንጠይቃለን።
      አስተርጓሚ ካስፈለግዎ፣ እባኮ "አስተርጓሚ" በማለት ይመልሱ።
      ጥያቄ ካለዎት፣እባኮ በ 226-336-1321 Sanctuary Refugee Health Centre በመደወል (ዶ/ር ማይክል
      ስቴፈንሰን) ያነጋግሩ።
    `;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Somali", function () {
    const actual = TemplatesModel.generateMessage(1, "Somali", commonMetadata);

    const expected = `
      Gacaliye John Smith, Farriintan ayaa ah in lagu ogeysiiyo ballantaada soo socota.
      Taariikh: 2020-01-02
      Waqtiga: 3:04 am
      Cinwaanka: 123 Fake St.

      Fadlan xaqiiji imaanshahaaga adoo ku jawaabaya "Haa" ama "Maya"
      Haddii aad u baahan tahay turjubaan, fadlan ku jawaab ereyga "turjubaan"
      Haddii aad wax su'aalo ah qabtid, fadlan wac Xarunta Caafimaadka Qaxootiga ee
      Sanctuary (Dr. Michael Stephenson) lambarka 226-336-1321
    `;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Turkish", function () {
    const actual = TemplatesModel.generateMessage(1, "Turkish", commonMetadata);

    const expected = `
      Sayin John Smith, Bu mesaj randevunuz ile ilgili sizi bilgilendirme amacli gonderilmistir.
      Tarih: 2020-01-02
      Saat: 3:04 am
      Adres: 123 Fake St.

      Lutfen randevunuza katilim durumunuzu, bu mesaji “Evet” ya da “Hayir” seklinde
      yanitlayarak bildiriniz
      Eger tercumana ihtiyaciniz varsa lutfen bu mesaji "tercuman" yazarak yanitlayiniz.
      Sorulariniz icin lutfen bizi 226-336-1321 numarali telefondan arayiniz.
      Sanctuary Refugee Health Centre - Dr Michael Stephenson
    `;

    expect(actual).to.equal(expected);
  });

  it("should return formatted message in Spanish", function () {
    const actual = TemplatesModel.generateMessage(1, "Spanish", commonMetadata);

    const expected = `
      Estimado(a) John Smith, Este mensaje es para informarle que usted tiene una próxima cita.
      Fecha: 2020-01-02
      Hora: 3:04 am
      Direccion: 123 Fake St.

      Por favor confirme su asistencia respondiendo “Si” o “No”
      Si usted necesita un intérprete, por favor responda con la palabra “intérprete”
      Si usted tiene alguna pregunta, por favor llame a Sanctuary Refugee Health Centre (Dr. Michael
      Stephenson) al 226-336-1321.
    `;

    expect(actual).to.equal(expected);
  });
});
