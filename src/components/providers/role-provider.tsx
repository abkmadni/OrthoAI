"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getStoredRole, setStoredRole, clearStoredRole, type UserRole } from "@/lib/role-storage";

type RoleContextValue = {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole | null>(null);

  useEffect(() => {
    setRoleState(getStoredRole());
  }, []);

  const setRole = (newRole: UserRole) => {
    setStoredRole(newRole);
    setRoleState(newRole);
  };

  const clearRoleFn = () => {
    clearStoredRole();
    setRoleState(null);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole: clearRoleFn }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
