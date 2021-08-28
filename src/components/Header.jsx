import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
} from "@material-ui/core";
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
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            PharmCards
          </Typography>
          <IconButton aria-label="Current Streak" color="inherit">
            <Badge badgeContent={streak} color="secondary">
              <Whatshot style={{ color: orange[500] }} />
            </Badge>
          </IconButton>
          <IconButton aria-label="Number correct" color="inherit">
            <Badge badgeContent={numCorrect} color="secondary">
              <CheckCircle style={{ color: green[500] }} />
            </Badge>
          </IconButton>
          <IconButton aria-label="Number incorrect" color="inherit">
            <Badge badgeContent={numIncorrect} color="secondary">
              <Cancel style={{ color: red[500] }} />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
