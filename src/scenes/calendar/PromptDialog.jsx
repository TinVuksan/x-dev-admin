import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useState } from "react";
import { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { tokens } from "../../theme";

const PromptDialog = ({
  eventTitle,
  setEventTitle,
  eventSpeaker,
  setEventSpeaker,
  isOpen,
  setIsOpen,
  onSubmit,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [speakers, setSpeakers] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const fetchSpeakers = async () => {
    try {
      const response = await axiosPrivate.get("/speakers/get/names");
      setSpeakers(response.data);
    } catch (error) {
      console.error("Error fetching speaker names: ", error);
    }
  };
  useEffect(() => {
    fetchSpeakers();
  }, []);

  const isSubmitDisabled = !eventTitle || !eventSpeaker;

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div style={{ padding: "16px" }}>
        <TextField
          label="Event name"
          variant="outlined"
          fullWidth
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          margin="normal"
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Select Speaker</InputLabel>
          <Select
            label="Select a Speaker"
            value={eventSpeaker}
            onChange={(e) => setEventSpeaker(e.target.value)}
          >
            {speakers.map((speaker) => (
              <MenuItem key={speaker} value={speaker}>
                {speaker}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={() => {
              if (!isSubmitDisabled) {
                onSubmit(); // Call the onSubmit function when the button is clicked
                setIsOpen(false);
              }
            }}
            color="success"
            variant={isSubmitDisabled ? "outlined" : "contained"}
            style={{ marginTop: "16px" }}
            disabled={isSubmitDisabled} // Disable the button if required information is missing
          >
            Submit
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            color="info"
            variant="outlined"
            style={{ marginTop: "16px" }}
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default PromptDialog;
