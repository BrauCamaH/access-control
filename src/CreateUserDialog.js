import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useForm } from "react-hook-form";

import LoadingBackdrop from "./components/LoadingBackdrop";
import Notification from "./components/Notification";

import { db } from "./firebase";

export default function FormDialog({ open, setOpen }) {
  const { register, handleSubmit } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState("");

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

    setLoading(true);
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
        setResult(`Usuario creado con id ${docRef.id}`);

        setLoading(false);
        setSuccess(true);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        setLoading(false);
        setError(true);
      });
  };

  useEffect(() => {
    window.api.getTagId((data) => setRfidTag(data));
  }, [rfidTag]);

  return (
    <div>
      <LoadingBackdrop open={loading} />
      <Notification
        open={success}
        setOpen={setSuccess}
        type="success"
        message={result}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle id="form-dialog-title">Crear Usuario</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Para crear un usuario es necesario tener una tarjeta rfid.
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
            <Button onClick={handleClose} color="secondary">
              Cerrar
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
