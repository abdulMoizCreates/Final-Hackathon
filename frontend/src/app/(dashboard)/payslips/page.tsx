"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";

export default function PayslipsPage() {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    api.get("/payslips/my")
      .then((r) => setPayslips(Array.isArray(r.data) ? r.data : r.data?.payslips || []))
      .catch(() => setPayslips([]))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: "month", label: "Month" },
    {
      key: "gross",
      label: "Gross pay",
      align: "right" as const,
      render: (val: unknown) => `PKR ${Number(val || 0).toLocaleString()}`,
    },
    {
      key: "deductions",
      label: "Deductions",
      align: "right" as const,
      render: (val: unknown) => `PKR ${Number(val || 0).toLocaleString()}`,
    },
    {
      key: "net",
      label: "Net pay",
      align: "right" as const,
      render: (val: unknown) => (
        <span className="font-semibold" style={{ color: "var(--ink)" }}>
          PKR {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: () => <StatusBadge status="finalized" />,
    },
    {
      key: "actions",
      label: "",
      align: "right" as const,
      render: (_: unknown, row: Record<string, unknown>) => (
        <button
          onClick={() => setSelectedSlip(row)}
          className="text-xs font-medium px-3 py-1.5 rounded"
          style={{ background: "var(--primary)", color: "var(--on-primary)" }}
        >
          View & download
        </button>
      ),
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <PageHeader title="Payslips" subtitle="Your official salary slips and earnings history" />

      <DataTable
        columns={columns}
        data={payslips}
        loading={loading}
        emptyTitle="No payslips yet"
        emptyDescription="Your payslip appears here after Admin finalizes the month."
      />

      {/* Official Printable Payslip Document Model (DESIGN.md Section 8) */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white text-gray-900 rounded-2xl max-w-xl w-full p-8 shadow-2xl space-y-6 my-auto print:m-0 print:p-0 print:shadow-none print:w-full">
            {/* Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-emerald-900">HCM Lite Corp</h2>
                <p className="text-xs text-gray-500">Official Monthly Salary Statement</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold uppercase text-emerald-800 tracking-wider">PAYSLIP</span>
                <p className="text-xs text-gray-500">{String(selectedSlip.month || "October 2026")}</p>
              </div>
            </div>

            {/* Employee Block */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-500">Employee Name</p>
                <p className="font-semibold text-gray-800">{user?.name || user?.email || "Employee"}</p>
              </div>
              <div>
                <p className="text-gray-500">Employee Code</p>
                <p className="font-semibold text-gray-800">{String(selectedSlip.employeeCode || "EMP-101")}</p>
              </div>
              <div>
                <p className="text-gray-500">Department</p>
                <p className="font-semibold text-gray-800">{String(selectedSlip.department || "Engineering")}</p>
              </div>
              <div>
                <p className="text-gray-500">Payable Days</p>
                <p className="font-semibold text-gray-800">{String(selectedSlip.payableDays || "22 / 22")}</p>
              </div>
            </div>

            {/* Earnings & Deductions Breakdown */}
            <div className="grid grid-cols-2 gap-6 text-xs">
              <div>
                <h4 className="font-bold border-b pb-1 text-gray-700">Earnings</h4>
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span className="tabular-nums">PKR {Number(selectedSlip.basic || 100000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>House Rent (40%)</span>
                    <span className="tabular-nums">PKR {Number(selectedSlip.hra || 40000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical (10%)</span>
                    <span className="tabular-nums">PKR {Number(selectedSlip.medical || 10000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Gross Pay</span>
                    <span className="tabular-nums">PKR {Number(selectedSlip.gross || 150000).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold border-b pb-1 text-gray-700">Deductions</h4>
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between">
                    <span>Unpaid / Absent</span>
                    <span className="tabular-nums">PKR {Number(selectedSlip.absentDeduction || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Income Tax</span>
                    <span className="tabular-nums">PKR {Number(selectedSlip.tax || 7500).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total Deductions</span>
                    <span className="tabular-nums">PKR {Number(selectedSlip.deductions || 7500).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay Callout */}
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-800 font-bold">Net Payable Salary</p>
                <p className="text-[11px] text-gray-500">Direct Bank Transfer</p>
              </div>
              <p className="text-2xl font-serif font-bold text-emerald-950 tabular-nums">
                PKR {Number(selectedSlip.net || 142500).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 print:hidden pt-2 border-t">
              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-800 hover:bg-emerald-900 text-white"
              >
                Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

