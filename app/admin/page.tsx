"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sun,
  LayoutDashboard,
  FileText,
  MessageSquare,
  FolderKanban,
  LogOut,
  Search,
  Plus,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  Zap,
  Globe,
  X,
  Filter,
  AlertTriangle,
  ExternalLink,
  SlidersHorizontal,
  Menu,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Activity,
  Layers,
} from "lucide-react";

interface Quote {
  id: string;
  install_type: string;
  surface_m2: number;
  steg_monthly_bill: number;
  gouvernorat: string;
  full_name: string;
  phone_number: string;
  email: string;
  steg_file_url?: string;
  status: string;
  created_at: string;
}

interface Message {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  message: string;
  status: string;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  gouvernorat: string;
  power_capacity: string;
  metric_label: string;
  description: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "quotes" | "messages" | "projects">("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data states
  const [stats, setStats] = useState({
    totalQuotes: 0,
    newQuotes: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalProjects: 0,
  });

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Filters & Search
  const [quotesFilter, setQuotesFilter] = useState("ALL");
  const [messagesFilter, setMessagesFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Résidentiel",
    gouvernorat: "Monastir",
    power_capacity: "10 kWc",
    metric_label: "Puissance",
    description: "",
    image_url: "",
    published: true,
  });
  const [submittingProject, setSubmittingProject] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const [adminUserEmail, setAdminUserEmail] = useState("Admin");

  // 1. Verify Authentication
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      const meData = await res.json();
      if (meData?.user?.email) {
        setAdminUserEmail(meData.user.email);
      }
      setLoadingAuth(false);
      fetchAllData();
    } catch {
      router.push("/admin/login");
    }
  };

  // 2. Fetch Data
  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      const [sRes, qRes, mRes, pRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/quotes"),
        fetch("/api/admin/messages"),
        fetch("/api/admin/projects"),
      ]);

      if (sRes.ok) setStats(await sRes.json());
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuotes(qData.quotes || []);
      }
      if (mRes.ok) {
        const mData = await mRes.json();
        setMessages(mData.messages || []);
      }
      if (pRes.ok) {
        const pData = await pRes.json();
        setProjects(pData.projects || []);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Quotes Actions
  const updateQuoteStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
        );
        if (selectedQuote?.id === id) {
          setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast("Statut du devis mis à jour !");
      }
    } catch (err) {
      console.error("Failed to update quote status", err);
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette demande de devis ?")) return;
    try {
      const res = await fetch(`/api/admin/quotes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setQuotes((prev) => prev.filter((q) => q.id !== id));
        if (selectedQuote?.id === id) setSelectedQuote(null);
        showToast("Devis supprimé avec succès.");
      }
    } catch (err) {
      console.error("Failed to delete quote", err);
    }
  };

  // Messages Actions
  const updateMessageStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast("Statut du message mis à jour !");
      }
    } catch (err) {
      console.error("Failed to update message status", err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
        showToast("Message supprimé.");
      }
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  // Projects Actions
  const toggleProjectPublished = async (id: string, currentPublished: boolean) => {
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, published: !currentPublished }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: !currentPublished } : p))
        );
        showToast(currentPublished ? "Projet masqué." : "Projet publié en ligne !");
      }
    } catch (err) {
      console.error("Failed to update project", err);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette réalisation ?")) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showToast("Réalisation supprimée.");
      }
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProject(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });

      const data = await res.json();
      if (res.ok && data.project) {
        setProjects([data.project, ...projects]);
        setIsProjectModalOpen(false);
        setNewProject({
          title: "",
          category: "Résidentiel",
          gouvernorat: "Monastir",
          power_capacity: "10 kWc",
          metric_label: "Puissance",
          description: "",
          image_url: "",
          published: true,
        });
        showToast("Nouveau projet ajouté avec succès !");
      } else {
        alert(data.error || "Erreur lors de l'ajout");
      }
    } catch (err) {
      console.error("Error creating project", err);
    } finally {
      setSubmittingProject(false);
    }
  };

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(""), 3000);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white font-inter">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin shadow-lg shadow-amber-400/20" />
          <p className="text-slate-400 text-sm font-medium">Initialisation du Dashboard SMS Solaire...</p>
        </div>
      </div>
    );
  }

  // Filter Logic
  const filteredQuotes = quotes.filter((q) => {
    const matchesStatus = quotesFilter === "ALL" || q.status === quotesFilter;
    const matchesSearch =
      q.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.gouvernorat.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredMessages = messages.filter((m) => {
    const matchesStatus = messagesFilter === "ALL" || m.status === messagesFilter;
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const newQuotesCount = quotes.filter((q) => q.status === "NEW").length;
  const unreadMessagesCount = messages.filter((m) => m.status === "UNREAD").length;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-inter flex flex-col md:flex-row relative selection:bg-amber-400 selection:text-slate-950">
      {/* Toast alert */}
      {actionSuccess && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold px-5 py-3.5 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center gap-3 animate-fade-in border border-emerald-400/30">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Navigation Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/20">
              <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="font-montserrat font-extrabold text-white text-base tracking-tight leading-tight flex items-center gap-1.5">
                SMS SOLAIRE
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  ADMIN PANEL
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="p-4 flex-1 space-y-6 overflow-y-auto">
          {/* Main Navigation Section */}
          <div>
            <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
              Menu Principal
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/50 scale-[1.01]"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-amber-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className={`w-5 h-5 ${activeTab === "overview" ? "text-slate-950" : "text-amber-400"}`} />
                  <span>Vue d'ensemble</span>
                </div>
                {activeTab === "overview" && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>

              <button
                onClick={() => {
                  setActiveTab("quotes");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  activeTab === "quotes"
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/50 scale-[1.01]"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-amber-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`w-5 h-5 ${activeTab === "quotes" ? "text-slate-950" : "text-amber-400"}`} />
                  <span>Devis & Leads</span>
                </div>
                {newQuotesCount > 0 && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-sm ${
                      activeTab === "quotes"
                        ? "bg-slate-950 text-amber-400"
                        : "bg-amber-400 text-slate-950 shadow-amber-400/30 animate-pulse"
                    }`}
                  >
                    {newQuotesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab("messages");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  activeTab === "messages"
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/50 scale-[1.01]"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-amber-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={`w-5 h-5 ${activeTab === "messages" ? "text-slate-950" : "text-amber-400"}`} />
                  <span>Messages Client</span>
                </div>
                {unreadMessagesCount > 0 && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-extrabold shadow-sm ${
                      activeTab === "messages"
                        ? "bg-slate-950 text-blue-400"
                        : "bg-blue-500 text-white shadow-blue-500/30"
                    }`}
                  >
                    {unreadMessagesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveTab("projects");
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  activeTab === "projects"
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/50 scale-[1.01]"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-amber-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderKanban className={`w-5 h-5 ${activeTab === "projects" ? "text-slate-950" : "text-amber-400"}`} />
                  <span>Réalisations</span>
                </div>
                {activeTab === "projects" && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>
            </div>
          </div>

          {/* Quick Info Badge */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Tableau de bord live</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Base de données synchronisée. Toutes vos modifications sont appliquées instantanément.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700"
          >
            <Globe className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Voir le site public</span>
            <ExternalLink className="w-3.5 h-3.5 ml-auto text-slate-500" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-6 backdrop-blur-xl sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-amber-400">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <h1 className="text-sm sm:text-base font-bold font-montserrat text-white">
                {activeTab === "overview" && "Vue d'ensemble"}
                {activeTab === "quotes" && "Demandes de Devis"}
                {activeTab === "messages" && "Messages Clientèle"}
                {activeTab === "projects" && "Catalogue Réalisations"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              disabled={loadingData}
              className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-2 text-xs font-semibold"
              title="Actualiser les données"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden sm:inline">Actualiser</span>
            </button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            {/* Profile pill */}
            <div className="flex items-center gap-2.5 bg-slate-950/60 border border-slate-800 rounded-full py-1 px-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-black text-[11px] shadow-sm">
                A
              </div>
              <span className="text-xs text-slate-200 font-semibold hidden sm:inline">
                {adminUserEmail}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => {
                    setActiveTab("quotes");
                    setQuotesFilter("NEW");
                  }}
                  className="bg-slate-900/90 border border-slate-800/80 hover:border-amber-500/50 p-5 rounded-2xl cursor-pointer transition-all shadow-xl hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Nouveaux Devis
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-montserrat text-white">
                      {quotes.filter((q) => q.status === "NEW").length}
                    </span>
                    <span className="text-xs text-slate-400">
                      sur {quotes.length} au total
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab("messages");
                    setMessagesFilter("UNREAD");
                  }}
                  className="bg-slate-900/90 border border-slate-800/80 hover:border-blue-500/50 p-5 rounded-2xl cursor-pointer transition-all shadow-xl hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Messages Non Lus
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-montserrat text-white">
                      {messages.filter((m) => m.status === "UNREAD").length}
                    </span>
                    <span className="text-xs text-slate-400">
                      sur {messages.length} au total
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("projects")}
                  className="bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/50 p-5 rounded-2xl cursor-pointer transition-all shadow-xl hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Projets Publiés
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-montserrat text-white">
                      {projects.filter((p) => p.published).length}
                    </span>
                    <span className="text-xs text-slate-400">
                      sur {projects.length} enregistrés
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800/80 p-5 rounded-2xl shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Demandes Traitées
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-montserrat text-white">
                      {quotes.filter((q) => q.status === "COMPLETED").length}
                    </span>
                    <span className="text-xs text-slate-400">devis finalisés</span>
                  </div>
                </div>
              </div>

              {/* Recent Quotes & Messages tables split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Quotes */}
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-montserrat font-bold text-white text-base flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-400" />
                      Dernières demandes de devis
                    </h3>
                    <button
                      onClick={() => setActiveTab("quotes")}
                      className="text-xs text-amber-400 hover:text-amber-300 hover:underline font-bold"
                    >
                      Tout voir →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {quotes.slice(0, 5).map((q) => (
                      <div
                        key={q.id}
                        onClick={() => setSelectedQuote(q)}
                        className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-slate-700 cursor-pointer transition-all"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{q.full_name}</p>
                          <p className="text-xs text-slate-400">
                            {q.install_type} • {q.gouvernorat}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                              q.status === "NEW"
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : q.status === "IN_PROGRESS"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : q.status === "COMPLETED"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {q.status === "NEW" ? "Nouveau" : q.status}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {new Date(q.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    ))}
                    {quotes.length === 0 && (
                      <p className="text-sm text-slate-500 py-4 text-center">
                        Aucune demande de devis pour le moment.
                      </p>
                    )}
                  </div>
                </div>

                {/* Recent Messages */}
                <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-montserrat font-bold text-white text-base flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      Derniers messages reçus
                    </h3>
                    <button
                      onClick={() => setActiveTab("messages")}
                      className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-bold"
                    >
                      Tout voir →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {messages.slice(0, 5).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMessage(m)}
                        className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-slate-700 cursor-pointer transition-all"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{m.full_name}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{m.message}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-[11px] px-2.5 py-1 rounded-full font-bold ${
                              m.status === "UNREAD"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {m.status === "UNREAD" ? "Non lu" : "Lu"}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {new Date(m.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <p className="text-sm text-slate-500 py-4 text-center">
                        Aucun message reçu.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QUOTES TAB */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  {["ALL", "NEW", "IN_PROGRESS", "COMPLETED", "REJECTED"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setQuotesFilter(st)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        quotesFilter === st
                          ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                          : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {st === "ALL" && "Tous les devis"}
                      {st === "NEW" && "Nouveaux"}
                      {st === "IN_PROGRESS" && "En cours"}
                      {st === "COMPLETED" && "Finalisés"}
                      {st === "REJECTED" && "Rejetés"}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Rechercher nom, email, tél..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Table of Quotes */}
              <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800/80">
                      <tr>
                        <th className="p-4">Client</th>
                        <th className="p-4">Installation & Surface</th>
                        <th className="p-4">Facture STEG</th>
                        <th className="p-4">Gouvernorat</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Statut</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredQuotes.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-white">{q.full_name}</p>
                            <p className="text-[11px] text-slate-400">{q.phone_number}</p>
                            <p className="text-[11px] text-slate-500">{q.email}</p>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-slate-200">{q.install_type}</span>
                            <p className="text-slate-400">{q.surface_m2} m² surface</p>
                          </td>
                          <td className="p-4 font-mono font-bold text-amber-400">
                            {q.steg_monthly_bill} TND/mois
                          </td>
                          <td className="p-4">{q.gouvernorat}</td>
                          <td className="p-4 text-slate-400">
                            {new Date(q.created_at).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="p-4">
                            <select
                              value={q.status}
                              onChange={(e) => updateQuoteStatus(q.id, e.target.value)}
                              className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-2.5 py-1.5 focus:border-amber-500 outline-none font-bold cursor-pointer text-white"
                            >
                              <option value="NEW">🟡 Nouveau</option>
                              <option value="IN_PROGRESS">🔵 En cours</option>
                              <option value="COMPLETED">🟢 Finalisé</option>
                              <option value="REJECTED">🔴 Rejeté</option>
                            </select>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedQuote(q)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                              title="Voir les détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteQuote(q.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredQuotes.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-slate-500">
                            Aucune demande de devis ne correspond à la recherche.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === "messages" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-2">
                  {["ALL", "UNREAD", "READ"].map((st) => (
                    <button
                      key={st}
                      onClick={() => setMessagesFilter(st)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        messagesFilter === st
                          ? "bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20"
                          : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700"
                      }`}
                    >
                      {st === "ALL" && "Tous les messages"}
                      {st === "UNREAD" && "Non lus"}
                      {st === "READ" && "Lus"}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Rechercher un message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all hover:-translate-y-1 ${
                      m.status === "UNREAD"
                        ? "border-blue-500/50"
                        : "border-slate-800/80 opacity-80"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-white text-sm">{m.full_name}</h4>
                          <p className="text-xs text-slate-400">{m.email}</p>
                          <p className="text-xs text-slate-400">{m.phone_number}</p>
                        </div>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                            m.status === "UNREAD"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {m.status === "UNREAD" ? "NON LU" : "LU"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 italic">
                        "{m.message}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-500">
                        {new Date(m.created_at).toLocaleDateString("fr-FR")}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateMessageStatus(
                              m.id,
                              m.status === "UNREAD" ? "READ" : "UNREAD"
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all"
                        >
                          {m.status === "UNREAD" ? "Marquer Lu" : "Non lu"}
                        </button>
                        <button
                          onClick={() => deleteMessage(m.id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/90 border border-slate-800/80 rounded-2xl">
                    Aucun message correspondant.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800/80 p-5 rounded-2xl shadow-xl">
                <div>
                  <h3 className="font-montserrat font-bold text-white text-lg">
                    Réalisations Solar
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Gérez vos installations visibles sur le site public
                  </p>
                </div>
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="py-2.5 px-5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau Projet
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-transform"
                  >
                    <div className="relative h-48 bg-slate-950 overflow-hidden">
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).setAttribute(
                            "src",
                            "https://images.unsplash.com/photo-1508873696983-2df515122519?w=600&auto=format&fit=crop"
                          );
                        }}
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-800">
                          {p.category}
                        </span>
                        <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                          {p.power_capacity}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">{p.title}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          {p.gouvernorat}
                        </p>
                        <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => toggleProjectPublished(p.id, p.published)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                            p.published
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          {p.published ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              Publié en ligne
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              Masqué (Brouillon)
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => deleteProject(p.id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                          title="Supprimer la réalisation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/90 border border-slate-800/80 rounded-2xl">
                    <FolderKanban className="w-12 h-12 mx-auto text-slate-700 mb-3" />
                    <p className="text-sm font-bold text-white">Aucun projet dans le catalogue</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Cliquez sur "Nouveau Projet" pour ajouter votre première réalisation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: View Quote Detail */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedQuote(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Détails du Devis</h3>
                <p className="text-xs text-slate-400">
                  Reçu le {new Date(selectedQuote.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="space-y-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Nom du Client
                  </span>
                  <p className="font-bold text-white text-sm mt-0.5">{selectedQuote.full_name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Gouvernorat
                  </span>
                  <p className="font-semibold text-white text-sm mt-0.5">{selectedQuote.gouvernorat}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Téléphone
                  </span>
                  <p className="font-bold text-amber-400 text-sm mt-0.5">{selectedQuote.phone_number}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Adresse Email
                  </span>
                  <p className="font-semibold text-slate-200 text-xs truncate mt-0.5">{selectedQuote.email}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Type d'Installation
                  </span>
                  <p className="font-semibold text-white mt-0.5">{selectedQuote.install_type}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Surface Toiture / Sol
                  </span>
                  <p className="font-semibold text-white mt-0.5">{selectedQuote.surface_m2} m²</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    Facture Mensuelle STEG
                  </span>
                  <p className="font-mono font-extrabold text-amber-400 text-base mt-0.5">
                    {selectedQuote.steg_monthly_bill} TND / mois
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Statut:</span>
                <select
                  value={selectedQuote.status}
                  onChange={(e) => updateQuoteStatus(selectedQuote.id, e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white font-bold outline-none"
                >
                  <option value="NEW">🟡 Nouveau</option>
                  <option value="IN_PROGRESS">🔵 En cours</option>
                  <option value="COMPLETED">🟢 Finalisé</option>
                  <option value="REJECTED">🔴 Rejeté</option>
                </select>
              </div>

              <button
                onClick={() => deleteQuote(selectedQuote.id)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl transition-all border border-red-500/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View Message Detail */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Message de {selectedMessage.full_name}</h3>
                <p className="text-xs text-slate-400">
                  Reçu le {new Date(selectedMessage.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 text-xs">
              <p className="text-slate-300">
                <strong className="text-white font-semibold">Email:</strong> {selectedMessage.email}
              </p>
              <p className="text-slate-300">
                <strong className="text-white font-semibold">Téléphone:</strong> {selectedMessage.phone_number}
              </p>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Message:</span>
                <p className="mt-1 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-normal">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() =>
                  updateMessageStatus(
                    selectedMessage.id,
                    selectedMessage.status === "UNREAD" ? "READ" : "UNREAD"
                  )
                }
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold rounded-xl"
              >
                {selectedMessage.status === "UNREAD" ? "Marquer comme Lu" : "Marquer comme Non Lu"}
              </button>
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs rounded-xl border border-red-500/20"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Project */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <FolderKanban className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Ajouter une Réalisation</h3>
                <p className="text-xs text-slate-400">
                  Publication dans la galerie des projets SMS Solaire
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Titre du Projet</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Installation Solaire Villa Monastir"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Catégorie</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="Résidentiel">Résidentiel</option>
                    <option value="Tertiaire">Tertiaire / Commercial</option>
                    <option value="Industriel">Industriel</option>
                    <option value="Pompage Solaire">Pompage Solaire</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Gouvernorat</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Monastir, Sousse, Mahdia..."
                    value={newProject.gouvernorat}
                    onChange={(e) => setNewProject({ ...newProject, gouvernorat: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Puissance Installée</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 15 kWc, 100 kWc..."
                    value={newProject.power_capacity}
                    onChange={(e) => setNewProject({ ...newProject, power_capacity: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">URL de l'image</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newProject.image_url}
                    onChange={(e) => setNewProject({ ...newProject, image_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Décrivez l'installation, les panneaux photovoltaïques utilisés et l'économie générée..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="publishedCheck"
                  checked={newProject.published}
                  onChange={(e) => setNewProject({ ...newProject, published: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-800 cursor-pointer"
                />
                <label htmlFor="publishedCheck" className="text-slate-300 font-bold cursor-pointer">
                  Publier directement sur la galerie du site
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submittingProject}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20"
                >
                  {submittingProject ? "Ajout..." : "Créer le Projet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
