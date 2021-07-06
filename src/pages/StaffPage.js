import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Container from "@material-ui/core/Container";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import AccessIcon from "@material-ui/icons/AccessTime";
import NavigateBackIcon from "@material-ui/icons/NavigateBefore";
import MeetingRoom from "@material-ui/icons/MeetingRoom";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import LoadingBackdrop from "../components/LoadingBackdrop";
import StaffData from "../components/StaffData";

import { green, red } from "@material-ui/core/colors";

import { db } from "../firebase";

import { formatAMPM, isCheckout } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  danger: {
    color: red[500],
    "&:hover": {
      color: red[600],
    },
  },
  success: {
    color: green[500],
    "&:hover": {
      color: green[600],
    },
  },
}));

export default function StaffPage() {
  const history = useHistory();
  const params = useParams();

  const classes = useStyles();

  const [accessData, setAccessData] = useState([]);
  const [staffData, setStaffData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    db.collection("users")
      .doc(params.id)
      .get()
      .then((doc) => {
        setStaffData({ ...doc.data() });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });

    const staffRef = db.collection("access");
    staffRef
      .limit(10)
      .where("userId", "==", params.id)
      .get()
      .then((snap) => {
        setLoading(false);

        const staff = snap.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });

        setAccessData(staff);
      })
      .catch((error) => {
        setLoading(false);

        setError(true);
      });
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.appBar}>
          <Button
            size="small"
            onClick={() => {
              history.goBack();
            }}
          >
            <NavigateBackIcon />
            <Typography variant="h6">Regresar</Typography>
          </Button>
        </Toolbar>
      </AppBar>
      <Container className={classes.root}>
        <LoadingBackdrop open={loading} />

        <Grid item xs={12} md={12}>
          <StaffData staff={staffData} />
          <Typography variant="h6" className={classes.title}>
            Acceso
          </Typography>
          <div className={classes.demo}>
            <List>
              {accessData
                ? accessData?.map((access) => (
                    <ListItem key={access.id} button>
                      <ListItemAvatar>
                        <Avatar>
                          <AccessIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${access.date
                          .toDate()
                          .toLocaleDateString()} a las ${formatAMPM(
                          access.date.toDate()
                        )}`}
                      />
                      <ListItemSecondaryAction>
                        {isCheckout(access.type) ? (
                          <ExitToAppIcon className={classes.danger} />
                        ) : (
                          <MeetingRoom className={classes.success} />
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                : null}
            </List>
          </div>
        </Grid>
      </Container>
    </>
  );
}
