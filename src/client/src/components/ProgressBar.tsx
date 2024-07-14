import { LinearProgress, Box, Typography } from "@mui/material";

export default function ProgressBarWithLabel({ value, metric }: { value: number, metric: string }) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        width: "100%"
      }}
    >
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{ height: 25 }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          left: 5,
          top: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Typography variant="body2" color="white">
          {`${value} ${metric}`}
        </Typography>
      </Box>
    </Box>
  );
}
