"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import FilterBar from "@/components/ui/FilterBar";
import StatusBadge from "@/components/ui/StatusBadge";
import Avatar from "@/components/ui/Avatar";
import DayRail from "@/components/ui/DayRail";

function EmployeeAttendance() {
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    setLoading(true);
    api.get(`/attendance/my?month=${month}`)
      .then((r) => setRecords(Array.isArray(r.data) ? r.data : r.data?.records || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [month]);

  const daysInMonth = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]), 0).getDate();
  const firstDay = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]) - 1, 1).getDay();
  const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1;

  const getStatusForDay = (day: number) => {
    const dateStr = `${month}-${String(day).padStart(2, "0")}`;
    const record = records.find((r) => {
      const d = (r.date as string) || "";
      return d.startsWith(dateStr);
    });
    return record ? (record.status as string) : null;
  };

  const statusBg: Record<string, string> = {
    present: "var(--st-present-bg)",
    late: "var(--st-late-bg)",
    half_day: "var(--st-half-bg)",
    absent: "var(--st-absent-bg)",
    on_leave: "var(--st-leave-bg)",
    missing_checkout: "var(--st-missing-bg)",
  };

  return (
    <>
      <PageHeader title="Attendance" subtitle="Your monthly attendance" />
      <div className="mb-4">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }}
        />
      </div>
      <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="text-xs font-medium py-2" style={{ color: "var(--ink-3)" }}>{d}</div>
          ))}
          {Array.from({ length: adjustedFirst }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const status = getStatusForDay(day);
            const isToday = new Date().getDate() === day &&
              new Date().getMonth() + 1 === parseInt(month.split("-")[1]) &&
              new Date().getFullYear() === parseInt(month.split("-")[0]);
            return (
              <div
                key={day}
                className="aspect-square flex items-center justify-center rounded-lg text-sm cursor-pointer transition-colors"
                style={{
                  background: isToday ? "var(--highlight-soft)" : status ? statusBg[status] || "transparent" : "transparent",
                  color: "var(--ink)",
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AttendanceBoard() {
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ date });
    if (search) params.set("search", search);
    if (department) params.set("department", department);
    api.get(`/attendance?${params.toString()}`)
      .then((r) => setRecords(Array.isArray(r.data) ? r.data : r.data?.records || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [date, search, department]);

  useEffect(() => {
    api.get("/departments")
      .then((r) => {
        const depts = Array.isArray(r.data) ? r.data : r.data?.departments || [];
        setDepartments(depts.map((d: Record<string, unknown>) => ({ label: d.name as string, value: d._id as string || d.name as string })));
      })
      .catch(() => {});
  }, []);

  const present = records.filter((r) => r.status === "present").length;
  const late = records.filter((r) => r.status === "late").length;
  const onLeave = records.filter((r) => r.status === "on_leave").length;

  const columns = [
    {
      key: "employee",
      label: "Employee",
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          <Avatar name={(row.employeeName as string) || "?"} size="sm" />
          <div>
            <p className="font-medium text-sm" style={{ color: "var(--ink)" }}>{row.employeeName as string}</p>
            <p className="text-xs" style={{ color: "var(--ink-3)" }}>{row.employeeCode as string}</p>
          </div>
        </div>
      ),
    },
    { key: "department", label: "Department" },
    { key: "checkIn", label: "Check-in" },
    { key: "checkOut", label: "Check-out" },
    {
      key: "dayrail",
      label: "Timeline",
      render: (_: unknown, row: Record<string, unknown>) => (
        <DayRail checkInAt={row.checkIn as string} checkOutAt={row.checkOut as string} status={row.status as string} size="sm" />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val: unknown) => <StatusBadge status={(val as string) || "absent"} />,
    },
  ];

  return (
    <>
      <PageHeader title="Attendance" subtitle={new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }}
        />
      </div>
      {records.length > 0 && (
        <p className="text-sm mb-4" style={{ color: "var(--ink-2)" }}>
          {present} present, {late} late, {onLeave} on leave
        </p>
      )}
      <FilterBar
        search={{ value: search, onChange: setSearch, placeholder: "Search employees..." }}
        filters={[
          { label: "Department", value: department, onChange: setDepartment, options: departments },
        ]}
        onClear={() => { setSearch(""); setDepartment(""); }}
        hasActiveFilters={!!(search || department)}
      />
      <DataTable
        columns={columns}
        data={records}
        loading={loading}
        emptyTitle={`No check-ins on ${new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
        emptyDescription="Check-ins appear here as people arrive."
      />
    </>
  );
}

export default function AttendancePage() {
  const { user } = useAuth();
  const role = user?.role ?? "Employee";
  if (role === "Employee") return <EmployeeAttendance />;
  return <AttendanceBoard />;
}

