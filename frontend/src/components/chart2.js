import React from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ChartComponent = ({ chartData }) => {

  console.log(chartData)
  
  var chartDataParsed = JSON.parse(chartData);
  const { type, data, options } = chartDataParsed;

  let ChartElement;
  switch (type) {
    case 'bar':
      ChartElement = Bar;
      break;
    case 'line':
      ChartElement = Line;
      break;
    case 'pie':
      ChartElement = Pie;
      break;
    case 'doughnut':
      ChartElement = Doughnut;
      break;
    default:
      ChartElement = Bar; // Default to bar chart
      break;
  }

  return (
    <div>
      <ChartElement data={data || {}} options={options || {}} />
    </div>
  );
};

export default ChartComponent;
