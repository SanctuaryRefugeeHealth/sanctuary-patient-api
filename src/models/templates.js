const templates = [
  {
    templateId: 1,
    templateName: "Appointment Reminder",
    1: `Hello, this is a message from Dr. Michael Stephenson's office for {{patientName}}. You have an appointment with Dr. {{specialistName}} on {{appointmentsDate}} at the following {{clinicAddress}}`,
    2: `مرحباً, هذه الرسالة مرسلة من مكتب الدكتور مايكل ستيفينسون إلى {{patientName}}. لديك(ي) موعد لدى د. {{specialistName}} في تاريخ {{appointmentsDate}} في العنوان التالي {{clinicAddress}}`,
  }
];

export default {
  getAll: () => templates,
  getById: (id) => (templates.find((template) => template.templateId == id)),
};