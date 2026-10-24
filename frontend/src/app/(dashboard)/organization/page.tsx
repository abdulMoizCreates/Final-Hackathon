"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";

export default function OrganizationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [settings, setSettings] = useState({
    companyName: "HCM Lite Corp",
    timezone: "Asia/Karachi",
    officeStart: "09:00",
    graceMinutes: 15,
    halfDayHours: 5,
    weekendDays: ["Saturday", "Sunday"],
    latitude: "24.8607",
    longitude: "67.0011",
    radiusMeters: 150,
  });

  const [departments, setDepartments] = useState<string[]>([
    "Engineering",
    "Human Resources",
    "Product & Design",
    "Finance",
    "Marketing",
  ]);
  const [newDept, setNewDept] = useState("");

  const [designations, setDesignations] = useState<string[]>([
    "Software Engineer",
    "Senior Engineer",
    "Tech Lead",
    "HR Specialist",
    "HR Manager",
    "Accountant",
  ]);
  const [newDesig, setNewDesig] = useState("");

  const [holidays, setHolidays] = useState<{ date: string; name: string }[]>([
    { date: "2026-03-23", name: "Pakistan Day" },
    { date: "2026-05-01", name: "Labour Day" },
    { date: "2026-08-14", name: "Independence Day" },
    { date: "2026-12-25", name: "Quaid-e-Azam Day" },
  ]);
  const [holidayName, setHolidayName] = useState("");
  const [holidayDate, setHolidayDate] = useState("");

  useEffect(() => {
    api.get("/organization")
      .then((res) => {
        if (res.data) {
          if (res.data.settings) setSettings(res.data.settings);
          if (res.data.departments) setDepartments(res.data.departments);
          if (res.data.designations) setDesignations(res.data.designations);
          if (res.data.holidays) setHolidays(res.data.holidays);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/organization", {
        settings,
        departments,
        designations,
        holidays,
      });
      setSuccess("Changes saved.");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Could not save organization settings.");
    } finally {
      setSaving(false);
    }
  };

  const addDepartment = () => {
    if (!newDept.trim() || !isAdmin) return;
    if (!departments.includes(newDept.trim())) {
      setDepartments([...departments, newDept.trim()]);
    }
    setNewDept("");
  };

  const removeDepartment = (dept: string) => {
    if (!isAdmin) return;
    setDepartments(departments.filter((d) => d !== dept));
  };

  const addDesignation = () => {
    if (!newDesig.trim() || !isAdmin) return;
    if (!designations.includes(newDesig.trim())) {
      setDesignations([...designations, newDesig.trim()]);
    }
    setNewDesig("");
  };

  const removeDesignation = (desig: string) => {
    if (!isAdmin) return;
    setDesignations(designations.filter((d) => d !== desig));
  };

  const addHoliday = () => {
    if (!holidayName.trim() || !holidayDate || !isAdmin) return;
    setHolidays([...holidays, { name: holidayName.trim(), date: holidayDate }]);
    setHolidayName("");
    setHolidayDate("");
  };

  const removeHoliday = (idx: number) => {
    if (!isAdmin) return;
    setHolidays(holidays.filter((_, i) => i !== idx));
  };

  const inputStyle = {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
  };

  return (
    <>
      <PageHeader
        title="Organization"
        subtitle={
          isAdmin
            ? "Manage company rules, working hours, and structures"
            : "Only Admin can change company settings (Read-only view)"
        }
      />

      {error && <p className="text-sm mb-4" style={{ color: "var(--st-absent-fg)" }}>{error}</p>}
      {success && <p className="text-sm mb-4" style={{ color: "var(--st-present-fg)" }}>{success}</p>}

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {/* Section 1: Company Profile */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Company details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                Company name
              </label>
              <input
                disabled={!isAdmin}
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                Timezone
              </label>
              <select
                disabled={!isAdmin}
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              >
                <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5)</option>
                <option value="UTC">UTC</option>
                <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Working Hours & Grace Time */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Working hours & grace rules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                Office start time
              </label>
              <input
                type="time"
                disabled={!isAdmin}
                value={settings.officeStart}
                onChange={(e) => setSettings({ ...settings, officeStart: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                Grace window (minutes)
              </label>
              <input
                type="number"
                disabled={!isAdmin}
                value={settings.graceMinutes}
                onChange={(e) => setSettings({ ...settings, graceMinutes: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
                min="0"
                max="60"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                Half day threshold (hours)
              </label>
              <input
                type="number"
                disabled={!isAdmin}
                value={settings.halfDayHours}
                onChange={(e) => setSettings({ ...settings, halfDayHours: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
                min="1"
                max="12"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Office Location & Geofencing */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Office location & perimeter</h3>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      setSettings({
                        ...settings,
                        latitude: pos.coords.latitude.toFixed(6),
                        longitude: pos.coords.longitude.toFixed(6),
                      });
                    });
                  }
                }}
                className="text-xs font-medium px-2.5 py-1 rounded"
                style={{ background: "var(--sunken)", color: "var(--ink)" }}
              >
                Use current location
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                Latitude
              </label>
              <input
                disabled={!isAdmin}
                value={settings.latitude}
                onChange={(e) => setSettings({ ...settings, latitude: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                Longitude
              </label>
              <input
                disabled={!isAdmin}
                value={settings.longitude}
                onChange={(e) => setSettings({ ...settings, longitude: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>
                Allowed radius (meters)
              </label>
              <input
                type="number"
                disabled={!isAdmin}
                value={settings.radiusMeters}
                onChange={(e) => setSettings({ ...settings, radiusMeters: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Departments */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Departments</h3>
          {isAdmin && (
            <div className="flex gap-2">
              <input
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                placeholder="New department name"
                className="flex-1 px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={addDepartment}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--sunken)", color: "var(--ink)" }}
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            {departments.map((dept) => (
              <span
                key={dept}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "var(--sunken)", color: "var(--ink)" }}
              >
                {dept}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => removeDepartment(dept)}
                    className="hover:opacity-75 font-bold"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Section 5: Designations */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Designations</h3>
          {isAdmin && (
            <div className="flex gap-2">
              <input
                value={newDesig}
                onChange={(e) => setNewDesig(e.target.value)}
                placeholder="New designation title"
                className="flex-1 px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={addDesignation}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--sunken)", color: "var(--ink)" }}
              >
                Add
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            {designations.map((desig) => (
              <span
                key={desig}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "var(--sunken)", color: "var(--ink)" }}
              >
                {desig}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => removeDesignation(desig)}
                    className="hover:opacity-75 font-bold"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Section 6: Public Holidays */}
        <div className="rounded-xl p-6 space-y-4" style={{ background: "var(--surface)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>Public holidays</h3>
          {isAdmin && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="date"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                className="px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              />
              <input
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
                placeholder="Holiday name"
                className="px-3 py-2 rounded-lg text-sm"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={addHoliday}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--sunken)", color: "var(--ink)" }}
              >
                Add holiday
              </button>
            </div>
          )}
          <div className="divide-y text-sm mt-3" style={{ borderColor: "var(--line)" }}>
            {holidays.map((h, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-medium mr-3" style={{ color: "var(--ink)" }}>{h.name}</span>
                  <span className="text-xs" style={{ color: "var(--ink-3)" }}>{h.date}</span>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => removeHoliday(i)}
                    className="text-xs"
                    style={{ color: "var(--st-absent-fg)" }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {isAdmin && (
          <div className="sticky bottom-4 p-4 rounded-xl shadow-lg flex items-center justify-between" style={{ background: "var(--sidebar)", color: "var(--sidebar-ink)" }}>
            <span className="text-sm">Save your company settings to update organization rules</span>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              style={{ background: "var(--primary)", color: "var(--on-primary)" }}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </form>
    </>
  );
}

