import { useEffect, useState } from "react";
import "./App.css";
import ProgressBarWithLabel from "./components/ProgressBar";
import { Grid } from "@mui/material";
import SimpleMap from "./components/SimpleMap";
import LineChart from "./components/LineChart";
import throttle from "lodash/throttle";

interface WebSocketData {
  time: number;
  energy: number;
  gps: string;
  odo: number;
  speed: number;
  soc: number;
}
function App() {
  const [mapData, setMapData] = useState({
    latitude: 40.7128,
    longitude: -74.006
  });
  const [progressData, setProgressData] = useState({ speed: 0, soc: 0 });
  const [progressHistory, setProgressHistory] = useState({
    speed: [0],
    soc: [0]
  });
  const [timeLabels, setTimeLabels] = useState<number[]>([]);
  const [energy, setEnergy] = useState(0);
  const [odo, setOdoMeter] = useState(0);

  const processMessage = throttle((data: WebSocketData) => {
    const { gps, speed, soc, time, energy, odo } = data;
    const latitude = parseFloat(gps.split("|")[0]);
    const longitude = parseFloat(gps.split("|")[1]);
    setMapData({ latitude, longitude });
    setProgressData({ speed: Number(speed), soc: Number(soc) });
    setProgressHistory((prev) => ({
      speed: [...prev.speed, Number(data.speed)],
      soc: [...prev.soc, Number(data.soc)]
    }));

    if (time) {
      setTimeLabels((prev) => [...prev, Number(time)]);
    }
    setEnergy(Number(energy));
    setOdoMeter(Number(odo));
  }, 1000);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("message", (event) => {
      processMessage(JSON.parse(event.data));
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <SimpleMap
            latitude={mapData.latitude}
            longitude={mapData.longitude}
          />
        </Grid>
        <Grid item xs={6}>
          <h4>Current Speed</h4>
          <ProgressBarWithLabel value={progressData.speed} metric="km/hr" />
          <h4>State of Charge</h4>
          <ProgressBarWithLabel value={progressData.soc} metric="%" />
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <h4>Energy</h4>
              <div>{`${energy} kW`}</div>
            </Grid>
            <Grid item xs={8}>
              <h4>Odometer</h4>
              <div>{`${odo} km`}</div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ height: '50vh', width: '100%' }}>
          <LineChart
            labels={timeLabels}
            dataPoints={progressHistory.speed}
            label="Speed Profile"
            color="rgb(75, 192, 192)"
            yLabel={"Speed (km/hr)"}
            xLabel={"Time"}
          />
        </Grid>
        <Grid item xs={12} style={{ height: '50vh', width: '100%' }}>
          <LineChart
            labels={timeLabels}
            dataPoints={progressHistory.soc}
            label="State of Charge Profile"
            color="rgb(255, 99, 132)"
            yLabel={"SoC (%)"}
            xLabel={"Time"}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
