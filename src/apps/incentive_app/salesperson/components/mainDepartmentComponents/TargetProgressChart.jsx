import React from 'react';
import Chart from 'react-apexcharts';

const TargetProgressChart = ({ progressValue }) => {
  const chartSeries = [progressValue ? progressValue : 0];

  const chartOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
      redrawOnWindowResize: true,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          margin: 0,
          size: '80%',
        },
        track: {
          background: '#eee',
          strokeWidth: '100%',
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: '36px',
            fontWeight: 600,
            offsetY: 10,
            color: 'rgba(0, 0, 0, 0.7)',
          },
        },
        stroke: {
          lineCap: 'round',
        },
      },
    },
    fill: {
      colors: ['#2563eb'],
    },
    labels: ['Progress'],
  };

  return (
    <div className="w-full md:scale-none scale-90">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="radialBar"
        height={370} // fixed height as a number
      />
    </div>
  );
};

export default TargetProgressChart;
