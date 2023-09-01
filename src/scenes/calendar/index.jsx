import { useState, useEffect } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axiosConfig from "../../API/axiosConfig";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    fetchEvents(); // Fetch events when the component mounts
  }, []);

  const preprocessEvents = (eventsFromApi) => {
    return eventsFromApi.map((event) => {
      return {
        id: event.id, // Replace with the actual id property from your API response
        title: event.title,
        start: event.startDate, // Convert to Date object
        end: event.endDate, // Convert to Date object
        allDay: event.allDay,
      };
    });
  };

  const fetchEvents = async () => {
    try {
      const response = await axiosConfig.get("/events/get");
      const processedEvents = preprocessEvents(response.data);
      setCurrentEvents(processedEvents);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  const handleDateClick = async (selected) => {
    const title = prompt("Please enter a new title for your event!");

    if (title) {
      const eventData = {
        title,
        startDate: selected.startStr,
        endDate: selected.endStr,
        allDay: selected.allDay,
      };

      try {
        const response = await axiosConfig.post("/events/add", eventData);
        if (response.status === 201) {
          fetchEvents();
        }
      } catch (error) {
        console.error("Error creating event: ", error);
      }
    }
  };

  const handleEventClick = async (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete this event? '${selected.event.title}'?`
      )
    ) {
      try {
        await axiosConfig.delete(`/events/delete/${selected.event.id}`);
        fetchEvents();
      } catch (error) {
        console.error("Error deleting the event: ", error);
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CALENDAR" subtitle="Conference events" />

      <Box display="flex" justifyContent="space-between">
        {/* Calendar sidebar */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
        >
          <Typography variant="h5">Events</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[500],
                  margin: "10px 0",
                  borderRadius: "2px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
                <ListItemText
                  primary=" "
                  secondary={
                    <Typography>
                      {event.allDay
                        ? "All day"
                        : formatDate(event.start, {
                            timeZone: "Europe/Zagreb",
                            hour: "2-digit",
                          }) +
                          "-" +
                          formatDate(event.end, {
                            timeZone: "Europe/Zagreb",
                            hour: "2-digit",
                          })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Calendar */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            timeZone="Europe/Zagreb"
            events={currentEvents}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
