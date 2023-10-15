import React, { useState, useMemo, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import { Slider, FormControlLabel, Switch } from "@mui/material";
import Chart from 'chart.js/auto';

const CustomizableBarChart = ({ data, Xlabel, Ylabel, ChartTitle }) => {
  const [chartSize, setChartSize] = useState(600);
  const [showLegend, setShowLegend] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);
  const [showStack, setShowStack] = useState(false);

  // Memoize chart data and options to avoid recalculation on every render
  const getRandomRGBAColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 1;
    return `rgba(${r},${g},${b},${a})`;
  };
  const datasets = [];
  for (let i = 1; i < data[0].length; i++) {
    const subarray = data.map(arr => arr[i]);
    datasets.push({
      label: Ylabel[i-1],
      data: subarray,
      backgroundColor: getRandomRGBAColor(),
      borderWidth: 1,
    });
  }

  const chartData = useMemo(() => {
    return {
      labels: data.map(arr => arr[0]),
      datasets: datasets
    };
  }, [data]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: showLegend,
          position: "top",
        },
        title: {
          display: true,
          text: ChartTitle,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: Xlabel,
          },
          grid: {
            display: showGridLines,
          },
          stacked: showStack,
        },
        y: {
          title: {
            display: true,
            text: "Y-Axis",
          },
          grid: {
            display: showGridLines,
          },
          stacked: showStack,
        },
      },
    };
  }, [showLegend, showGridLines, showStack, Xlabel, Ylabel, ChartTitle]);

  const handleSliderChange = useCallback((event, newValue) => {
    setChartSize(newValue);
  }, []);

  const handleLegendChange = useCallback((event) => {
    setShowLegend(event.target.checked);
  }, []);
  const handleShowStack = useCallback((event) => {
    setShowStack(event.target.checked);
  }, []);
  const handleGridLinesChange = useCallback((event) => {
    setShowGridLines(event.target.checked);
  }, []);


  

  return (
    <div className="chart-container">
      <Slider
        value={chartSize}
        min={300}
        max={1000}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
      />
      <FormControlLabel
        control={<Switch checked={showLegend} onChange={handleLegendChange} />}
        label="Show Legend"
      />
      <FormControlLabel
        control={<Switch checked={showGridLines} onChange={handleGridLinesChange} />}
        label="Show Grid Lines"
      />
      <FormControlLabel
        control={<Switch checked={showStack} onChange={handleShowStack} />}
        label="Show Stacked"
      />
      <div className="chart">
        <Bar data={chartData} options={chartOptions} />
      </div>
      <style jsx>{`
        .chart-container {
          width: ${chartSize}px;
          height: ${chartSize}px;
          max-width: 1000px;
          max-height: 1000px;
          min-width: 300px;
          min-height: 300px;
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

export default CustomizableBarChart;

