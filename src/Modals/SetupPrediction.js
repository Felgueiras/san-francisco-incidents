import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import SanFranciscoAPI from "../utils/SanFranciscoAPI";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";

function getModalStyle() {
  const top = 25;
  const left = 25;

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
}

const SetupPrediction = ({ updatePredictions }) => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [period, setPeriod] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const fetchPrediction = () => {
    setLoading(true);
    const convertDate = (selectedDate) => {
      return `${2020}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    };
    SanFranciscoAPI()
      .predictionDate(convertDate(selectedDate), period)
      .then((prediction) => {
        updatePredictions(prediction);
        setLoading(false);
      });
  };

  const classes = useStyles();
  const periods = ["Morning", "Afternoon", "Evening", "Night"];
  const minDate = new Date();
  const maxDate = new Date().setDate(minDate.getDate() + 7);

  return (
    <div style={getModalStyle()} className={classes.paper}>
      <h4 id="simple-modal-title">Make prediction</h4>
      <div className="grid">
        {/*date picker*/}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date"
            value={selectedDate}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </MuiPickersUtilsProvider>
        {/*period picker*/}
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Period</InputLabel>
          <Select
            id="demo-simple-select"
            value={period}
            onChange={handlePeriodChange}
          >
            {periods.map((period) => (
              <MenuItem value={period}>{period}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          disabled={loading || !period}
          className={classes.button}
          onClick={fetchPrediction}
        >
          Predict
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 250,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    zIndex: 2,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  button: {
    textAlign: "center",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
  },
}));

export default SetupPrediction;
