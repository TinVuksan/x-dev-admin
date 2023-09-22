import { Box, useTheme, Typography } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently asked questions" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Pie chart
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The Pie Chart shows revenue generated based on ticket type
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Geography chart
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Geography chart shows amount of users registered per country
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How to add new articles?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We have made creating new articles extremely easy and
            straight-forward. All you have to do is click on "Add news", fill up
            the form, click and - BOOM! It's on the main page.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How to add a new event?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Adding events is pretty fun on this dashboard. You can click on the
            day, name the event, select a speaker and it will automatically be
            inserted on the main page schedule as an all-day event.
            <br /> If you want, you can select "week" or "day" at the right side
            of the calendar, and then with mouse click and drag, just select
            when the event starts and when it ends. Cool, right?
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How to change user's role?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Go to "Manage Users" and click the user's role box. Yes, that
            simple.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
