import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Container from "@material-ui/core/Container";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import FolderIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/NavigateNext";

import LoadingBackdrop from "../components/LoadingBackdrop";
import { useStaffState, useStaffDispatch } from "../providers/StaffProvider";

import { db } from "../firebase";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  link: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
      padding: "10px 20px",
    },
  },
}));

function getStatusInfo(status) {
  return status === "accessed"
    ? "Accedio"
    : status === "finished"
    ? "Salio"
    : "No ha accedido";
}

export default function Admin() {
  const classes = useStyles();


  const staff = useStaffState();
  const staffDispatch = useStaffDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const staffRef = db.collection("staff");
    staffRef
      .limit(20)
      .get()
      .then((snap) => {
        setLoading(false);
        const staff = snap.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });

        console.log("staff", staff);

        staffDispatch({type: "SET_STAFF", payload: staff});
      })
      .catch((error) => {
        setLoading(false);

        setError(true);
      });
  }, []);

  if (error) {
    return <p>Revise conexion a internet</p>;
  }

  return (
    <Container className={classes.root}>
      <LoadingBackdrop open={loading} />

      <Grid item xs={12} md={12}>
        <Typography variant="h6" className={classes.title}>
          Empleados
        </Typography>
        <div className={classes.demo}>
          <List>
            {staff
              ? staff?.map((s) => (
                  <NavLink
                    key={s.id}
                    className={classes.link}
                    to={`/staff/${s.id}`}
                  >
                    <ListItem button>
                      <ListItemAvatar>
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={s.name} />
                      <Chip
                        label={getStatusInfo(s.status)}
                        color={
                          s.status === "accessed" ? "primary" : "secondary"
                        }
                      />
                      <ListItemSecondaryAction>
                        <DeleteIcon />
                      </ListItemSecondaryAction>
                    </ListItem>
                  </NavLink>
                ))
              : null}
          </List>
        </div>
      </Grid>
    </Container>
  );
}
