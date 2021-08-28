import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Snackbar,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Cancel from "@material-ui/icons/Cancel";
import Whatshot from "@material-ui/icons/Whatshot";
import { green, red, orange } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = ({ numCorrect, numIncorrect, streak }) => {
  const classes = useStyles();

  const [streakSnackbarOpen, setStreakSnackbarOpen] = useState(false);
  const [correctSnackbarOpen, setCorrectSnackbarOpen] = useState(false);
  const [incorrectSnackbarOpen, setIncorrectSnackbarOpen] = useState(false);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            PharmCards
          </Typography>
          <IconButton
            aria-label="Current Streak"
            color="inherit"
            onClick={() => setStreakSnackbarOpen(true)}
          >
            <Badge badgeContent={streak} color="secondary" max={9999}>
              <Whatshot style={{ color: orange[500] }} />
            </Badge>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={streakSnackbarOpen}
              autoHideDuration={1000}
              onClose={() => setStreakSnackbarOpen(false)}
            >
              <Alert severity="warning" icon={false}>
                Current Streak: {streak}
              </Alert>
            </Snackbar>
          </IconButton>
          <IconButton
            aria-label="Number correct"
            color="inherit"
            onClick={() => setCorrectSnackbarOpen(true)}
          >
            <Badge badgeContent={numCorrect} color="secondary" max={9999}>
              <CheckCircle style={{ color: green[500] }} />
            </Badge>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={correctSnackbarOpen}
              autoHideDuration={1000}
              onClose={() => setCorrectSnackbarOpen(false)}
            >
              <Alert severity="success" icon={false}>
                # Correct: {numCorrect}
              </Alert>
            </Snackbar>
          </IconButton>
          <IconButton
            aria-label="Number incorrect"
            color="inherit"
            onClick={() => setIncorrectSnackbarOpen(true)}
          >
            <Badge badgeContent={numIncorrect} color="secondary" max={9999}>
              <Cancel style={{ color: red[500] }} />
            </Badge>
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={incorrectSnackbarOpen}
              autoHideDuration={1000}
              onClose={() => setIncorrectSnackbarOpen(false)}
            >
              <Alert severity="error" icon={false}>
                # Incorrect: {numIncorrect}
              </Alert>
            </Snackbar>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
