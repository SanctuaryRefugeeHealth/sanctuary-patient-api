import Mustache from "mustache";

const templates = [
  {
    templateId: 1,
    templateName: "Appointment Reminder",
    english: `Dear {{{patientName}}}, this message is to inform you of your upcoming appointment:{{#description}}
{{{description}}}{{/description}}
Date: {{{appointmentDate}}}
Time: {{{appointmentTime}}}
Address: {{{practitionerAddress}}}{{#specialNotes}}
Special Notes: {{{specialNotes}}}{{/specialNotes}}

{{#includeReplySection}}Please confirm your attendance by replying “Yes” or “No”.
If you need an interpreter, please reply with the word "interpreter".
{{/includeReplySection}}If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.`,

    // \u200E is the left-to-right mark and is used to improve mixing LTR text into the RTL message
    arabic: `السّيد(ة) \u200E{{{patientName}}}، هذه رسالة لإعلامك بالموعد:{{#description}}
\u200E{{{description}}}{{/description}}
التّاريخ: \u200E{{{appointmentDate}}}
الوقت: \u200E{{{appointmentTime}}}
العنوان: \u200E{{{practitionerAddress}}}{{#specialNotes}}
تعليمات خاصّة: \u200E{{{specialNotes}}}{{/specialNotes}}

{{#includeReplySection}}يرجى تأكيد الحضور بالإجابة بـِ "نعم" أو "لا".
إذا كنتم تحتاجون لمترجم، يرجى الرّد بكلمة "مترجم".
{{/includeReplySection}}إذا كانت لديكم أيّة استفسارات، يرجى الاتّصال بعيادة السانكتشوري (الدكتور مايكل ستيفنسن) على الرّقم التّالي: \u200E226-336-1321`,

    amharic: `ለ {{{patientName}}}፣ ይህ መልእክት የሚከተለው ቀጠሮ እንዳለዎት ለማሳወቅ ነው፥:{{#description}}
{{{description}}}{{/description}}
ቀን፦ {{{appointmentDate}}}
ሰዐት፦ {{{appointmentTime}}}
አድራሻ፦ {{{practitionerAddress}}}{{#specialNotes}}
ማስታወሻ፦ {{{specialNotes}}}{{/specialNotes}}

{{#includeReplySection}}በዚህ ቀጠሮ ላይ እገኛለሁ ወይም አልገኝም በማለት እንዲያሳውቁን በትህትና እንጠይቃለን።
አስተርጓሚ ካስፈለግዎ፣ እባኮ "አስተርጓሚ" በማለት ይመልሱ።
{{/includeReplySection}}ጥያቄ ካለዎት፣እባኮ በ 226-336-1321 Sanctuary Refugee Health Centre በመደወል (ዶ/ር ማይክል
ስቴፈንሰን) ያነጋግሩ። `,

    somali: `Gacaliye {{{patientName}}}, Farriintan ayaa ah in lagu ogeysiiyo ballantaada soo socota:{{#description}}
{{{description}}}{{/description}}
Taariikh: {{{appointmentDate}}}
Waqtiga: {{{appointmentTime}}}
Cinwaanka: {{{practitionerAddress}}}{{#specialNotes}}
Ogeysiis gaar ah: {{{specialNotes}}}{{/specialNotes}}

{{#includeReplySection}}Fadlan xaqiiji imaanshahaaga adoo ku jawaabaya "Haa" ama "Maya"
Haddii aad u baahan tahay turjubaan, fadlan ku jawaab ereyga "turjubaan"
{{/includeReplySection}}Haddii aad wax su'aalo ah qabtid, fadlan wac Xarunta Caafimaadka Qaxootiga ee Sanctuary (Dr. Michael Stephenson) lambarka 226-336-1321`,

    turkish: `Sayin {{{patientName}}}, Bu mesaj randevunuz ile ilgili sizi bilgilendirme amacli gonderilmistir:{{#description}}
{{{description}}}{{/description}}
Tarih: {{{appointmentDate}}}
Saat: {{{appointmentTime}}}
Adres: {{{practitionerAddress}}}{{#specialNotes}}
Ozel notlar: {{{specialNotes}}}{{/specialNotes}}

{{#includeReplySection}}Lutfen randevunuza katilim durumunuzu, bu mesaji “Evet” ya da “Hayir” seklinde
yanitlayarak bildiriniz
Eger tercumana ihtiyaciniz varsa lutfen bu mesaji "tercuman" yazarak yanitlayiniz.
{{/includeReplySection}}Sorulariniz icin lutfen bizi 226-336-1321 numarali telefondan arayiniz.
Sanctuary Refugee Health Centre - Dr Michael Stephenson`,

    spanish: `Estimado(a) {{{patientName}}}, Este mensaje es para informarle que usted tiene una próxima cita:{{#description}}
{{{description}}}{{/description}}
Fecha: {{{appointmentDate}}}
Hora: {{{appointmentTime}}}
Direccion: {{{practitionerAddress}}}{{#specialNotes}}
Notas especiales: {{{specialNotes}}}{{/specialNotes}}

{{#includeReplySection}}Por favor confirme su asistencia respondiendo “Si” o “No”
Si usted necesita un intérprete, por favor responda con la palabra “intérprete”
{{/includeReplySection}}Si usted tiene alguna pregunta, por favor llame a Sanctuary Refugee Health Centre (Dr. Michael Stephenson) al 226-336-1321.`,

    tigrinya: `ዝኸበርካ/ኪ {{{patientName}}} እዚ ሓበሬታዚ፡ ናይ ዝመጽእ ቆጸራኻ/ኺ መዘኻኸሪ እዩ :{{#description}}
{{{description}}}{{/description}}
ዕለት {{{appointmentDate}}}
ሰዓት {{{appointmentTime}}}
ኣድራሻ {{{practitionerAddress}}}{{#specialNotes}}
ፍሉይ ሓበሬታ {{{specialNotes}}}{{/specialNotes}}

{{#includeReplySection}}ኣብ ቆጸራኻ/ኺ ከም እትርከብ/ቢ፡ ሓብሩና “እወ ክርከብ እየ”፤ “ኣይፋለይን”
ኣተርጓሚ ዘድልየካ/ኪ እንተኾይኑ፡ “ኣተርጓሚ” ( interpreter ) የድልየኒ እዩ ብምባል መልሱልና ።
{{/includeReplySection}}ሕቶ እንተለኩም፡ ወይ ዝያዳ ሓበሬታ እንተደለኹም፡ ንሳንክቿሪ ረፉጂ ሀልዝ ሰንተር (Sanctuary Refugee Health Centre, Dr. Michael Stephenson )፡ ንዶር. ማይክል ስቲፈንሰን ኣብ 226-336-132 ብምድዋል ክትሓቱ ትኽእሉ።`,
  },
  {
    templateId: 2,
    templateName: "Reply to Text",
    yes: {
      english: "Thank you!",
      arabic: "شكرا جزيلا!",
      amharic: "አመሰግናለሁ!",
      somali: "Mahadsanid!",
      turkish: "Teşekkür ederim!",
      spanish: "¡Gracias!",
      tigrinya: "የቕንየለይ!",
    },
    no: {
      english: "Thank you. We will call you to arrange another time.",
      arabic: "شكرا جزيلا. سوف نتصل بك لترتيب موعد آخر.",
      amharic: "አመሰግናለሁ. ሌላ ጊዜ ለማመቻቸት እንጠራዎታለን ፡፡",
      somali:
        "Mahadsanid. Waan ku soo wici doonnaa si aan waqti kale kuugu dhigno.",
      turkish:
        "Teşekkür ederim. Başka bir zaman ayarlamak için sizi arayacağız.",
      spanish: "Gracias. Te llamaremos para concertar otro horario.",
      tigrinya: "የቕንየለይ. ንሕና ነዘራርበኩም ።",
    },
    interpreter: {
      english: "Thank you. We will ask for an interpreter.",
      arabic: "شكرا جزيلا. سوف نطلب مترجم.",
      amharic: "አመሰግናለሁ. አስተርጓሚ እንጠይቃለን ፡፡",
      somali: "Mahadsanid. Waxaan codsan doonaa turjubaan.",
      turkish: "Teşekkür ederim. Bir tercüman isteyeceğiz.",
      spanish: "Gracias. Solicitaremos un intérprete.",
      tigrinya: "የቕንየለይ. ተርጋሚ ንሓትት ።",
    },
  },
];

const getById = (id) => templates.find((template) => template.templateId == id);

export default {
  getAll: () => templates,
  getById,
  generateMessage: (templateId, languageName, templateMetadata) => {
    return Mustache.render(getById(templateId)[languageName.toLowerCase()], templateMetadata);
  },
  generateReply: (languageName, patientOption) => {
    const replyTemplate = getById(2)[patientOption];
    return Mustache.render(replyTemplate[languageName.toLowerCase()]);
  },
};
