import { ResponsiveChoropleth } from "@nivo/geo";
import { tokens } from "../theme";
import { useTheme } from "@emotion/react";
import { geoFeatures } from "../data/mockGeoFeatures";
import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { Container } from "@mui/material";
const GeographyChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("Connected to websocket");

      stompClient.send("/update", {}, "");

      stompClient.subscribe("/topic/chartData", (message) => {
        const newData = JSON.parse(message.body);
        console.log("Received data from server: ", newData);
        setChartData(newData);
      });
    });
  }, []);

  return (
    <ResponsiveChoropleth
      data={chartData}
      features={geoFeatures.features}
      colors="nivo"
      tooltip={({ feature }) =>
        feature.value ? (
          <Container
            style={{
              color: "black",
              backgroundColor: "white",
              borderRadius: "3px",
            }}
          >
            <strong>
              {feature.label}: {feature.value}
            </strong>
          </Container>
        ) : (
          ""
        )
      }
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[500],
          },
        },
      }}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      domain={[0, 75]}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      projectionScale={isDashboard ? 40 : 150}
      projectionTranslation={isDashboard ? [0.49, 0.6] : [0.5, 0.5]}
      projectionRotation={[0, 0, 0]}
      borderWidth={1.5}
      borderColor="#ffebee"
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-left",
                direction: "column",
                justify: true,
                translateX: 20,
                translateY: -100,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: colors.grey[100],
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#ffffff",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default GeographyChart;
