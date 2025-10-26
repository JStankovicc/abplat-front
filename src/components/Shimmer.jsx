import { Box, keyframes } from '@mui/material';

const shimmer = keyframes`
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
`;

const Shimmer = ({ width = '100%', height = '20px', borderRadius = '4px', sx = {} }) => {
  return (
    <Box
      sx={{
        width,
        height,
        borderRadius,
        backgroundColor: '#f0f0f0',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          transform: 'skewX(-15deg)',
          animation: `${shimmer} 2.5s infinite`,
        },
        ...sx
      }}
    />
  );
};

export default Shimmer;
