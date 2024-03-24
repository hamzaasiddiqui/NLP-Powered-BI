import React, { useState, useMemo, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { Slider, FormControlLabel, Switch } from "@mui/material";
import Chart from 'chart.js/auto';

const CustomizableLineChart = ({ data, Xlabel, Ylabel, ChartTitle }) => {
  const [chartSize, setChartSize] = useState(32);
  const [showLegend, setShowLegend] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);
  const [showFill, setShowFill] = useState(false);
  const getRandomRGBAColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 1;
    return `rgba(${r},${g},${b},${a})`;
  };
  // Memoize chart data and options to avoid recalculation on every render
  const chartData = useMemo(() => {
    console.log(data.map(([_, data]) => data))
    console.log(data.map(([labels, _]) => labels))
    return {
      labels: data.map(([labels, _]) => labels),
      datasets: [
        {
          label: "Dataset",
          data: data.map(([_, data]) => data),
          fill: showFill,
          backgroundColor: getRandomRGBAColor(),
          borderColor: getRandomRGBAColor(),
          tension: 0.4,
        },
      ],
    };
  }, [data, showFill]);

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: showLegend,
          position: "top",
        },
        tooltip: {
          enabled: true,
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
        },
        y: {
          title: {
            display: true,
            text: Ylabel,
          },
          grid: {
            display: showGridLines,
          },
        },
      },
    };
  }, [showLegend, showGridLines, Xlabel, Ylabel, ChartTitle]);

  const handleSliderChange = useCallback((event, newValue) => {
    setChartSize(newValue);
  }, []);

  const handleLegendChange = useCallback((event) => {
    setShowLegend(event.target.checked);
  }, []);

  const handleGridLinesChange = useCallback((event) => {
    setShowGridLines(event.target.checked);
  }, []);

  const handleFillChange = useCallback((event) => {
    setShowFill(event.target.checked);
  }, []);

  return (
    <>
    <div
          // sx={{
          //   width: '100%',
          //   display: 'flex',
          //   justifyContent: 'center'
          // }}
          style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}
        >
          <b>{ChartTitle}</b>
        </div>
    <div className="chart-container">
      
      <FormControlLabel
        control={<Switch checked={showLegend} onChange={handleLegendChange} />}
        label="Show Legend"
      />
      <FormControlLabel
        control={<Switch checked={showGridLines} onChange={handleGridLinesChange} />}
        label="Show Grid Lines"
      />
      <FormControlLabel
        control={<Switch checked={showFill} onChange={handleFillChange} />}
        label="Fill"
      />
      <div className="chart">
        <Line data={chartData} options={chartOptions} />
      </div>
      <style jsx>{`
        .chart-container {
          width: ${chartSize}vw;
          height: ${chartSize}vw;
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
    </>
  );
};

export default CustomizableLineChart;
