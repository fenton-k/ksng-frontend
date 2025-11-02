import React from "react";
import FundingChart from "./FundingChart";

const ProjectDetail = ({ project, onBack, darkMode, setDarkMode }) => {
  const lastFunding = project.fundingHistory[project.fundingHistory.length - 1];
  const percentFunded = lastFunding?.percentFunded || 0;
  const pledged = lastFunding?.pledged
    ? parseFloat(lastFunding.pledged).toLocaleString()
    : "0";
  const backersCount = lastFunding?.backersCount || 0;
  const fundingGoal = project.goal
    ? parseFloat(project.goal).toLocaleString()
    : "0";

  const launchDate = new Date(project.launchedAt * 1000);
  const deadlineDate = new Date(project.deadlineAt * 1000);
  const now = new Date();
  const totalDuration = deadlineDate - launchDate;
  const elapsedDuration = now - launchDate;
  const progressPercentage = Math.min(
    Math.max((elapsedDuration / totalDuration) * 100, 0),
    100
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                ← Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  by {project.creator.name}
                </p>
              </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Chart Only */}
          <div className="lg:w-2/3 space-y-6">
            {/* Separate Funding Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Funding Progress
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {percentFunded}% Funded
                  </span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">
                    ${pledged} pledged
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(percentFunded, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    $
                    {lastFunding?.pledged
                      ? parseFloat(lastFunding.pledged).toLocaleString()
                      : "0"}{" "}
                    raised
                  </span>
                  <span>Goal: ${fundingGoal}</span>
                </div>
                {percentFunded > 100 && (
                  <div className="text-center text-sm text-green-600 dark:text-green-400 font-semibold mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    Overfunded by{" "}
                    {(
                      ((parseFloat(lastFunding?.pledged || 0) -
                        parseFloat(project.goal || 0)) /
                        parseFloat(project.goal || 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                )}
              </div>
            </div>

            {/* Funding Chart - Clean Version */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Funding Progress Over Time
              </h2>
              <div className="h-80">
                <FundingChart project={project} />
              </div>
            </div>

            {/* Separate Timeline Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Project Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Launch</span>
                  <span>{progressPercentage.toFixed(1)}% Complete</span>
                  <span>Deadline</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500">
                  <span>{launchDate.toLocaleDateString()}</span>
                  <span>{progressPercentage < 100 ? "Today" : "Ended"}</span>
                  <span>{deadlineDate.toLocaleDateString()}</span>
                </div>

                {/* Timeline Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {Math.floor(totalDuration / (1000 * 60 * 60 * 24))} days
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Duration
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {Math.floor(elapsedDuration / (1000 * 60 * 60 * 24))} days
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Elapsed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))}{" "}
                      days
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Remaining
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Project Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                  {project.category}
                </span>
                {project.isProjectWeLove && (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-medium flex items-center">
                    ❤️ Project We Love
                  </span>
                )}
                {project.isProjectOfTheDay && (
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                    ⭐ Project of the Day
                  </span>
                )}
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {project.description}
              </p>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Creator
                </h3>
                <a
                  href={project.creator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {project.creator.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {project.creator.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {project.creator.launchedProjects} projects launched
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Project Stats
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {backersCount}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Backers
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.ceil(
                      (project.deadlineAt * 1000 - Date.now()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Days Left
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {percentFunded}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Funded
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${pledged}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Pledged
                  </div>
                </div>
              </div>
            </div>

            {/* Key Dates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Key Dates
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Launched
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {launchDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Deadline
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {deadlineDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Updated
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(project.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Project Links
              </h3>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                🌐 View on Kickstarter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
