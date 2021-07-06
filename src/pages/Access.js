import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AccessDialog from "../components/AccessDialog";

import { Button } from "@material-ui/core";

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
}));

export default function Access() {
  const classes = useStyles();

  const [isCheckout, setIsCheckout] = useState(false);
  const [openAccessDialog, setOpenAccessDialog] = useState(false);

  return (
    <div>
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
      <AccessDialog
        open={openAccessDialog}
        setOpen={setOpenAccessDialog}
        isCheckout={isCheckout}
      />
    </div>
  );
}
