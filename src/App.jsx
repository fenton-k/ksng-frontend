import React, { useState, useEffect } from "react";
import ProjectCard from "./components/ProjectCard";
import ProjectDetail from "./components/ProjectDetail";
import { useProjects } from "./hooks/useProjects";

function App() {
  const { projects, loading, error, categories } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showWeLove, setShowWeLove] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (!window.location.hash.includes("project-")) {
        setSelectedProject(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle project selection with URL state
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    window.history.pushState(
      { projectId: project.id },
      "",
      `#project-${project.id}`
    );
  };

  // Handle back button
  const handleBack = () => {
    setSelectedProject(null);
    window.history.pushState(null, "", window.location.pathname);
  };

  // Filter and sort projects
  useEffect(() => {
    let filtered = Object.values(projects);

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory
      );
    }

    if (showWeLove) {
      filtered = filtered.filter((project) => project.isProjectWeLove);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "percentFunded":
        filtered.sort((a, b) => {
          const aPercent =
            a.fundingHistory[a.fundingHistory.length - 1]?.percentFunded || 0;
          const bPercent =
            b.fundingHistory[b.fundingHistory.length - 1]?.percentFunded || 0;
          return bPercent - aPercent;
        });
        break;
      case "pledged":
        filtered.sort((a, b) => {
          const aPledged = parseFloat(
            a.fundingHistory[a.fundingHistory.length - 1]?.pledged || 0
          );
          const bPledged = parseFloat(
            b.fundingHistory[b.fundingHistory.length - 1]?.pledged || 0
          );
          return bPledged - aPledged;
        });
        break;
      case "backers":
        filtered.sort((a, b) => {
          const aBackers =
            a.fundingHistory[a.fundingHistory.length - 1]?.backersCount || 0;
          const bBackers =
            b.fundingHistory[b.fundingHistory.length - 1]?.backersCount || 0;
          return bBackers - aBackers;
        });
        break;
      case "recent":
        filtered.sort(
          (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );
        break;
      default:
        // Default sort (no change)
        break;
    }

    setFilteredProjects(filtered);
  }, [projects, selectedCategory, showWeLove, searchTerm, sortBy]);

  const averagePercentFunded =
    filteredProjects.length > 0
      ? filteredProjects.reduce((acc, project) => {
          const lastFunding =
            project.fundingHistory[project.fundingHistory.length - 1];
          return acc + (lastFunding?.percentFunded || 0);
        }, 0) / filteredProjects.length
      : 0;

  const totalProjectsWeLove = Object.values(projects).filter(
    (p) => p.isProjectWeLove
  ).length;

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={handleBack}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Kickstat
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track and explore funding projects
              </p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </header>

      {/* Stats & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Object.keys(projects).length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {filteredProjects.length} filtered
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Avg. Funded
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averagePercentFunded.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  of filtered projects
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <span className="text-2xl">❤️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Projects We Love
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalProjectsWeLove}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  total across all projects
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="default">Sort by: Default</option>
              <option value="percentFunded">Sort by: Most % Funded</option>
              <option value="pledged">Sort by: Most $ Funded</option>
              <option value="backers">Sort by: Most Backers</option>
              <option value="recent">Sort by: Most Recent</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowWeLove(!showWeLove)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showWeLove
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
              }`}
            >
              ❤️ We Love
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectSelect(project)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
