"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import Avatar from "@/components/ui/Avatar";

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const canPost = user?.role === "Admin" || user?.role === "HR";

  const [announcements, setAnnouncements] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchAnnouncements = () => {
    setLoading(true);
    api.get("/announcements")
      .then((r) => setAnnouncements(Array.isArray(r.data) ? r.data : r.data?.announcements || []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setPosting(true);
    setError("");
    try {
      await api.post("/announcements", { title, body });
      setTitle("");
      setBody("");
      setShowForm(false);
      fetchAnnouncements();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Could not post announcement.");
    } finally {
      setPosting(false);
    }
  };

  const inputStyle = {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
  };

  return (
    <>
      <PageHeader title="Announcements" subtitle="Company-wide updates and memos">
        {canPost && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            {showForm ? "Cancel" : "Post announcement"}
          </button>
        )}
      </PageHeader>

      {/* Form to Post Announcement */}
      {showForm && (
        <form onSubmit={handlePost} className="rounded-xl p-6 mb-8 space-y-4 max-w-2xl" style={{ background: "var(--surface)" }}>
          <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>New announcement</h3>
          {error && <p className="text-sm" style={{ color: "var(--st-absent-fg)" }}>{error}</p>}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Eid Holidays Announcement"
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-3)" }}>Details</label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type announcement message here..."
              className="w-full px-3 py-2 rounded-lg text-sm resize-none"
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={posting}
            className="px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--primary)", color: "var(--on-primary)" }}
          >
            {posting ? "Publishing..." : "Publish announcement"}
          </button>
        </form>
      )}

      {/* Announcements List */}
      <div className="space-y-4 max-w-3xl">
        {announcements.length === 0 && !loading && (
          <div className="rounded-xl p-6" style={{ background: "var(--surface)" }}>
            <EmptyState
              title="No announcements"
              description="Posts from HR and Admin appear here."
              action={canPost ? { label: "Post announcement", onClick: () => setShowForm(true) } : undefined}
            />
          </div>
        )}

        {announcements.map((item, index) => (
          <div key={index} className="rounded-xl p-6 space-y-3" style={{ background: "var(--surface)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={String(item.authorName || item.author || "HR")} size="sm" />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--ink)" }}>
                    {String(item.authorName || item.author || "Management")}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--ink-3)" }}>
                    {item.createdAt ? new Date(String(item.createdAt)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Today"}
                  </p>
                </div>
              </div>
            </div>
            <h4 className="text-base font-semibold" style={{ color: "var(--ink)" }}>
              {String(item.title || "Company Notice")}
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--ink-2)" }}>
              {String(item.body || item.content || "")}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

