import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  reg_no: string;
  login_time: string;
}

interface StudentContextType {
  student: Student | null;
  setStudent: (student: Student | null) => void;
  logout: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [student, setStudent] = useState<Student | null>(() => {
    const saved = sessionStorage.getItem('arena_student');
    return saved ? JSON.parse(saved) : null;
  });

  const handleSetStudent = (s: Student | null) => {
    setStudent(s);
    if (s) sessionStorage.setItem('arena_student', JSON.stringify(s));
    else sessionStorage.removeItem('arena_student');
  };

  const logout = () => handleSetStudent(null);

  return (
    <StudentContext.Provider value={{ student, setStudent: handleSetStudent, logout }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error('useStudent must be used within StudentProvider');
  return ctx;
};
