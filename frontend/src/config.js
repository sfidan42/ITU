export const CONFIG = {
  API_BASE: "http://localhost:8000/api/combined",
  Tables: [
    { name: "Kişi", endpoint: "person-overview" },
    { name: "Araştırma_Görevlisi", endpoint: "academic-staff/research-assistant" },
    { name: "Öğretim_Görevlisi", endpoint: "academic-staff/instructor" },
    { name: "Dr_Öğretim_Üyesi", endpoint: "academic-staff/doctor-lecturer" },
    { name: "Doçent", endpoint: "academic-staff/associate-professor" },
    { name: "Profesör", endpoint: "academic-staff/professor" },
    { name: "İdari_Personel", endpoint: "administrative-staff" },
  ],
  FormTemplates: {
    "person-overview": { tc_no: "", name: "", mid_name: "", surname: "", gender: "", registr_no: "" },
    "academic-staff/research-assistant": { registr_no: "", duty_type: "Araştırma_Görevlisi" },
    "administrative-staff": { registr_no: "", itu_mail: "", department: "", registration_date: "", status: "" },
  }
};
