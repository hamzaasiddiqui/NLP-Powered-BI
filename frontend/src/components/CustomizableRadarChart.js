import React, { useState, useMemo, useCallback } from "react";
import { Radar } from "react-chartjs-2";
import { Slider, FormControlLabel, Switch } from "@mui/material";
import Chart from 'chart.js/auto';

const CustomizableRadarChart = ({ data, ChartTitle }) => {
  const [chartSize, setChartSize] = useState(600);
  const [showLegend, setShowLegend] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);

  const handleSliderChange = useCallback((event, newValue) => {
    setChartSize(newValue);
  }, []);

  const handleLegendChange = useCallback((event) => {
    setShowLegend(event.target.checked);
  }, []);

  const handleGridLinesChange = useCallback((event) => {
    setShowGridLines(event.target.checked);
  }, []);

  const getRandomRGBAColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.8;
    return `rgba(${r},${g},${b},${a})`;
  };

  // Memoize chart data and options to avoid recalculation on every render
  const chartData = useMemo(() => {
    return {
      labels: data.map(([label, _]) => label),
      datasets: [
        {
          label: "Dataset",
          data: data.map(([_, value]) => value),
          backgroundColor: getRandomRGBAColor(),
          borderColor: getRandomRGBAColor(),
          pointBackgroundColor: getRandomRGBAColor(),
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: getRandomRGBAColor(),
        },
      ],
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
        r: {
          angleLines: {
            display: showGridLines,
          },
          grid: {
            display: showGridLines,
          },
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    };
  }, [showLegend, showGridLines, ChartTitle]);

  return (
    <div className="chart-container">
      
      <FormControlLabel
        control={<Switch checked={showLegend} onChange={handleLegendChange} />}
        label="Show Legend"
      />
      <FormControlLabel
        control={<Switch checked={showGridLines} onChange={handleGridLinesChange} />}
        label="Show Grid Lines"
      />
      <div className="chart">
        <Radar data={chartData} options={chartOptions} />
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

export default CustomizableRadarChart;
