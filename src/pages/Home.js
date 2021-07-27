import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { Fab, AppBar, Toolbar, Button, Chip, Avatar } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

import { useUserState } from "../providers/UserProvider";
import { StaffProvider } from "../providers/StaffProvider";

import CreateUserDialog from "../CreateUserDialog";
import Popover from "../components/NotificationsPopover";
import Access from "./Access";
import Admin from "./Admin";
import { auth } from "../firebase";
import { isAndroid } from "../utils";

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  link: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
      padding: "10px 20px",
    },
  },
  avatar: {
    padding: "3px",
    height: "50px",
    width: "50px",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function Home() {
  const user = useUserState();

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [rfidStatus, setRfidStatus] = useState({
    success: false,
    message: "Error en lector",
  });

  useEffect(() => {
    if (isAndroid()) return;
    window.api.requestRfidStatus();
    window.api.requestTagId();

    window.api.getRfidStatus((data) => {
      setRfidStatus(data);
      console.log("rfid status", data);
    });

    return () => {
      window.api.removeEventListeners("requestRfidStatus");
      window.api.removeEventListeners("requestTag");
    };
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.appBar}>
          <Avatar className={classes.avatar} src="logo-vn.png" />
          <div>
            {!isAndroid() ? (
              <Chip
                label={rfidStatus?.message}
                color={rfidStatus?.success ? "primary" : "secondary"}
              />
            ) : null}
            {user ? (
              <>
                <Button
                  color="secondary"
                  onClick={() => {
                    auth.signOut().then();
                  }}
                >
                  Cerrar Sesion
                </Button>
              </>
            ) : (
              <NavLink className={classes.link} to="/login">
                <Button
                  color="inherit"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Ingresar
                </Button>
              </NavLink>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {user ? (
        <StaffProvider>
          <Admin />
          {!isAndroid() ? (
            <CreateUserDialog open={open} setOpen={setOpen} />
          ) : null}
          {isAndroid() ? (
            <Popover />
          ) : (
            <>
              <Fab
                className={classes.fab}
                color="secondary"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <PersonAddIcon />
              </Fab>
            </>
          )}
        </StaffProvider>
      ) : (
        <Access />
      )}
    </div>
  );
}
