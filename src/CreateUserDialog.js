import React, { useState, useRef, useEffect } from "react";
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

import audioSrc from "./beep.mp3";

import { db } from "./firebase";

export default function FormDialog({ open, setOpen }) {
  const audio = useRef(new Audio(audioSrc));

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState("");

  const [rfidTag, setRfidTag] = useState("");
  const onSubmit = (data) => {
    console.log(data);
    const { name, firstLastName, secondLastName, email, birthday, address } =
      data;
    if (!rfidTag) {
      setError(true);
      setResult(`No se a ingreso un identificador`);
      return;
    }

    setLoading(true);
    db.collection("staff")
      .doc()
      .set({
        name: `${name} ${firstLastName} ${secondLastName}`,
        email,
        birthday,
        address,
        status: "registered",
        tagId: rfidTag,
        currentAccessId: null,
      })
      .then((docRef) => {
        console.log("Document written", docRef);
        window.location.reload();
        setResult(`Usuario creado con id ${rfidTag}`);

        setLoading(false);
        setSuccess(true);
        handleClose();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        setLoading(false);
        setError(true);
      });
  };

  const handleClose = () => {
    setOpen(false);
    setRfidTag("");
    clearErrors();
    window.api.removeEventListeners("getTagId");
  };

  function handleEnter() {
    window.api.getTagId((data) => {
      setRfidTag(data);
      audio.current.play();
    });
  }

  useEffect(() => {
    return () => {
      window.api.removeEventListeners("getTagId");
    };
  }, []);

  return (
    <div>
      <LoadingBackdrop open={loading} />
      <Notification
        open={success}
        setOpen={setSuccess}
        type="success"
        message={result}
      />
      <Notification
        open={error}
        setOpen={setError}
        type="error"
        message={result}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        onEnter={handleEnter}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogTitle id="form-dialog-title">Ingresar Empleado</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Para crear un empledo es necesario tener una tarjeta rfid.
            </DialogContentText>
            <TextField
              value={rfidTag}
              fullWidth
              label="Identificador"
              disabled
              required
            />
            <TextField
              fullWidth
              label="Nombre"
              error={errors.name}
              {...register("name", { required: true })}
              required
            />
            <TextField
              fullWidth
              label="Primer Apellido"
              error={errors.firstLastName}
              required
              {...register("firstLastName", { required: true })}
            />
            <TextField
              fullWidth
              label="Segundo Apellido"
              error={errors.secondLastName}
              {...register("secondLastName")}
            />
            <TextField
              fullWidth
              type="email"
              error={errors.birthday}
              label="Correo Electronico"
              {...register("email")}
              required
            />
            <TextField
              fullWidth
              label="Domicilio"
              {...register("address", { required: true })}
              required
            />
            <TextField
              fullWidth
              error={errors.birthday}
              InputLabelProps={{
                shrink: true,
              }}
              label="Fecha de Nacimiendo"
              type="date"
              {...register("birthday", { required: true })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cerrar
            </Button>
            <Button type="submit" color="primary">
              Crear Empleado
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
