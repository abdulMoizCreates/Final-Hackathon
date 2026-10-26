import Attendance from "../models/Attendance.js";
import LeaveRequest from "../models/LeaveRequest.js";
import PayrollRun from "../models/PayrollRun.js";

/**
 * Function-calling tools for the HCM Lite assistant.
 *
 * Every tool is scoped by the authenticated user's role, resolved server-side
 * from the verified JWT (never from client-provided input). Tool results are
 * small (capped rows) and contain no salary data unless the role allows it.
 */

const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Unpaid"];
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const TOOL_DECLARATIONS = [
  {
    functionDeclarations: [
      {
        name: "get_my_attendance",
        description:
          "Reads the signed-in user's OWN attendance ledger for one month: day counts by status and the most recent days.",
        parameters: {
          type: "OBJECT",
          properties: {
            month: {
              type: "STRING",
              description: "Optional month as YYYY-MM. Defaults to the current month.",
            },
          },
        },
      },
      {
        name: "get_my_leave_requests",
        description:
          "Reads the signed-in user's OWN recent leave requests with their current status.",
        parameters: { type: "OBJECT", properties: {} },
      },
      {
        name: "draft_leave_request",
        description:
          "Prepares (does NOT submit) a leave-request draft for the signed-in user from natural language. Returns the structured draft for the user to confirm or edit in the chat UI.",
        parameters: {
          type: "OBJECT",
          properties: {
            type: {
              type: "STRING",
              enum: LEAVE_TYPES,
              description: "Leave type.",
            },
            startDate: {
              type: "STRING",
              description: "First day of leave, YYYY-MM-DD.",
            },
            endDate: {
              type: "STRING",
              description: "Last day of leave (inclusive), YYYY-MM-DD.",
            },
            reason: {
              type: "STRING",
              description: "Short reason, in the user's own words.",
            },
          },
          required: ["type", "startDate", "endDate", "reason"],
        },
      },
      {
        name: "get_pending_leave_requests",
        description:
          "Lists leave requests waiting for HR approval. HR and Admin only.",
        parameters: { type: "OBJECT", properties: {} },
      },
      {
        name: "get_late_today",
        description:
          "Lists employees recorded late today. HR and Admin only.",
        parameters: { type: "OBJECT", properties: {} },
      },
      {
        name: "get_payroll_draft_status",
        description:
          "Shows one month's payroll run status and totals. HR and Admin only — never available to Employees.",
        parameters: {
          type: "OBJECT",
          properties: {
            month: {
              type: "STRING",
              description: "Optional month as YYYY-MM. Defaults to the latest run.",
            },
          },
        },
      },
    ],
  },
];

const pad2 = (n) => String(n).padStart(2, "0");

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function lastDayOfMonth(month) {
  const [y, m] = month.split("-").map(Number);
  return `${month}-${pad2(new Date(y, m, 0).getDate())}`;
}

function daysBetweenInclusive(start, end) {
  const a = new Date(`${start}T00:00:00Z`);
  const b = new Date(`${end}T00:00:00Z`);
  return Math.floor((b - a) / 86_400_000) + 1;
}

const noEmployeeProfile = () => ({
  ok: false,
  error:
    "This account has no linked employee profile, so personal records cannot be read.",
});

/** HR/Admin gate — returns an error object when the role is not allowed. */
function requireRoles(user, roles) {
  if (!roles.includes(user.role)) {
    return {
      ok: false,
      error: `Role ${user.role} is not permitted to use this tool. Available to: ${roles.join(" and ")}.`,
    };
  }
  return null;
}

async function getMyAttendance(args, user) {
  if (!user.employeeId) return noEmployeeProfile();
  const month = MONTH_RE.test(args?.month ?? "") ? args.month : currentMonth();
  const rows = await Attendance.find({
    employeeId: user.employeeId,
    date: { $gte: `${month}-01`, $lte: lastDayOfMonth(month) },
  })
    .sort({ date: 1 })
    .limit(31)
    .lean();

  const totals = { present: 0, late: 0, half_day: 0, absent: 0, on_leave: 0, missing_checkout: 0 };
  for (const r of rows) if (r.status in totals) totals[r.status] += 1;

  const recent = rows.slice(-10).map((r) => ({
    date: r.date,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    status: r.status,
    workedMinutes: r.workedMinutes,
  }));

  return { ok: true, data: { month, totals, recent } };
}

async function getMyLeaveRequests(user) {
  if (!user.employeeId) return noEmployeeProfile();
  const rows = await LeaveRequest.find({ employeeId: user.employeeId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  return {
    ok: true,
    data: {
      requests: rows.map((r) => ({
        type: r.type,
        startDate: r.startDate,
        endDate: r.endDate,
        days: r.days,
        reason: r.reason,
        status: r.status,
      })),
    },
  };
}

async function draftLeaveRequest(args, user) {
  if (!user.employeeId) return noEmployeeProfile();
  const type = typeof args?.type === "string" ? args.type.trim() : "";
  const startDate = typeof args?.startDate === "string" ? args.startDate.trim() : "";
  const endDate = typeof args?.endDate === "string" ? args.endDate.trim() : "";
  const reason = typeof args?.reason === "string" ? args.reason.trim() : "";

  if (!LEAVE_TYPES.includes(type)) {
    return { ok: false, error: `Leave type must be one of: ${LEAVE_TYPES.join(", ")}.` };
  }
  if (!DATE_RE.test(startDate) || !DATE_RE.test(endDate)) {
    return { ok: false, error: "Dates must be in YYYY-MM-DD format." };
  }
  if (startDate > endDate) {
    return { ok: false, error: "Start date must be on or before the end date." };
  }
  if (startDate < todayStr()) {
    return { ok: false, error: "Leave cannot start in the past." };
  }
  if (reason.length < 3 || reason.length > 200) {
    return { ok: false, error: "Please provide a short reason (3-200 characters)." };
  }

  const days = daysBetweenInclusive(startDate, endDate);
  return {
    ok: true,
    data: {
      draft: { type, startDate, endDate, days, reason },
      note: "Draft only — nothing has been submitted. The user must confirm or edit it in the chat UI.",
    },
  };
}

async function getPendingLeaveRequests(user) {
  const denied = requireRoles(user, ["HR", "Admin"]);
  if (denied) return denied;
  const rows = await LeaveRequest.find({ status: "pending" })
    .sort({ createdAt: 1 })
    .limit(10)
    .lean();
  return {
    ok: true,
    data: {
      count: rows.length,
      requests: rows.map((r) => ({
        employeeName: r.employeeName,
        type: r.type,
        startDate: r.startDate,
        endDate: r.endDate,
        days: r.days,
        reason: r.reason,
      })),
    },
  };
}

async function getLateToday(user) {
  const denied = requireRoles(user, ["HR", "Admin"]);
  if (denied) return denied;
  const rows = await Attendance.find({ date: todayStr(), isLate: true })
    .sort({ checkIn: 1 })
    .limit(10)
    .lean();
  return {
    ok: true,
    data: {
      date: todayStr(),
      count: rows.length,
      late: rows.map((r) => ({
        employeeName: r.employeeName,
        department: r.department,
        checkIn: r.checkIn,
        status: r.status,
      })),
    },
  };
}

async function getPayrollDraftStatus(args, user) {
  const denied = requireRoles(user, ["HR", "Admin"]);
  if (denied) return denied;
  const month = MONTH_RE.test(args?.month ?? "") ? args.month : null;
  const run = month
    ? await PayrollRun.findOne({ month }).lean()
    : await PayrollRun.findOne().sort({ month: -1 }).lean();
  if (!run) {
    return { ok: true, data: { message: month ? `No payroll run exists for ${month}.` : "No payroll runs exist yet." } };
  }
  return {
    ok: true,
    data: {
      month: run.month,
      status: run.status,
      employeeCount: run.employeeCount,
      totalGross: run.totalGross,
      totalDeductions: run.totalDeductions,
      totalTax: run.totalTax,
      totalNet: run.totalNet,
      finalizedAt: run.finalizedAt,
    },
  };
}

/**
 * Executes one tool call under the authenticated user's scope.
 * Always resolves with { ok: true, data } or { ok: false, error } so the
 * model can relay limitations honestly instead of guessing.
 */
export async function executeTool(name, args, user) {
  try {
    switch (name) {
      case "get_my_attendance":
        return await getMyAttendance(args, user);
      case "get_my_leave_requests":
        return await getMyLeaveRequests(user);
      case "draft_leave_request":
        return await draftLeaveRequest(args, user);
      case "get_pending_leave_requests":
        return await getPendingLeaveRequests(user);
      case "get_late_today":
        return await getLateToday(user);
      case "get_payroll_draft_status":
        return await getPayrollDraftStatus(args, user);
      default:
        return { ok: false, error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    console.error(`[assistant] tool ${name} failed:`, err.message);
    return { ok: false, error: "The tool could not read the ledger. Please try again." };
  }
}
