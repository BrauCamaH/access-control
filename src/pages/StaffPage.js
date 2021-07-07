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

  const [accessData, setAccessData] = useState();
  const [staffData, setStaffData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    db.collection("staff")
      .doc(params.id)
      .get()
      .then((staff) => {
        setStaffData({ id: staff.id, ...staff.data() });

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

            setAccessData(access);

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
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingBackdrop open={loading} />;
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
            label={getStatusInfo(staffData.status)}
            color={staffData.status === "accessed" ? "primary" : "secondary"}
          />
        </Toolbar>
      </AppBar>
      <Container className={classes.root}>
        <Grid item xs={12} md={12}>
          <StaffData staff={staffData} />
          <Typography variant="h6" className={classes.title}>
            Acceso
          </Typography>
          <div className={classes.demo}>
            <List>
              {accessData ? (
                accessData.legth !== 0 ? (
                  <AccessTable rows={accessData} />
                ) : null
              ) : null}
            </List>
          </div>
        </Grid>
      </Container>
    </>
  );
}
