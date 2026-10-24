import User from "../models/User.js";
import Department from "../models/Department.js";
import Designation from "../models/Designation.js";
import Settings from "../models/Settings.js";
import Employee from "../models/Employee.js";

export const DEMO_PASSWORD = "Password@123";

export async function seedDemoUser() {
  try {
    // 1. Seed Company Settings
    let settings = await Settings.findOne();
    if (!settings) {
      await Settings.create({
        companyName: "HCM Lite Corp",
        timezone: "Asia/Karachi",
        officeStart: "09:00",
        graceMinutes: 15,
        halfDayHours: 5,
        weekendDays: ["Saturday", "Sunday"],
        setupComplete: true,
      });
    }

    // 2. Seed Departments
    const deptCount = await Department.countDocuments();
    if (deptCount === 0) {
      await Department.insertMany([
        { name: "Engineering" },
        { name: "Human Resources" },
        { name: "Product & Design" },
        { name: "Operations" },
      ]);
    }

    // 3. Seed Designations
    const desigCount = await Designation.countDocuments();
    if (desigCount === 0) {
      await Designation.insertMany([
        { name: "Software Engineer" },
        { name: "Senior Tech Lead" },
        { name: "HR Specialist" },
        { name: "Operations Manager" },
      ]);
    }

    // 4. Seed Demo Users: Admin, HR, Employee
    const demoAccounts = [
      { name: "System Admin", email: "admin@company.com", role: "Admin" },
      { name: "HR Operations Lead", email: "hr@company.com", role: "HR" },
      { name: "Bilal Staff", email: "employee@company.com", role: "Employee" },
      { name: "Hackathon Evaluator", email: "demo@hackathon.com", role: "Admin" },
    ];

    for (const acc of demoAccounts) {
      const exists = await User.findOne({ email: acc.email });
      if (!exists) {
        const u = await User.create({
          name: acc.name,
          email: acc.email,
          password: DEMO_PASSWORD,
          role: acc.role,
        });

        // Create matching employee record
        if (acc.role !== "Admin") {
          const emp = await Employee.create({
            employeeCode: acc.role === "HR" ? "HR-001" : "EMP-101",
            name: acc.name,
            email: acc.email,
            department: acc.role === "HR" ? "Human Resources" : "Engineering",
            designation: acc.role === "HR" ? "HR Specialist" : "Software Engineer",
            joinDate: "2026-01-15",
            basicSalary: acc.role === "HR" ? 90000 : 120000,
            userId: u._id,
          });
          u.employeeId = emp._id;
          await u.save();
        }
      }
    }

    console.log("Demo seed verification complete: Admin, HR, and Employee ready.");
  } catch (err) {
    console.error(`Demo user seed error: ${err.message}`);
  }
}
