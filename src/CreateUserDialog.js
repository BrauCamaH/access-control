import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useForm } from "react-hook-form";

import { db } from "./firebase";

export default function FormDialog({ open, setOpen }) {
  const { register, handleSubmit } = useForm();

  const handleClose = () => {
    setOpen(false);
  };

  const [rfidTag, setRfidTag] = useState("");
  const onSubmit = (data) => {
    console.log(data);
    const { name, firstLastName, secondLastName, email, birthday, address } =
      data;
    if (!rfidTag) {
      return;
    }

    db.collection("users")
      .doc(rfidTag)
      .set({
        name: `${name} ${firstLastName} ${secondLastName}`,
        email,
        birthday,
        address,
        status: "registered",
      })
      .then((docRef) => {
        console.log("Document written");
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    window.api.requestTagId();
  }, []);

  useEffect(() => {
    window.api.getTagId((data) => setRfidTag(data));
  }, [rfidTag]);

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="form-dialog-title">Crear Usuario</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Para crear un usuario es neceario tener una tarjeta rfid.
            </DialogContentText>
            <TextField
              value={rfidTag}
              fullWidth
              label="Identificador"
              disabled
              required
            />
            <TextField fullWidth label="Nombres" {...register("name")} />
            <TextField
              fullWidth
              label="Primer Apellido"
              {...register("firstLastName")}
            />
            <TextField
              fullWidth
              label="Segundo Apellido"
              {...register("secondLastName")}
            />
            <TextField
              fullWidth
              label="Correo Electronico"
              {...register("email")}
            />

            <TextField fullWidth label="Domicilio" {...register("address")} />
            <TextField
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              label="Fecha de Nacimiendo"
              type="date"
              {...register("birthday")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Crear Usuario
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
