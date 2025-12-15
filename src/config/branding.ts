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
  sidebar: {
    dentist: [
      { href: "/dentist", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/dentist/schedule", label: "Schedule", icon: "Calendar" },
      { href: "/dentist/patients", label: "Patients", icon: "Users" },
      { href: "/dentist/xray-lab", label: "X-Ray Lab", icon: "FileDigit" },
      { href: "/dentist/settings", label: "Settings", icon: "Settings" },
    ],
    staff: [
      { href: "/receptionist", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/receptionist/appointments", label: "Appointments", icon: "Calendar" },
      { href: "/receptionist/patients", label: "Patients", icon: "Users" },
      { href: "/receptionist/settings", label: "Settings", icon: "Settings" },
    ],
    admin: [
      { href: "/admin", label: "Admin Dashboard", icon: "LayoutDashboard" },
      { href: "/admin/users", label: "Users", icon: "Users" },
      { href: "/admin/settings", label: "Settings", icon: "Settings" },
      // Access to other dashboards for testing
      { href: "/dentist", label: "Dentist Dashboard", icon: "LayoutDashboard" },
      { href: "/dentist/schedule", label: "Dentist Schedule", icon: "Calendar" },
      { href: "/dentist/patients", label: "Dentist Patients", icon: "Users" },
      { href: "/dentist/xray-lab", label: "Dentist X-Ray Lab", icon: "FileDigit" },
      { href: "/receptionist", label: "Staff Dashboard", icon: "LayoutDashboard" },
      { href: "/receptionist/appointments", label: "Staff Appointments", icon: "Calendar" },
      { href: "/receptionist/patients", label: "Staff Patients", icon: "Users" },
    ],
  }
};
