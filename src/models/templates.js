import Mustache from 'mustache';

const templates = [
  {
    templateId: 1,
    templateName: "Appointment Reminder",
    // English
    1: `This is a message from Dr. Michael Stephenson's office - Sanctuary Refugee Health Centre to {{patientName}}. 
    You have an appointment for (Consult/ Imaging) on {{appointmentTime}} at the the following address {{practitionerAddress}}. 
    If have any questions, please call us at 226-336-1321.`,
    // Arabic
    2: `هذه رسالة من عيادة الدكتور مايكل طبيب العائلة إلى ( {{patientName}}). هناك موعد ({{practitionerAddress}}) يوم ({{appointmentTime}}) على العنوان التالي: (العنوان)
    للاستفسار رجاءًا الاتصال على الرقم التالي:`,
    // Amharic
    3: `ይህከዶ / ር ሚካኤል እስጢፋኖስ ቢሮ - ቅዱስ ሥደተኞች የጤና ማእከል ለ {{patientName}} መልእክት ነው ፡፡ በሚተቀለው አድራሻ {{practitionerAddress}} ላይ {{appointmentTime}} ቀጠሮ አልዎት ፡፡
    ማናቸውምጥያቄዎች ካሉዎት እባክዎን በ 226-336-1321 ይደውሉልን ፡`,
    // Somali
    4: `Tani waa dhambaal ka socda xafiiska Dr.Michael Steaphenson ee Sanctuary ({{patientName}}). Ballan ayaad u leedahay (La-tashi / Sawir Raajo or Computer) maalinta {Taariikhda} ({{practitionerAddress}})cinwaanka soo socda.
    Haddii aad qabtid wax su'aalo ah, fadlan naga soo wac Numbarkan.226-336-1321.`,
    // Turkish
    5: `Sayin {{patientName}},  {{appointmentTime}} tarihinde  {{practitionerAddress}} adresinde bulunan (Consult/ Imaging) ile randevunuz vardir. Sorulariniz icin bizi 226-336-1321'den arayabilirsiniz.
    Dr Michael Stephensoniun - Sanctuary Refugee Health Centre`,
    // Spanish
    6: `"Este es un mensaje de la oficina del Dr. Michel Stephenson - Sanctuary Refugee Health Centre para: {{patientName}}. Usted tiene una cita con (Consult)/(Imaging)el {{appointmentTime}}en la siguiente dirección: {{practitionerAddress}}. 
    Si usted tiene alguna pregunta, por favor llamenos al 226-336-1321."`
  },
  {
    templateId: 2,
    templateName: "Reply to Text",
    "english": "Replies are not read. Please call 226-750-6674 to talk to someone at Sanctuary Refugee Health Centre."
  }
];

const getById = (id) => (templates.find((template) => template.templateId == id));

export default {
  getAll: () => templates,
  getById,
  generateMessage: (templateId, languageId = 1, templateMetadata) => {
    return Mustache.render(getById(templateId)[languageId], templateMetadata);
  },
  generateReply: (templateId = 2, language = "english") => {
    return Mustache.render(getById(templateId)[language])
  }
};
