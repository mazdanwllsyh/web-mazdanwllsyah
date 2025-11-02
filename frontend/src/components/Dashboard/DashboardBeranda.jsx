import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useUser } from "../../context/UserContext";
import { usePortfolioData } from "../../context/PortofolioDataContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Tooltip,
  Legend,
  Title,
  BarElement,
  CategoryScale,
  LinearScale
);

const QuickLinkSkeleton = () => (
  <div className="card bg-base-200 shadow-lg">
    <div className="card-body">
      <div className="skeleton h-10 w-10 opacity-70"></div>
      <div className="skeleton h-8 w-1/4 self-end"></div>
      <div className="skeleton h-6 w-1/2 mt-4"></div>
    </div>
  </div>
);

function DashboardBeranda() {
  const { user } = useUser();
  const userName = user ? user.fullName.split(" ")[0] : "Editor";

  const {
    projects,
    sertifikatData,
    historyData,
    skillsData,
    isProjectsLoading,
    isSertifikatLoading,
    isHistoryLoading,
    isSkillsLoading,
  } = usePortfolioData();

  const quickLinks = [
    {
      name: "Data Saya",
      path: "/dashboard/sitedata", //
      icon: "mdi:database-edit-outline",
      count: null,
      loading: isHistoryLoading,
      bg: "bg-primary",
    },
    {
      name: "Edit Galeri",
      path: "/dashboard/galeriedit",
      icon: "mdi:image-multiple-outline",
      count: projects.length,
      loading: isProjectsLoading,
      bg: "bg-success",
    },
    {
      name: "Edit Sertifikat",
      path: "/dashboard/sertifikatsaya",
      icon: "ph:certificate",
      count: sertifikatData.length,
      loading: isSertifikatLoading,
      bg: "bg-warning",
    },
    {
      name: "Edit History",
      path: "/dashboard/configuration",
      icon: "mdi:timeline-text-outline",
      count: historyData.education.length + historyData.experience.length,
      loading: isHistoryLoading,
      bg: "bg-info",
    },
  ];

  const chartData = {
    labels: ["Proyek", "Sertifikat", "History", "Hard Skills"],
    datasets: [
      {
        label: "Total Konten",
        data: [
          projects.length,
          sertifikatData.length,
          historyData.education.length + historyData.experience.length,
          skillsData.hardSkills.length,
        ],
        backgroundColor: [
          "rgba(52, 211, 153, 0.6)",
          "rgba(250, 204, 21, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(244, 63, 94, 0.6)",
        ],
        borderColor: [
          "rgba(52, 211, 153, 1)",
          "rgba(250, 204, 21, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(244, 63, 94, 1)",
        ],
        borderWidth: 1.5,
      },
    ],
  };

  const customFontStack = `"SF UI Text", system-ui, -apple-system, sans-serif`;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Ringkasan Konten Website",
        color: "hsl(var(--bc))",
        font: {
          size: 16,
          family: customFontStack,
        },
      },
      tooltip: {
        titleFont: { family: customFontStack },
        bodyFont: { family: customFontStack },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "hsl(var(--bc))",
          font: { family: customFontStack },
          stepSize: 1,
        },
        grid: {
          color: "hsl(var(--b3))",
        },
      },
      x: {
        ticks: {
          color: "hsl(var(--bc))",
          font: { family: customFontStack },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  const allLoading =
    isProjectsLoading ||
    isSertifikatLoading ||
    isHistoryLoading ||
    isSkillsLoading;

  return (
    <div className="space-y-6">
      <div className="hidden lg:block p-8 bg-base-100 border border-primary rounded-lg shadow-md max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-display">
          Selamat Datang di Dashboard, {userName}!
        </h1>
        <p className="mt-2 text-lg">
          Gunakan sidebar di sebelah kiri atau link cepat di bawah untuk
          mengedit konten.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold">Akses Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) =>
              allLoading ? (
                <QuickLinkSkeleton key={link.path} />
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`card ${link.bg} text-primary-content shadow-md transform transition-transform duration-300 hover:shadow-lg`}
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <Icon icon={link.icon} className="w-10 h-10 opacity-80" />
                      {link.count !== null && (
                        <span className="text-5xl font-bold">{link.count}</span>
                      )}
                    </div>
                    <h3 className="card-title mt-4">{link.name}</h3>
                  </div>
                </Link>
              )
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-2xl font-display font-bold mb-4">
            Ringkasan Konten
          </h2>
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body h-[400px]">
              {allLoading ? (
                <div className="flex justify-center items-center h-64">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardBeranda;
