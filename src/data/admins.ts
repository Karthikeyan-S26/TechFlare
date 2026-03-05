// Admin registration numbers
// Admins cannot take tests - they can only manage students and view results
export const ADMIN_REG_NUMBERS = [
  '621323205024', // KARTHIKEYAN
  '621323205015', // ESWARI
];

// Check if a registration number belongs to an admin
export const isAdmin = (regNo: string): boolean => {
  return ADMIN_REG_NUMBERS.includes(regNo.trim());
};
