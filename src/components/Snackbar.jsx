import React, { useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const SnackbarComponent = ({ correctAnswer, correct }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (correct !== undefined) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [correct]);

  return correct === undefined ? null : (
    <div className={classes.root}>
      <Snackbar open={open}>
        {
          {
            [true]: (
              <Alert severity="success">
                Good job! The answer is:
                <br /> {correctAnswer}
              </Alert>
            ),
            [false]: (
              <Alert severity="error">
                Sorry! The correct answer is:
                <br /> {correctAnswer}
              </Alert>
            ),
            [null]: (
              <Alert severity="warning">
                The correct answer is:
                <br /> {correctAnswer}
              </Alert>
            ),
          }[correct]
        }
      </Snackbar>
    </div>
  );
};

export default SnackbarComponent;
