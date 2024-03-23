import React, { useState, useMemo, useCallback } from "react";
import { Scatter } from "react-chartjs-2";
import { Slider, FormControlLabel, Switch } from "@mui/material";

const CustomizableScatterPlot = ({ data, ChartTitle, Xlabel, Ylabel }) => {
  const [chartSize, setChartSize] = useState(600);
  const [showLegend, setShowLegend] = useState(false);

  const handleSliderChange = useCallback((event, newValue) => {
    setChartSize(newValue);
  }, []);

  const handleLegendChange = useCallback((event) => {
    setShowLegend(event.target.checked);
  }, []);

  const getRandomRGBAColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 1;
    return `rgba(${r},${g},${b},${a})`;
  };

  // Memoize chart data and options to avoid recalculation on every render
  const chartData = useMemo(() => {
    return {
      datasets: [
        {
          label: "Dataset",
          data: data.map(([x, y]) => ({ x, y })),
          backgroundColor: getRandomRGBAColor(),
          borderColor: getRandomRGBAColor(),
          pointRadius: 4,
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
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: Xlabel,
          },
        },
        y: {
          type: "linear",
          position: "left",
          title: {
            display: true,
            text: Ylabel,
          },
        },
      },
    };
  }, [showLegend, ChartTitle, Xlabel, Ylabel]);

  return (
    <div className="chart-container">
      
      <FormControlLabel
        control={<Switch checked={showLegend} onChange={handleLegendChange} />}
        label="Show Legend"
      />
      <div className="chart">
        <Scatter data={chartData} options={chartOptions} />
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
          height: 78%;
        }
      `}</style>
    </div>
  );
};

export default CustomizableScatterPlot;
