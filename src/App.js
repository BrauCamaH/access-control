import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { AppBar, Toolbar, Typography, Button, Chip } from "@material-ui/core";

import CreateUserDialog from "./CreateUserDialog";
import AccessDialog from "./components/AccessDialog";

import "./App.css";

const useStyles = makeStyles((theme) => ({
  marginButton: {
    marginRight: theme.spacing(2),
  },
  center: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "90vh",
  },
  appBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [openAccessDialog, setOpenAccessDialog] = useState(false);

  const [rfidStatus, setRfidStatus] = useState({
    success: false,
    message: "Error en lector",
  });
  useEffect(() => {
    window.api.requestRfidStatus();
    window.api.requestTagId();

    window.api.getRfidStatus((data) => {
      setRfidStatus(data);
      console.log("rfid status", data);
    });
  }, []);

  return (
    <div>
      <AppBar position="static">
        <Toolbar className={classes.appBar}>
          <Typography variant="h6">Villanapoli Control Acceso</Typography>
          <div>
            <Chip
              label={rfidStatus.message}
              color={rfidStatus.success ? "primary" : "secondary"}
            />
            <Button
              color="inherit"
              onClick={() => {
                setOpen(true);
              }}
            >
              Ingresar Usuario
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <div maxWidth="sm" className={classes.center}>
        <Button
          className={classes.marginButton}
          variant="outlined"
          color="primary"
          onClick={() => {
            setIsCheckout(false);
            setOpenAccessDialog(true);
          }}
        >
          Registrar Entrada
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setIsCheckout(true);
            setOpenAccessDialog(true);
          }}
        >
          Registrar Salida
        </Button>
      </div>
      <CreateUserDialog open={open} setOpen={setOpen} />

      <AccessDialog
        open={openAccessDialog}
        setOpen={setOpenAccessDialog}
        isCheckout={isCheckout}
      />
    </div>
  );
}
