import Mustache from 'mustache';

const templates = [
  {
    templateId: 1,
    templateName: "Appointment Reminder",
    1: `Hello,
    this is a message from Dr. Michael Stephenson's office for {{patientName}}.
    You have an appointment with Dr. {{practitionerClinicName}} on {{appointmentTime}} at the following address {{practitionerAddress}}.`,
    2: `مرحباً،
    هذه الرسالة مرسلة من مكتب الدكتور مايكل ستيفينسون إلى {{patientName}}  .
    لديك(ي) موعد لدى {{practitionerClinicName}}  .
    في تاريخ {{appointmentTime}}
    على العنوان التالي {{practitionerAddress}}`,
  }
];

const getById = (id) => (templates.find((template) => template.templateId == id));

export default {
  getAll: () => templates,
  getById,
  generateMessage: (templateId, languageId = 1, templateMetadata) => {
    return Mustache.render(getById(templateId)[languageId], templateMetadata);
  }
};