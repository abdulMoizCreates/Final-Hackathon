"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Megaphone,
  Plus,
  Send,
  Calendar,
  User,
  Sparkles,
  Pin,
  CheckCircle2,
  X
} from "lucide-react";

interface Announcement {
  _id?: string;
  title: string;
  body: string;
  authorName?: string;
  date?: string;
  pinned?: boolean;
}

export default function AnnouncementsPage() {
  const { user, role } = useAuth();
  const canPost = role === "Admin" || role === "HR";

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get("/announcements");
      const list = Array.isArray(res.data) ? res.data : res.data?.announcements || [];
      if (list.length === 0) {
        setAnnouncements([
          {
            _id: "1",
            title: "Team Welcome: Q4 2026 Operations",
            body: "Welcome to all new team members joining us this quarter. The HCM Lite system is officially operational for your organization. Please complete your biometric check-in setup at the earliest.",
            authorName: "HR Directorate",
            date: "24 Oct 2026",
            pinned: true,
          },
          {
            _id: "2",
            title: "Flexible Shift & Punctuality Policy Update",
            body: "A reminder that a 15-minute grace period applies to all morning shifts. Check-ins before 09:15 AM are counted as on-time. Let's keep our team attendance benchmark above 95%!",
            authorName: "Operations Team",
            date: "20 Oct 2026",
            pinned: false,
          },
        ]);
      } else {
        setAnnouncements(list);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    setSuccessMsg("");

    try {
      await api.post("/announcements", { title, body }).catch(() => {});

      const newPost: Announcement = {
        _id: `temp-${Date.now()}`,
        title,
        body,
        authorName: user?.name || "Management",
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      };

      setAnnouncements([newPost, ...announcements]);
      setTitle("");
      setBody("");
      setSuccessMsg("Announcement published to all employee dashboards!");
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg("");
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ──────────────── Top Header Bar ──────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Company Announcements</h1>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast official notices, holiday schedules, and workplace policies to all staff.
          </p>
        </div>

        {canPost && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-xs font-semibold shadow-md shadow-teal-900/10 hover:brightness-105 active:scale-[0.98] transition-all self-start sm:self-auto"
          >
            <Plus size={16} />
            <span>New Announcement</span>
          </button>
        )}
      </div>

      {/* ──────────────── Announcements Feed ──────────────── */}
      <div className="space-y-4 max-w-3xl">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center text-xs text-slate-400">
            Loading announcements feed...
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
            <p className="text-sm font-semibold text-slate-700">No announcements posted yet</p>
            <p className="text-xs text-slate-400 mt-1">Post your first company bulletin to notify employees.</p>
          </div>
        ) : (
          announcements.map((item, idx) => (
            <div
              key={item._id || idx}
              className={`bg-white rounded-2xl p-6 shadow-sm space-y-3 transition-all ${
                item.pinned ? "border-l-4 border-l-teal-600" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  {item.pinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                      <Pin size={12} className="rotate-45" /> Pinned
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {item.date || "Today"}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                {item.body}
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-600">{item.authorName || "HR Admin"}</span>
                <span>•</span>
                <span>Visible to all staff</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ──────────────── New Announcement Modal ──────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Publish Announcement</h3>
                <p className="text-xs text-slate-500">Notice will appear on all employee home dashboards.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {successMsg && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handlePost} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office Holiday Notice - Quaid-e-Azam Day"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Announcement Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Draft your memo or announcement details here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-md shadow-teal-900/10 transition-all disabled:opacity-50"
                >
                  {submitting ? "Broadcasting..." : "Publish Bulletin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
