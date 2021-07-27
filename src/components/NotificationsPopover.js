import React from "react";
import Button from "@material-ui/core/IconButton";
import NotificationIcon from "@material-ui/icons/Notifications";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

import { PushNotifications } from "@capacitor/push-notifications";
import { db } from "../firebase";

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

export default function NotificationsPopover() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  function enablePushNotifications() {
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
      alert("Error en registro" + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        alert("Nuevo Acceso " + JSON.stringify(notification));
      }
    );
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Button
        ref={anchorRef}
        aria-controls={open ? "split-button-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-label="select merge strategy"
        aria-haspopup="menu"
        onClick={handleToggle}
      >
        <NotificationIcon />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  <MenuItem
                    key={"Recibir Notificaciones"}
                    onClick={enablePushNotifications}
                  >
                    Recibir Notificaciones
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
