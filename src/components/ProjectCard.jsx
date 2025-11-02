import React from "react";

const ProjectCard = ({ project, onClick }) => {
  const lastFunding = project.fundingHistory[project.fundingHistory.length - 1];
  const percentFunded = lastFunding?.percentFunded || 0;
  const pledged = lastFunding?.pledged
    ? parseFloat(lastFunding.pledged).toLocaleString()
    : "0";
  const backersCount = lastFunding?.backersCount || 0;

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
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 overflow-hidden hover:scale-[1.02]"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {project.name}
          </h3>
          {project.isProjectWeLove && (
            <span className="ml-2 text-red-500" title="Project We Love">
              ❤️
            </span>
          )}
        </div>

        {/* Category */}
        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-3">
          {project.category}
        </span>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {percentFunded}% funded
            </span>
            <span className="text-gray-600 dark:text-gray-400">${pledged}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentFunded, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
            <span>Launched</span>
            <span>Deadline</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
            <span>{launchDate.toLocaleDateString()}</span>
            <span>{deadlineDate.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">
              {backersCount}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Backers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">
              {project.fundingHistory.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Updates</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900 dark:text-white">
              {Math.ceil(
                (project.deadlineAt * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
              )}
              d
            </div>
            <div className="text-gray-600 dark:text-gray-400">Left</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
