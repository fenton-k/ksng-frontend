import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";

const FundingChart = ({ project }) => {
  const launchTime = project.launchedAt * 1000;
  const deadlineTime = project.deadlineAt * 1000;
  const now = Date.now();
  const isProjectEnded = now > deadlineTime;

  // Get the latest funding data
  const latestFunding =
    project.fundingHistory[project.fundingHistory.length - 1];
  const currentPercentFunded = latestFunding?.percentFunded || 0;
  const currentPledged = parseFloat(latestFunding?.pledged || 0);

  // Use goal from project data if available, otherwise calculate it
  const fundingGoal = project.goal
    ? parseFloat(project.goal)
    : currentPercentFunded > 0
    ? (currentPledged * 100) / currentPercentFunded
    : currentPledged;

  // Calculate Y-axis max with nice rounding for pledged amount
  const maxPledgedValue = Math.max(currentPledged, fundingGoal * 1.1);
  const niceMaxPledged = Math.ceil(maxPledgedValue / 1000) * 1000;

  // FIXED: Calculate timeline progress correctly using entire project duration
  const totalProjectDuration = deadlineTime - launchTime;

  // Transform data to show progress relative to project timeline, but only up to current time
  const chartData = project.fundingHistory
    .map((entry) => {
      const entryTime = new Date(entry.timestamp).getTime();
      // Only include data points up to current time (or deadline if project ended)
      const cutoffTime = isProjectEnded
        ? deadlineTime
        : Math.min(now, deadlineTime);

      if (entryTime > cutoffTime) return null;

      // FIXED: Use total project duration for timeline calculation
      const timeFromLaunch = entryTime - launchTime;
      const timelineProgress = (timeFromLaunch / totalProjectDuration) * 100;

      return {
        ...entry,
        timestamp: entryTime,
        timelineProgress: Math.min(Math.max(timelineProgress, 0), 100),
        pledged: parseFloat(entry.pledged),
        backersCount: entry.backersCount,
        date: new Date(entry.timestamp).toLocaleDateString(),
        time: new Date(entry.timestamp).toLocaleTimeString(),
        daysFromLaunch: Math.floor(timeFromLaunch / (1000 * 60 * 60 * 24)),
        daysTotal: Math.floor(totalProjectDuration / (1000 * 60 * 60 * 24)),
      };
    })
    .filter(Boolean);

  // Add start point and ensure we have data up to current time
  const enhancedData = [
    // Add launch point
    {
      timestamp: launchTime,
      timelineProgress: 0,
      pledged: 0,
      backersCount: 0,
      percentFunded: 0,
      date: new Date(launchTime).toLocaleDateString(),
      time: new Date(launchTime).toLocaleTimeString(),
      daysFromLaunch: 0,
      daysTotal: Math.floor(totalProjectDuration / (1000 * 60 * 60 * 24)),
      isMilestone: true,
      milestone: "Launch",
    },
    ...chartData,
  ];

  // Add current time point if we don't have recent data
  const lastDataPoint = enhancedData[enhancedData.length - 1];
  const shouldAddCurrentPoint =
    !isProjectEnded &&
    (!lastDataPoint || now - lastDataPoint.timestamp > 60 * 60 * 1000);

  if (shouldAddCurrentPoint) {
    const currentProgress = Math.min(
      Math.max(((now - launchTime) / totalProjectDuration) * 100, 0),
      100
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">
            {data.date}
          </p>
          {data.time && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {data.time}
            </p>
          )}
          {data.milestone && (
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
              🎯 {data.milestone}
            </p>
          )}
          <p className="text-purple-600 dark:text-purple-400">
            Pledged:{" "}
            <span className="font-semibold">
              ${data.pledged?.toLocaleString()}
            </span>
          </p>
          <p className="text-teal-600 dark:text-teal-400">
            Backers: <span className="font-semibold">{data.backersCount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Format Y-axis values for pledged amount
  const formatPledgedAxis = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={enhancedData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />

        {/* X Axis - Timeline Progress */}
        <XAxis
          dataKey="timelineProgress"
          type="number"
          domain={[0, 100]}
          tickFormatter={(value) => `${value.toFixed(0)}%`}
          className="text-sm"
          label={{
            value: "Project Timeline Progress",
            position: "insideBottom",
            offset: -5,
          }}
        />

        {/* Single Y Axis - Pledged Amount */}
        <YAxis
          tickFormatter={formatPledgedAxis}
          className="text-sm"
          domain={[0, niceMaxPledged]}
          label={{
            value: "Amount Pledged ($)",
            angle: -90,
            position: "insideLeft",
          }}
        />

        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {/* Funding Goal Reference Line */}
        {fundingGoal > 0 && (
          <ReferenceLine
            y={fundingGoal}
            stroke="#EF4444"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{
              value: `Funding Goal: $${Math.round(
                fundingGoal
              ).toLocaleString()}`,
              position: "insideTopRight",
              fill: "#EF4444",
              fontSize: 12,
            }}
          />
        )}

        {/* Project Duration Area */}
        <Area
          type="monotone"
          dataKey="pledged"
          stroke="none"
          fill="#3B82F6"
          fillOpacity={0.1}
          name="Funding Range"
        />

        {/* Single Funding Progress Line */}
        <Line
          type="monotone"
          dataKey="pledged"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{
            fill: "#3B82F6",
            strokeWidth: 2,
            r: 5,
            stroke: "#ffffff",
          }}
          activeDot={{
            r: 7,
            fill: "#1D4ED8",
            stroke: "#ffffff",
            strokeWidth: 2,
          }}
          name="Amount Pledged"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default FundingChart;
