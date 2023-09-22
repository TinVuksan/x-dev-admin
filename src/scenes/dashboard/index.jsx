import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { geoFeatures } from "../../data/mockGeoFeatures";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GeographyChart from "../../components/GeographyChart";
import StatBox from "../../components/StatBox";
import useRefreshToken from "../../hooks/useRefreshToken";
import { useEffect } from "react";
import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { formatDate } from "../global/utils";
import CircularProgress from "@mui/material/CircularProgress";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const refresh = useRefreshToken();
  const axiosPrivate = useAxiosPrivate();

  const [latestTickets, setLatestTickets] = useState([]);
  const [numbers, setNumbers] = useState({
    users: null,
    receipts: null,
    revenue: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecentTickets = async () => {
    let isMounted = true;
    const controller = new AbortController();

    // Set isLoading to true when fetching begins
    setIsLoading(true);

    try {
      const response = await axiosPrivate.get("/receipts/latest", {
        signal: controller.signal,
      });
      console.log(response.data);
      isMounted && setLatestTickets(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      // Set isLoading to false when fetching ends (whether it succeeds or fails)
      setIsLoading(false);
    }
  };

  const fetchNumbers = async () => {
    try {
      const [usersCountResponse, receiptsCountResponse, revenueResponse] =
        await Promise.all([
          axiosPrivate.get("/users/count"),
          axiosPrivate.get("/receipts/count"),
          axiosPrivate.get("/receipts/revenue"),
        ]);

      console.log(usersCountResponse.data);
      console.log(receiptsCountResponse.data);
      console.log(revenueResponse.data);

      setNumbers({
        users: usersCountResponse.data,
        receipts: receiptsCountResponse.data,
        revenue: revenueResponse.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    geoFeatures.features.map((item) => ({
      [item.properties.name.replace(/["']/g, "")]: item.id,
    }));
    fetchRecentTickets();
    fetchNumbers();
  }, []);

  return (
    <>
      <Box m="20px">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        </Box>
        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12,1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* Row 1 */}
          <Box
            gridColumn="span 4"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={numbers.receipts}
              subtitle="Sales Obtained"
              progress="0"
              icon={
                <PointOfSaleIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          <Box
            gridColumn="span 4"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={`${numbers.revenue} $`}
              subtitle="Total revenue"
              progress="0.50"
              icon={
                <AccountBalanceIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>

          <Box
            gridColumn="span 4"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={numbers.users}
              subtitle="Registered users"
              progress="1"
              icon={
                <PersonAddIcon
                  sx={{
                    color: colors.greenAccent[600],
                    fontSize: "26px",
                    marginBottom: "5px",
                  }}
                />
              }
            />
          </Box>

          {/* Recent Transactions */}
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h5"
                fontWeight="600"
              >
                Recent Transactions
              </Typography>
            </Box>

            {isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
                alignItems="center"
                height="200px"
              >
                <CircularProgress color="secondary" />
                <Typography variant="h6" color="secondary">
                  Loading...
                </Typography>
              </Box>
            ) : (
              latestTickets.map((transaction, i) => (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  p="15px"
                >
                  <Box>
                    <Typography
                      color={colors.greenAccent[500]}
                      variant="h5"
                      fontWeight="600"
                    >
                      {transaction.userFirstName}
                    </Typography>
                    <Typography color={colors.grey[100]}>
                      {transaction.userLastName}
                    </Typography>
                  </Box>
                  <Box color={colors.grey[100]}>
                    {formatDate(transaction.purchaseDate)}
                  </Box>
                  <Box
                    backgroundColor={colors.greenAccent[500]}
                    p="5px 10px"
                    borderRadius="4px"
                  >
                    {transaction.ticketPrice}
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Geography Based Traffic */}
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="20px"
          >
            <Typography variant="h5" fontWeight="600">
              Geography Based Traffic
            </Typography>
            <Box sx={{ height: "250px", width: "800px" }}>
              <GeographyChart isDashboard={true} />
            </Box>
          </Box>

          {/* Row 2 */}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
