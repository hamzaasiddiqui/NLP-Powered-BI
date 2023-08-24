import React, { useState } from 'react';
import { Bar, Line, Pie, Doughnut, Scatter, Bubble, Radar, PolarArea } from 'react-chartjs-2';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css'; // Import the styles for react-resizable
import Chart from 'chart.js/auto';
import { Slider } from '@mui/material'; // Import Slider from Material-UI

const ResizableChart = ({ chartData }) => {
  const jsonminify = require('jsonminify');
  chartData = jsonminify(chartData)
  console.log(chartData);
  const chartDataParsed = JSON.parse(chartData);
  const { type, data, options } = chartDataParsed;

  const [chartSize, setChartSize] = useState(400); // Initial size of the chart

  let ChartElement;
  switch (type) {
    case 'bar' || 'Bar':
      ChartElement = Bar;
      break;
    case 'line' || 'Line':
      ChartElement = Line;
      break;
    case 'pie' || 'Pie':
      ChartElement = Pie;
      break;
    case 'doughnut' || 'Doughnut':
      ChartElement = Doughnut;
      break;
    case 'scatter' || 'Scatter':
      ChartElement = Scatter;
      break;
    case 'bubble' || 'Bubble':
      ChartElement = Bubble;
    case 'radar' || 'Radar':
      ChartElement = Radar;
    case 'polararea'|| 'polarArea' || 'polar area' || 'PolarArea' || 'Polar Area' || 'Polar area':
      ChartElement = PolarArea;
    default:
      ChartElement = Bar; // Default to bar chart
      break;
  }

  // Function to handle slider change
  const handleSliderChange = (event, newValue) => {
    setChartSize(newValue);
  };

  return (
    <div className="chart-container">
      <Slider
        value={chartSize}
        min={200}
        max={1000}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
      />
      <div className="chart">
        <ChartElement data={data || {}} options={options || {}} />
      </div>
      <style jsx>{`
        .chart-container {
          width: ${chartSize}px;
          height: ${chartSize}px;
          max-width: 1000px;
          max-height: 1000px;
          min-width: 200px;
          min-height: 200px;
          overflow: hidden;
          position: relative;
          
        }
        .chart {
          width: 100%;
          height: 80%;
        }
      `}</style>
    </div>
  );
};

export default ResizableChart;