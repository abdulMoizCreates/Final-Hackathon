"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import FilterBar from "@/components/ui/FilterBar";
import StatusBadge from "@/components/ui/StatusBadge";
import Avatar from "@/components/ui/Avatar";

export default function EmployeesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const role = user?.role ?? "Employee";
  const [employees, setEmployees] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (department) params.set("department", department);
    setLoading(true);
    api.get(`/employees?${params.toString()}`)
      .then((r) => {
        setEmployees(Array.isArray(r.data) ? r.data : r.data?.employees || []);
      })
      .catch(() => setEmployees([]))
      .finally(() => setLoading(false));
  }, [search, department]);

  useEffect(() => {
    api.get("/departments")
      .then((r) => {
        const depts = Array.isArray(r.data) ? r.data : r.data?.departments || [];
        setDepartments(depts.map((d: Record<string, unknown>) => ({ label: d.name as string, value: d._id as string || d.name as string })));
      })
      .catch(() => {});
  }, []);

  if (role === "Employee") {
    return (
      <>
        <PageHeader title="Employees" />
        <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
          <p style={{ color: "var(--ink-2)" }}>You do not have access to this page.</p>
          <button onClick={() => router.push("/dashboard")} className="mt-3 text-sm font-medium" style={{ color: "var(--primary)" }}>
            Go to dashboard
          </button>
        </div>
      </>
    );
  }

  const columns = [
    {
      key: "name",
      label: "Employee",
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          <Avatar name={(row.name as string) || "?"} size="sm" />
          <span className="font-medium" style={{ color: "var(--ink)" }}>{row.name as string}</span>
        </div>
      ),
    },
    { key: "employeeCode", label: "Code" },
    { key: "department", label: "Department" },
    { key: "designation", label: "Designation" },
    {
      key: "status",
      label: "Status",
      render: (val: unknown) => <StatusBadge status={(val as string) || "active"} />,
    },
    { key: "joinDate", label: "Joined" },
  ];

  return (
    <>
      <PageHeader title="Employees" subtitle={`${employees.length} employees`}>
        {role === "HR" && (
          <button
            onClick={() => router.push("/employees/register")}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            Register employee
          </button>
        )}
      </PageHeader>

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
        data={employees}
        loading={loading}
        onRowClick={(row) => router.push(`/employees/${row._id || row.id}`)}
        emptyTitle="No employees yet"
        emptyDescription={role === "HR" ? "Register your first employee. They get a login with a temporary password." : "HR registers employees. Create an HR login to get started."}
      />
    </>
  );
}

