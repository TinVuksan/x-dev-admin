import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { formatDate } from "../global/utils";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const axiosPrivate = useAxiosPrivate();
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getReceipts = async () => {
      try {
        const response = await axiosPrivate.get("/receipts/all", {
          signal: controller.signal,
        });
        isMounted && setReceipts(response.data);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getReceipts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const columns = [
    { field: "id", headerName: "Receipt Id", flex: 1 },
    {
      field: "ticket.id",
      headerName: "Ticket Id",
      flex: 1,
      cellClassName: "name-column--cell",
      valueGetter: (params) => params.row.ticket.id,
    },
    {
      field: "ticket.type",
      headerName: "Ticket type",
      flex: 1,
      valueGetter: (params) => params.row.ticket.type.toUpperCase(),
    },
    {
      field: "ticket.price",
      headerName: "Cost",
      flex: 1,
      valueGetter: (params) => `${params.row.ticket.price} $`,
    },
    {
      field: "purchaseDate",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => formatDate(params.row.purchaseDate),
    },
  ];

  return (
    <Box m="20px">
      <Header title="INVOICES" subtitle="List of invoice balances" />
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
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={receipts}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Invoices;
