import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@material-ui/core";

import CreateUserDialog from "./CreateUserDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <CreateUserDialog open={open} setOpen={setOpen} />

        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Villanapoli Control Acceso
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              setOpen(true);
            }}
          >
            Ingresar Usuario
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Button variant="outlined" color="primary">
          Ingresar
        </Button>
        <Button variant="outlined" color="secondary">
          Primary
        </Button>
      </Container>

    </div>
  );
}
