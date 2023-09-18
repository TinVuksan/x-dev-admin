import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axiosConfig from "../../API/axiosConfig";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState("");

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/users/all", {
          signal: controller.signal,
        });
        console.log(response.data);

        isMounted && setUsers(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [auth]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const roles = ["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"];

  const getNextRole = (currentRole) => {
    const currentIndex = roles.indexOf(currentRole);
    const nextIndex = (currentIndex + 1) % roles.length;
    return roles[nextIndex];
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      headerAlign: "left",
    },
    {
      field: "firstName",
      headerName: "First name",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "lastName",
      headerName: "Last name",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "dateOfBirth",
      headerName: "Birth date",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 0.5,
    },
    {
      field: "roles",
      headerName: "Access level",
      flex: 0.5,
      headerAlign: "center",
      renderCell: ({ row }) => {
        const role = row.roles[0].name;

        const handleRoleClick = async (userId) => {
          const nextRole = getNextRole(role);

          try {
            const response = await axiosPrivate.put(
              `/users/${userId}/updateRole?newRole=${nextRole}`,
              {
                newRole: nextRole,
              }
            );

            console.log(response.data);

            setCurrentUserRole(nextRole);
          } catch (error) {
            console.error(error);
          }

          const updatedUsers = users.map((user) => {
            if (user.id === userId) {
              return {
                ...user,
                roles: [{ name: nextRole }],
              };
            }
            return user;
          });
          setUsers(updatedUsers);
        };

        return (
          <Box
            sx={{
              width: "60%",
              m: "0 auto",
              p: "5px",
              display: "flex",
              justifyContent: "center",
              backgroundColor:
                role == "ROLE_ADMIN"
                  ? colors.greenAccent[600]
                  : colors.greenAccent[700],
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => {
              handleRoleClick(row.id);
              console.log(row);
            }}
          >
            {role === "ROLE_ADMIN" && <AdminPanelSettingsOutlinedIcon />}
            {role === "ROLE_MODERATOR" && <SecurityOutlinedIcon />}
            {role === "ROLE_USER" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Users" subtitle="Managing website users" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        width="84vw"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            outline: "none",
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
        }}
      >
        <DataGrid rows={users} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
