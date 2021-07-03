import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Chip } from "@material-ui/core";

import { useUserState } from "../providers/UserProvider";

import CreateUserDialog from "../CreateUserDialog";
import AccessDialog from "../components/AccessDialog";
import {auth} from "../firebase";

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
  link: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
      padding: "10px 20px",
    },
  },
}));

export default function Home() {
  const user = useUserState();

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
          <Typography variant="h6">Control de Acceso</Typography>
          <div>
            <Chip
              label={rfidStatus.message}
              color={rfidStatus.success ? "primary" : "secondary"}
            />
            {user ? (
              <>
                <Button
                  color="inherit"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Gestionar Empleados
                </Button>
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
      {user ? <CreateUserDialog open={open} setOpen={setOpen} /> : null}
      <AccessDialog
        open={openAccessDialog}
        setOpen={setOpenAccessDialog}
        isCheckout={isCheckout}
      />
    </div>
  );
}
