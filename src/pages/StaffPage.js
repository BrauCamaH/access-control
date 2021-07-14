import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";

import NavigateBackIcon from "@material-ui/icons/NavigateBefore";

import LoadingBackdrop from "../components/LoadingBackdrop";
import StaffData from "../components/StaffData";
import AccessTable from "../components/AccessTable";

import { green, red } from "@material-ui/core/colors";

import { db } from "../firebase";
import { getStatusInfo } from "../utils";
import { useAccessState, useAccessDispatch } from "../providers/AccessProvider";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  const state = useAccessState();
  const dispatch = useAccessDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    db.collection("staff")
      .doc(params.id)
      .get()
      .then((staff) => {
        dispatch({
          type: "SET_STAFF",
          payload: { id: staff.id, ...staff.data() },
        });

        const staffRef = db.collection("staff").doc(staff.id);
        staffRef
          .collection("access")
          .limit(10)
          .orderBy("access", "desc")
          .get()
          .then((snap) => {
            const access = snap.docs.map((doc) => {
              return { id: doc.id, ...doc.data() };
            });

            dispatch({ type: "SET_ACCESS", payload: access });

            console.log(access);

            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            console.log(error);
            setError(true);
          });
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        setLoading(false);
      });
  }, [params.id, dispatch]);

  if (loading) {
    return <LoadingBackdrop open={loading} />;
  }
  if (error) {
    return <p>Revise conexion</p>;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.appBar}>
          <Button
            size="small"
            onClick={() => {
              history.push("/");
            }}
          >
            <NavigateBackIcon />
            <Typography variant="h6">Regresar</Typography>
          </Button>
          <Chip
            label={getStatusInfo(state.staff?.status)}
            color={state.staff?.status === "accessed" ? "primary" : "secondary"}
          />
        </Toolbar>
      </AppBar>
      <Container className={classes.root}>
        <Grid item xs={12} md={12}>
          {state.staff ? <StaffData staff={state.staff} /> : null}
          <Typography variant="h6" className={classes.title}>
            Acceso
          </Typography>
          <div className={classes.demo}>
            <List>
              {state.access ? (
                <AccessTable rows={state.access} staffId={state.staff?.id} />
              ) : null}
            </List>
          </div>
        </Grid>
      </Container>
    </>
  );
}
