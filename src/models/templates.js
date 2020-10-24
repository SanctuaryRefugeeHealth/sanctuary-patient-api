import Mustache from "mustache";

const templates = [
  {
    templateId: 1,
    templateName: "Appointment Reminder",
    English: `Dear {{patientName}}, this message is to inform you of your upcoming appointment{{#description}}: {{description}}{{/description}}.

Date: {{appointmentDate}}
Time: {{appointmentTime}}
Address: {{practitionerAddress}}
{{#specialNotes}}
Special Notes: {{specialNotes}}
{{/specialNotes}}

If you have any questions, please call Sanctuary Refugee Health Centre (Dr. Michael Stephenson) at 226-336-1321.`,

    // \u200E is the left-to-right mark and is used to improve mixing LTR text into the RTL message
    Arabic: `هذه رسالة من عيادة الدكتور مايكل طبيب العائلة إلى \u200E({{patientName}}). هناك موعد \u200E({{practitionerAddress}}) يوم \u200E({{appointmentDateTime}}) على العنوان التالي: (العنوان)
    للاستفسار رجاءًا الاتصال على الرقم التالي:`,

    Amharic: `ይህከዶ / ር ሚካኤል እስጢፋኖስ ቢሮ - ቅዱስ ሥደተኞች የጤና ማእከል ለ {{patientName}} መልእክት ነው ፡፡ በሚተቀለው አድራሻ {{practitionerAddress}} ላይ {{appointmentDateTime}} ቀጠሮ አልዎት ፡፡
    ማናቸውምጥያቄዎች ካሉዎት እባክዎን በ 226-336-1321 ይደውሉልን ፡`,

    Somali: `Tani waa dhambaal ka socda xafiiska Dr.Michael Steaphenson ee Sanctuary ({{patientName}}). Ballan ayaad u leedahay (La-tashi / Sawir Raajo or Computer) maalinta {Taariikhda} ({{practitionerAddress}})cinwaanka soo socda.
    Haddii aad qabtid wax su'aalo ah, fadlan naga soo wac Numbarkan.226-336-1321.`,

    Turkish: `Sayin {{patientName}},  {{appointmentDateTime}} tarihinde  {{practitionerAddress}} adresinde bulunan (Consult/ Imaging) ile randevunuz vardir. Sorulariniz icin bizi 226-336-1321'den arayabilirsiniz.
    Dr Michael Stephensoniun - Sanctuary Refugee Health Centre`,

    Spanish: `Este es un mensaje de la oficina del Dr. Michel Stephenson - Sanctuary Refugee Health Centre para: {{patientName}}. Usted tiene una cita con (Consult)/(Imaging)el {{appointmentDateTime}} en la siguiente dirección: {{practitionerAddress}}.
    Si usted tiene alguna pregunta, por favor llamenos al 226-336-1321.`,
  },
  {
    templateId: 2,
    templateName: "Reply to Text",
    yes: {
      English: "Thank you!",
      Arabic: "شكرا جزيلا!",
      Amharic: "አመሰግናለሁ!",
      Somali: "Mahadsanid!",
      Turkish: "Teşekkür ederim!",
      Spanish: "¡Gracias!",
    },
    no: {
      English: "Thank you. We will call you to arrange another time.",
      Arabic: "شكرا جزيلا. سوف نتصل بك لترتيب موعد آخر.",
      Amharic: "አመሰግናለሁ. ሌላ ጊዜ ለማመቻቸት እንጠራዎታለን ፡፡",
      Somali:
        "Mahadsanid. Waan ku soo wici doonnaa si aan waqti kale kuugu dhigno.",
      Turkish:
        "Teşekkür ederim. Başka bir zaman ayarlamak için sizi arayacağız.",
      Spanish: "Gracias. Te llamaremos para concertar otro horario.",
    },
    interpreter: {
      English: "Thank you. We will ask for an interpreter.",
      Arabic: "شكرا جزيلا. سوف نطلب مترجم.",
      Amharic: "አመሰግናለሁ. አስተርጓሚ እንጠይቃለን ፡፡",
      Somali: "Mahadsanid. Waxaan codsan doonaa turjubaan.",
      Turkish: "Teşekkür ederim. Bir tercüman isteyeceğiz.",
      Spanish: "Gracias. Solicitaremos un intérprete.",
    },
  },
];

const getById = (id) => templates.find((template) => template.templateId == id);

export default {
  getAll: () => templates,
  getById,
  generateMessage: (templateId, languageName, templateMetadata) => {
    return Mustache.render(getById(templateId)[languageName], templateMetadata);
  },
  generateReply: (languageName, patientOption) => {
    const replyTemplate = getById(2)[patientOption];
    return Mustache.render(replyTemplate[languageName]);
  },
};
