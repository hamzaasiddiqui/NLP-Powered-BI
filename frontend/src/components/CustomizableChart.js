import React from "react";
import CustomizableBarChart from "./CustomizableBarChart";
import CustomizableBubbleChart from "./CustomizableBubbleChart";
import CustomizableLineChart from "./CustomizableLineChart";
import CustomizablePieChart from "./CustomizablePieChart";
import CustomizableRadarChart from "./CustomizableRadarChart";
import CustomizableScatterChart from "./CustomizableScatterPlot";
import CustomizableDoughnutChart from "./CustomizableDoughnutChart";

const ChartRenderer = ({ chartType, data, Xlabel, Ylabel, ChartTitle }) => {
  switch (chartType) {
    case "Bar":
      return <CustomizableBarChart data={data} Xlabel={Xlabel} Ylabel={Ylabel} ChartTitle={ChartTitle}/>;
    case "Bubble":
      return <CustomizableBubbleChart data={data} Xlabel={Xlabel} Ylabel={Ylabel} ChartTitle={ChartTitle}/>;
    case "Line":
      return <CustomizableLineChart data={data} Xlabel={Xlabel} Ylabel={Ylabel} ChartTitle={ChartTitle}/>;
    case "Pie":
      return <CustomizablePieChart data={data} ChartTitle={ChartTitle}/>;
    case "Radar":
      return <CustomizableRadarChart data={data} ChartTitle={ChartTitle}/>;
    case "Scatter":
      return <CustomizableScatterChart data={data} Xlabel={Xlabel} Ylabel={Ylabel} ChartTitle={ChartTitle}/>;
    case "Doughnut":
      return <CustomizableDoughnutChart data={data} ChartTitle={ChartTitle}/>;
    default:
      return <CustomizableBarChart data={data} Xlabel={Xlabel} Ylabel={Ylabel} ChartTitle={ChartTitle}/>;
  }
};

export default ChartRenderer;
