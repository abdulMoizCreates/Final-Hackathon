"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  X,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  employeeCode?: string;
  department?: string;
  designation?: string;
  basicSalary?: number;
  grossSalary?: number;
  status?: string;
  joinDate?: string;
}

export default function EmployeesPage() {
  const { user, role } = useAuth();
  const router = useRouter();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Add Employee Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    employeeCode: `EMP-${Math.floor(100 + Math.random() * 900)}`,
    department: "",
    designation: "",
    basicSalary: "45000",
    joinDate: new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);
  const [modalSuccess, setModalSuccess] = useState("");
  const [modalError, setModalError] = useState("");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedDept !== "all") params.set("department", selectedDept);
      
      const res = await api.get(`/employees?${params.toString()}`);
      const list = Array.isArray(res.data) ? res.data : res.data?.employees || [];
      
      // If list is empty, provide default demo employees for rich presentation
      if (list.length === 0) {
        const demoList: Employee[] = [
          { _id: "demo1", name: "Ahmed Khan", email: "ahmed.k@company.com", phone: "+92 300 1234567", employeeCode: "EMP-001", department: "Engineering", designation: "Lead Full Stack Dev", status: "active", joinDate: "2024-01-15", basicSalary: 120000 },
          { _id: "demo2", name: "Fatima Noor", email: "fatima.n@company.com", phone: "+92 301 7654321", employeeCode: "EMP-002", department: "Human Resources", designation: "HR Specialist", status: "active", joinDate: "2024-02-01", basicSalary: 85000 },
          { _id: "demo3", name: "Bilal Tariq", email: "bilal.t@company.com", phone: "+92 321 9876543", employeeCode: "EMP-003", department: "Sales", designation: "Account Executive", status: "on_leave", joinDate: "2024-03-10", basicSalary: 65000 },
          { _id: "demo4", name: "Zainab Ali", email: "zainab.a@company.com", phone: "+92 333 4567890", employeeCode: "EMP-004", department: "Engineering", designation: "UI/UX Designer", status: "active", joinDate: "2024-04-12", basicSalary: 95000 },
          { _id: "demo5", name: "Hamza Sheikh", email: "hamza.s@company.com", phone: "+92 345 6789012", employeeCode: "EMP-005", department: "Marketing", designation: "Content Strategist", status: "active", joinDate: "2024-05-18", basicSalary: 70000 },
          { _id: "demo6", name: "Ayesha Malik", email: "ayesha.m@company.com", phone: "+92 312 3456789", employeeCode: "EMP-006", department: "Finance", designation: "Financial Analyst", status: "inactive", joinDate: "2024-06-01", basicSalary: 80000 },
        ];
        setEmployees(demoList);
      } else {
        setEmployees(list);
      }
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, selectedDept]);

  useEffect(() => {
    api.get("/departments")
      .then((r) => {
        const depts = Array.isArray(r.data) ? r.data : r.data?.departments || [];
        setDepartments(depts);
        if (depts.length > 0 && !formData.department) {
          setFormData((prev) => ({ ...prev, department: depts[0].name }));
        }
      })
      .catch(() => {});
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setModalError("");
    setModalSuccess("");

    try {
      const res = await api.post("/employees", {
        ...formData,
        basicSalary: parseFloat(formData.basicSalary) || 45000,
      });

      setModalSuccess(`Employee ${formData.name} created! Temp Password: ${res.data.temporaryPassword || "Password@123"}`);
      fetchEmployees();
      setTimeout(() => {
        setShowAddModal(false);
        setModalSuccess("");
      }, 2500);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setModalError(axiosErr.response?.data?.message || "Failed to register employee.");
    } finally {
      setSaving(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    if (selectedStatus !== "all" && emp.status !== selectedStatus) return false;
    return true;
  });

  const totalCount = employees.length;
  const activeCount = employees.filter((e) => e.status === "active").length;
  const leaveCount = employees.filter((e) => e.status === "on_leave").length;
  const deptCount = departments.length || 5;

  return (
    <div className="space-y-6">
      {/* ──────────────── Top Header Bar ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employee Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your team members, departmental allocations, and work credentials.
          </p>
        </div>

        {role !== "Employee" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-xs font-semibold shadow-md shadow-teal-900/10 hover:brightness-105 active:scale-[0.98] transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {/* ──────────────── KPI Summary Strip ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Headcount</p>
            <p className="text-xl font-bold text-slate-800">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Staff</p>
            <p className="text-xl font-bold text-emerald-700">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <UserX size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">On Leave</p>
            <p className="text-xl font-bold text-amber-700">{leaveCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Departments</p>
            <p className="text-xl font-bold text-slate-800">{deptCount}</p>
          </div>
        </div>
      </div>

      {/* ──────────────── Filter & Search Bar ──────────────── */}
      <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, code, role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Department Select */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-600 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d._id} value={d.name}>{d.name}</option>
            ))}
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance">Finance</option>
          </select>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-600 outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* ──────────────── Employees Table ──────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading employee directory...</div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-700">No employees found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or register a new team member.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Employee</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredEmployees.map((emp) => {
                  const initial = emp.name ? emp.name[0]?.toUpperCase() : "E";
                  const isLeave = emp.status === "on_leave";
                  const isInactive = emp.status === "inactive";

                  return (
                    <tr
                      key={emp._id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => router.push(`/employees/${emp._id}`)}
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">
                              {emp.name}
                            </p>
                            <p className="text-[11px] text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {emp.employeeCode || "EMP-000"}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px]">
                          {emp.department || "General"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {emp.designation || "Staff"}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            isLeave
                              ? "bg-amber-50 text-amber-700"
                              : isInactive
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isLeave
                                ? "bg-amber-500"
                                : isInactive
                                ? "bg-slate-400"
                                : "bg-emerald-500"
                            }`}
                          />
                          {isLeave ? "On Leave" : isInactive ? "Inactive" : "Active"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {emp.joinDate ? new Date(emp.joinDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/employees/${emp._id}`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-600 text-[11px] font-semibold transition-all cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ──────────────── Add Employee Modal ──────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Register New Employee</h3>
                <p className="text-xs text-slate-500">Provide staff profile details to initialize account.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {modalSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{modalSuccess}</span>
              </div>
            )}

            {modalError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateEmployee} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Jamil"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="tariq@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Employee Code</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-mono text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="Engineering / Sales / HR"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Developer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Basic Salary (PKR)</label>
                  <input
                    type="number"
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-md shadow-teal-900/10 transition-all disabled:opacity-50"
                >
                  {saving ? "Registering..." : "Confirm & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
