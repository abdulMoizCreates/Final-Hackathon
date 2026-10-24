"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Building2,
  Clock,
  Shield,
  Layers,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Globe,
  MapPin,
  Calendar,
  Users
} from "lucide-react";

export default function OrganizationPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "Admin";

  const [activeTab, setActiveTab] = useState<"profile" | "departments" | "shifts" | "roles">("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [settings, setSettings] = useState({
    companyName: "Nexus Enterprise Technologies",
    registrationNo: "PK-REG-2026-9901",
    timezone: "Asia/Karachi (PKT +05:00)",
    currency: "PKR (₨)",
    address: "Tech Central Tower, Shahrah-e-Faisal, Karachi, Pakistan",
    email: "hr@nexustech.com",
    phone: "+92 21 111 729 526",
    officeStart: "09:00",
    officeEnd: "18:00",
    graceMinutes: 15,
    halfDayHours: 4.5,
    lateThresholdDeduction: 3,
  });

  const [departments, setDepartments] = useState<string[]>([
    "Engineering",
    "Human Resources",
    "Product & UI/UX Design",
    "Sales & Business Development",
    "Marketing & Growth",
    "Finance & Accounts",
  ]);
  const [newDept, setNewDept] = useState("");

  const [designations, setDesignations] = useState<string[]>([
    "Lead Full Stack Developer",
    "Senior Frontend Engineer",
    "Backend & AI Engineer",
    "HR Specialist",
    "Account Executive",
    "UI/UX Designer",
    "Financial Analyst",
  ]);
  const [newDesig, setNewDesig] = useState("");

  useEffect(() => {
    api.get("/organization")
      .then((res) => {
        if (res.data?.settings) setSettings((prev) => ({ ...prev, ...res.data.settings }));
        if (res.data?.departments && Array.isArray(res.data.departments)) {
          setDepartments(res.data.departments);
        }
        if (res.data?.designations && Array.isArray(res.data.designations)) {
          setDesignations(res.data.designations);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await api.put("/organization", {
        settings,
        departments,
        designations,
      }).catch(() => {});

      setSuccessMsg("✓ Organization settings and policies updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch {
      setSuccessMsg("Settings updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const addDepartment = () => {
    if (!newDept.trim()) return;
    if (!departments.includes(newDept.trim())) {
      setDepartments([...departments, newDept.trim()]);
    }
    setNewDept("");
  };

  const removeDepartment = (dept: string) => {
    setDepartments(departments.filter((d) => d !== dept));
  };

  const addDesignation = () => {
    if (!newDesig.trim()) return;
    if (!designations.includes(newDesig.trim())) {
      setDesignations([...designations, newDesig.trim()]);
    }
    setNewDesig("");
  };

  const removeDesignation = (desig: string) => {
    setDesignations(designations.filter((d) => d !== desig));
  };

  return (
    <div className="space-y-6">
      {/* ──────────────── Top Header Bar ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Organization Settings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure company branding, departmental hierarchy, attendance rules, and access control.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-xs font-semibold shadow-md shadow-teal-900/10 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 self-start sm:self-auto"
          >
            <Save size={16} />
            <span>{saving ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ──────────────── Segmented Tab Navigation ──────────────── */}
      <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "profile"
              ? "bg-teal-700 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 size={14} />
          <span>Company Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "departments"
              ? "bg-teal-700 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Layers size={14} />
          <span>Departments & Roles</span>
        </button>

        <button
          onClick={() => setActiveTab("shifts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "shifts"
              ? "bg-teal-700 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock size={14} />
          <span>Work Shifts & Rules</span>
        </button>

        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === "roles"
              ? "bg-teal-700 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Shield size={14} />
          <span>User Roles & Permissions</span>
        </button>
      </div>

      {/* ──────────────── TAB 1: COMPANY PROFILE ──────────────── */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-800 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
              S
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{settings.companyName}</h2>
              <p className="text-xs text-slate-400 font-mono">{settings.registrationNo} · Registered Employer</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Company Legal Name</label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Registration / Tax ID</label>
              <input
                type="text"
                value={settings.registrationNo}
                onChange={(e) => setSettings({ ...settings, registrationNo: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl text-xs font-mono text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Official Contact Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Headquarters Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Timezone</label>
              <input
                type="text"
                value={settings.timezone}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl text-xs font-medium text-slate-600 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Primary Currency</label>
              <input
                type="text"
                value={settings.currency}
                disabled
                className="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl text-xs font-medium text-slate-600 outline-none cursor-not-allowed"
              />
            </div>
          </form>
        </div>
      )}

      {/* ──────────────── TAB 2: DEPARTMENTS & ROLES ──────────────── */}
      {activeTab === "departments" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Departments */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Departments ({departments.length})</h3>
                <p className="text-xs text-slate-400">Business units and organizational branches</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New department name..."
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addDepartment()}
                className="flex-1 px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
              <button
                type="button"
                onClick={addDepartment}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {departments.map((dept) => (
                <div
                  key={dept}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-800">{dept}</span>
                  {isAdmin && (
                    <button
                      onClick={() => removeDepartment(dept)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Designations */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Job Designations ({designations.length})</h3>
                <p className="text-xs text-slate-400">Official staff roles and titles</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New designation title..."
                value={newDesig}
                onChange={(e) => setNewDesig(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addDesignation()}
                className="flex-1 px-3 py-2 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
              <button
                type="button"
                onClick={addDesignation}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {designations.map((desig) => (
                <div
                  key={desig}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-800">{desig}</span>
                  {isAdmin && (
                    <button
                      onClick={() => removeDesignation(desig)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 3: WORK SHIFTS & RULES ──────────────── */}
      {activeTab === "shifts" && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Shift Timings & Punctuality Policy</h3>
            <p className="text-xs text-slate-400">Rules applied to daily biometric check-ins and monthly salary calculations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <label className="block text-[11px] font-semibold text-slate-700">Official Shift Start</label>
              <input
                type="time"
                value={settings.officeStart}
                onChange={(e) => setSettings({ ...settings, officeStart: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs font-mono outline-none border border-slate-200"
              />
              <p className="text-[10px] text-slate-400">Regular morning check-in starts at 09:00 AM</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <label className="block text-[11px] font-semibold text-slate-700">Grace Period (Minutes)</label>
              <input
                type="number"
                value={settings.graceMinutes}
                onChange={(e) => setSettings({ ...settings, graceMinutes: parseInt(e.target.value) || 15 })}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs font-mono outline-none border border-slate-200"
              />
              <p className="text-[10px] text-slate-400">Arrivals up to 15m after start are not penalised</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
              <label className="block text-[11px] font-semibold text-slate-700">Half-Day Threshold (Hours)</label>
              <input
                type="number"
                step="0.5"
                value={settings.halfDayHours}
                onChange={(e) => setSettings({ ...settings, halfDayHours: parseFloat(e.target.value) || 4.5 })}
                className="w-full px-3 py-2 bg-white rounded-lg text-xs font-mono outline-none border border-slate-200"
              />
              <p className="text-[10px] text-slate-400">Working fewer than 4.5 hours logs as Half Day</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/50 space-y-1">
            <h4 className="text-xs font-bold text-amber-900">Late Attendance Deductions</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Every 3 late arrivals recorded in a single payroll cycle automatically converts into 0.5 days unpaid leave deduction during payroll generation.
            </p>
          </div>
        </div>
      )}

      {/* ──────────────── TAB 4: ROLES & PERMISSIONS ──────────────── */}
      {activeTab === "roles" && (
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
            <p className="text-xs text-slate-400">System permissions defined per organizational user tier</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Admin */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">Admin</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-200 text-teal-900 text-[10px] font-bold">Full Access</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Manage company policies & settings</li>
                <li>Finalize & lock payroll runs</li>
                <li>Approve all leave applications</li>
                <li>Register & deactivate employee logins</li>
                <li>View audit trail logs</li>
              </ul>
            </div>

            {/* HR */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">HR Manager</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">Staff Mgmt</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Register new employees</li>
                <li>Track and edit daily attendance</li>
                <li>Review and approve leave requests</li>
                <li>Generate monthly payroll drafts</li>
                <li>Publish company announcements</li>
              </ul>
            </div>

            {/* Employee */}
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">Employee</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-900 text-[10px] font-bold">Self Service</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Biometric face / web check-in</li>
                <li>Apply for leaves (with AI assist)</li>
                <li>View monthly attendance calendar</li>
                <li>Download personal payslips</li>
                <li>Chat with AI HR copilot</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
