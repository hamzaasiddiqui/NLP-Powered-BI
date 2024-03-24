import React, { useState, useMemo, useCallback } from "react";
import { Doughnut } from "react-chartjs-2";
import { Slider, FormControlLabel, Switch } from "@mui/material";
import Chart from 'chart.js/auto';

const CustomizableDoughnutChart = ({ data, ChartTitle }) => {
  const [chartSize, setChartSize] = useState(32);
  const [showLegend, setShowLegend] = useState(false);

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
      labels: data.map(([label, _]) => label),
      datasets: [
        {
          data: data.map(([_, value]) => value),
          backgroundColor: data.map(() => getRandomRGBAColor()),
          borderColor: "white",
          borderWidth: 2,
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
    };
  }, [showLegend, ChartTitle]);

  const handleSliderChange = useCallback((event, newValue) => {
    setChartSize(newValue);
  }, []);

  const handleLegendChange = useCallback((event) => {
    setShowLegend(event.target.checked);
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
      <div className="chart">
        <Doughnut data={chartData} options={chartOptions} />
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

export default CustomizableDoughnutChart;
