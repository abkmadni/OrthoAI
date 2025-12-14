export const branding = {
  name: "OrthoAI",
  description: "Advanced Dental AI Solutions",
  logo: {
    text: "OrthoAI",
    image: "/favicon.png", 
  },
  company: {
    name: "OrthoAI Inc.",
    address: "123 Dental Street, Tech City",
    email: "support@orthoai.com",
    phone: "+1 (555) 123-4567",
  },
  // Feature flags or other settings can go here
  features: {
    enablePatientPortal: true,
    enableAiAnalysis: true,
  }
};

export const navigation = {
  sidebar: [
    { href: "/dentist", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/dentist/schedule", label: "Schedule", icon: "Calendar" },
    { href: "/dentist/patients", label: "Patients", icon: "Users" },
    { href: "/dentist/xray-lab", label: "X-Ray Lab", icon: "FileDigit" },
    { href: "/dentist/settings", label: "Settings", icon: "Settings" },
  ]
};
