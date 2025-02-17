import React from 'react';
import { Box, Typography } from '@mui/material';

interface PieChartProps {
  data: {
    labels: string[];
    data: number[];
    colors: string[];
  };
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const total = data.data.reduce((sum, value) => sum + value, 0);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '300px' }}>
      <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        {data.data.map((value, index) => {
          const percentage = (value / total) * 100;
          let cumulativePercentage = data.data
            .slice(0, index)
            .reduce((sum, v) => sum + (v / total) * 100, 0);

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={data.colors[index]}
              strokeWidth="20"
              strokeDasharray={`${percentage} 100`}
              strokeDashoffset={-cumulativePercentage}
              style={{ transition: 'all 0.3s ease' }}
            />
          );
        })}
      </svg>
      <Box
        sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mt: 2,
        }}
      >
        {data.labels.map((label, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: data.colors[index],
                borderRadius: '50%',
              }}
            />
            <Typography>
              {label} ({Math.round((data.data[index] / total) * 100)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};