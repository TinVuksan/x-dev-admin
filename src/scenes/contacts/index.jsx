import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axiosConfig from "../../API/axiosConfig";
import { useState, useEffect } from "react";

const Contacts = () => {
  const [speakers, setSpeakers] = useState({});

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getSpeakers = async () => {
      try {
        const response = await axiosConfig.get("/speakers/get", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && setSpeakers(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getSpeakers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "country",
      headerName: "Country",
      flex: 1,
    },
    {
      field: "position",
      headerName: "Position",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="SPEAKERS" subtitle="List of speakers" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },

          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={speakers}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
