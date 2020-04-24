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

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const ConfigurePrediction = ({ neighborhood }) => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [period, setPeriod] = React.useState("");
  const [prediction, setPrediction] = React.useState(null);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const fetchClassification = () => {
    const convertDate = (selectedDate) => {
      return `${2020}-${selectedDate.getMonth() + 1}-${selectedDate.getDay()}`;
    };
    SanFranciscoAPI()
      .classificationCustom(neighborhood, convertDate(selectedDate), period)
      .then(({ prediction }) => {
        console.log(prediction);
        setPrediction(prediction);
      });
  };

  const classes = useStyles();
  const periods = ["Morning", "Afternoon", "Evening", "Night"];

  return (
    <div style={getModalStyle()} className={classes.paper}>
      <h2 id="simple-modal-title">Configure prediction for {neighborhood}</h2>
      <div className="grid">
        {/*date picker*/}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={selectedDate}
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
      <Button variant="contained" color="primary" onClick={fetchClassification}>
        Predict
      </Button>
      {prediction && <p>{prediction}</p>}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default ConfigurePrediction;
