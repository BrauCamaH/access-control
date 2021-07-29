import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Button, Chip, Avatar } from "@material-ui/core";

import { PushNotifications } from "@capacitor/push-notifications";

import { useUserState } from "../providers/UserProvider";
import { StaffProvider } from "../providers/StaffProvider";

import CreateUserDialog from "../CreateUserDialog";
import Access from "./Access";
import Admin from "./Admin";
import { auth, db } from "../firebase";
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
}));

function saveToken(token) {
  db.collection("tokens")
    .doc(token)
    .set({
      token,
      createdAt: new Date(),
    })
    .then(() => {
      alert("Token registrado");
    })
    .catch((error) => {
      console.log("Error resgistrando token", error);
    });
}

export default function Home() {
  const user = useUserState();

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [rfidStatus, setRfidStatus] = useState({
    success: false,
    message: "Error en lector",
  });

  function EnablePushNotifications() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener("registration", (token) => {
      saveToken(token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error) => {
      alert("Error on registration: " + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        alert("Push received: " + JSON.stringify(notification));
      }
    );
  }

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
          <Avatar className={classes.avatar} src="icon.png" />
          <div>
            {!isAndroid() ? (
              <Chip
                label={rfidStatus?.message}
                color={rfidStatus?.success ? "primary" : "secondary"}
              />
            ) : null}
            {user ? (
              <>
                {isAndroid() ? (
                  <Button onClick={EnablePushNotifications}>
                    Recibir Notificaciones
                  </Button>
                ) : (
                  <Button
                    color="inherit"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Crear Empleado
                  </Button>
                )}
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
        </StaffProvider>
      ) : (
        <Access />
      )}
    </div>
  );
}
