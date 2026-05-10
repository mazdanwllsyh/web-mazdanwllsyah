import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useAuth } from "../../hooks/useAuth";
import { usePortfolioStore } from "../../stores/portfolioStore";
import { useProjectStore } from "../../stores/projectStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const QuickLinkSkeleton = () => (
  <div className="card bg-base-200 shadow-lg border border-base-content/20">
    <div className="card-body">
      <div className="skeleton h-10 w-10 opacity-70"></div>
      <div className="skeleton h-8 w-1/4 self-end"></div>
      <div className="skeleton h-6 w-1/2 mt-4"></div>
    </div>
  </div>
);

function DashboardBeranda() {
  const { user } = useAuth();
  const userName = user ? user.fullName.split(" ")[0] : "Editor";

  const projects = useProjectStore((state) => state.projects);
  const isProjectsLoading = useProjectStore((state) => state.isProjectsLoading);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  const sertifikatData = usePortfolioStore((state) => state.sertifikatData);
  const historyData = usePortfolioStore((state) => state.historyData);
  const skillsData = usePortfolioStore((state) => state.skillsData);

  const isSertifikatLoading = usePortfolioStore((state) => state.isSertifikatLoading);
  const isHistoryLoading = usePortfolioStore((state) => state.isHistoryLoading);
  const isSkillsLoading = usePortfolioStore((state) => state.isSkillsLoading);

  const fetchSertifikat = usePortfolioStore((state) => state.fetchSertifikat);
  const fetchHistoryData = usePortfolioStore((state) => state.fetchHistoryData);
  const fetchSkillsData = usePortfolioStore((state) => state.fetchSkillsData);

  const [theme, setTheme] = useState(document.documentElement.getAttribute("data-theme") || "emerald");

  useEffect(() => {
    if (projects.length === 0) fetchProjects();
    if (sertifikatData.length === 0) fetchSertifikat();
    if (!historyData.education?.length && !historyData.experience?.length) fetchHistoryData();
    if (skillsData.hardSkills.length === 0) fetchSkillsData();

    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, [fetchProjects, fetchSertifikat, fetchHistoryData, fetchSkillsData, projects.length, sertifikatData.length]);

  const allLoading = isProjectsLoading || isSertifikatLoading || isHistoryLoading || isSkillsLoading;

  const quickLinks = [
    { name: "Data Saya", path: "/dashboard/sitedata", icon: "mdi:database-edit-outline", count: null, colorClass: "primary" },
    { name: "Edit Galeri", path: "/dashboard/galeriedit", icon: "mdi:image-multiple-outline", count: projects.length, colorClass: "success" },
    { name: "Edit Sertifikat", path: "/dashboard/sertifikatsaya", icon: "ph:certificate", count: sertifikatData.length, colorClass: "warning" },
    { name: "Edit History", path: "/dashboard/configuration", icon: "mdi:timeline-text-outline", count: (historyData.education?.length || 0) + (historyData.experience?.length || 0), colorClass: "info" },
  ];

  const chartData = [
    { name: "Proyek", total: projects.length, color: "var(--color-error)" },
    { name: "Sertifikat", total: sertifikatData.length, color: "var(--color-primary)" },
    { name: "History", total: (historyData.education?.length || 0) + (historyData.experience?.length || 0), color: "var(--color-accent)" },
    { name: "Skills", total: (skillsData.hardSkills?.length || 0), color: "var(--color-info)" },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100/90 backdrop-blur-md text-base-content p-4 border border-base-content/20 shadow-2xl rounded-2xl">
          <p className="font-black text-sm">{`${payload[0].payload.name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 pb-10">
      {/* Header dengan Glow Efek */}
      <div className="hidden lg:block p-12 bg-base-100 border border-base-content/20 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-black font-display tracking-tight text-base-content">
            Selamat Datang, <span className="text-primary">{userName}!</span>
          </h1>
          <p className="mt-4 text-xl text-base-content/50 font-medium max-w-2xl">
            Pantau perkembangan portofoliomu. Semuanya terkendali dalam satu dasbor.
          </p>
        </div>
      </div>

      <div className="space-y-10">
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-base-content/40 ml-2">Navigasi Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) =>
              allLoading ? (
                <QuickLinkSkeleton key={link.path} />
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group relative card bg-base-100 border border-base-content/20 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 rounded-3xl overflow-hidden"
                >
                  <div className={`absolute -top-6 -right-6 w-20 h-20 bg-${link.colorClass}/10 rounded-full transition-all duration-700 scale-[3] opacity-20 lg:scale-100 lg:opacity-10 lg:group-hover:scale-[3] lg:group-hover:opacity-20`}></div>

                  <div className="card-body p-8 relative z-10">
                    <div className="flex justify-between items-center">
                      <div className={`text-${link.colorClass} transition-transform duration-500 lg:group-hover:scale-110`}>
                        <Icon icon={link.icon} className="w-10 h-10" />
                      </div>
                      {link.count !== null && (
                        <span className="text-4xl font-black opacity-100 lg:opacity-20 lg:group-hover:opacity-100 transition-opacity duration-500">
                          {link.count}
                        </span>
                      )}
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xs font-black uppercase tracking-widest text-base-content lg:text-base-content/60 lg:group-hover:text-base-content transition-colors">
                        {link.name}
                      </h3>
                      <div className={`h-1.5 w-full lg:w-8 bg-${link.colorClass} mt-3 rounded-full transition-all duration-500 lg:group-hover:w-full`}></div>
                    </div>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>

        <div className="hidden lg:block space-y-6">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-base-content/40 ml-2">Analitik Data</h2>
          <div className="card bg-base-100 shadow-xl border border-base-content/20 rounded-[2.5rem] overflow-hidden">
            <div className="card-body h-[450px] p-10">
              {allLoading ? (
                <div className="flex justify-center items-center h-full">
                  <span className="loading loading-infinity loading-lg text-primary"></span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 15 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="currentColor"
                      className="opacity-10"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 700, opacity: 0.6 }}
                      dy={15}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.4 }}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ fill: 'currentColor', opacity: 0.05 }}
                    />
                    <Bar
                      dataKey="total"
                      radius={[15, 15, 5, 5]}
                      barSize={60}
                      animationDuration={2000}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardBeranda;