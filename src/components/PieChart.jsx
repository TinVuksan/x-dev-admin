import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@emotion/react";
import { mockPieData as data } from "../data/mockData";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Container } from "@mui/material";

const PieChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();

  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    const controller = new AbortController();

    try {
      const response = await axiosPrivate.get("/receipts/revenueByTicketType", {
        signal: controller.signal,
      });
      console.log(response.data);
      setChartData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ResponsivePie
      data={chartData}
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
            fill: colors.grey[100],
          },
        },
      }}
      tooltip={(e) => {
        let { datum: t } = e;
        const tooltipStyle = {
          color: "black",
        };

        const colorBoxStyle = {
          width: "10px", // Set the width and height as needed
          height: "10px",
          backgroundColor: t.color, // Use the HEX color value
          marginRight: "3px", // Adjust spacing as needed
          marginTop: "3px",
        };

        return (
          <div style={tooltipStyle}>
            <Container
              style={{
                color: "inherit",
                backgroundColor: "white",
                height: "35px",
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/** Include the default tooltip content */}
              <span>
                <span>
                  <div style={colorBoxStyle}></div>
                </span>
                {t.id}: <span style={{ fontWeight: "bold" }}>{t.value} $</span>
              </span>
              {/* <span>{t.id}</span>
              <br />
              <span>{t.value}</span>
              <br /> */}
            </Container>
          </div>
        );
      }}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.2]],
      }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor={colors.grey[100]}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: "color" }}
      enableArcLabels={false}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: "color",
        modifiers: [["darker", 2]],
      }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "rgba(255, 255, 255, 0.3)",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      legends={[
        {
          anchor: "bottom",
          direction: "row",
          justify: false,
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );
};

export default PieChart;
