import React, { useState, useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useForm, Controller } from "react-hook-form";

import LoadingBackdrop from "./LoadingBackdrop";
import Notification from "./Notification";

import audioSrc from "../beep.mp3";

import { db } from "../firebase";

export default function FormDialog({ open, setOpen, staffData }) {
  const audio = useRef(new Audio(audioSrc));

  const {
    reset,
    handleSubmit,
    formState: { errors },
    clearErrors,
    control,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState("");

  const [rfidTag, setRfidTag] = useState(staffData.tagId);

  const [state, setState] = useState({
    name: staffData.name,
    email: staffData.email,
    address: staffData.address,
    birthday: staffData.birthday,
  });

  const updateFieldValue = (fieldName) => {
    return (event) => {
      setState({ ...state, [fieldName]: event.target.value });
    };
  };

  const onSubmit = (data) => {
    console.log(data);
    const { name, email, birthday, address } = state;

    setLoading(true);
    db.collection("staff")
      .doc(staffData.id)
      .update({
        name,
        email,
        birthday,
        address,
        tagId: rfidTag,
      })
      .then((docRef) => {
        console.log("Document written", docRef);
        setResult(`Se ha actualizado usuario`);

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
    setState({
      name: staffData.name,
      email: staffData.email,
      address: staffData.address,
      birthday: staffData.birthday,
    });
    reset();

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
          <DialogTitle id="form-dialog-title">Editar Empleado</DialogTitle>
          <DialogContent>
            <TextField
              value={rfidTag}
              fullWidth
              label="Identificador"
              disabled
              required
            />

            <Controller
              name="name"
              control={control}
              defaultValue={state.name}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  onChange={updateFieldValue("name")}
                  value={state?.name}
                  label="Nombre"
                  error={errors.name}
                  required
                  {...field}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              defaultValue={state.email}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  value={state?.email}
                  onChange={updateFieldValue("email")}
                  type="email"
                  error={errors.email}
                  label="Correo Electronico"
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              defaultValue={state.address}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  error={errors.address}
                  value={state?.address}
                  onChange={updateFieldValue("address")}
                  label="Domicilio"
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="birthday"
              control={control}
              defaultValue={state.birthday}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  fullWidth
                  value={state?.birthday}
                  onChange={updateFieldValue("birthday")}
                  error={errors.birthday}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Fecha de Nacimiendo"
                  type="date"
                  required
                  {...field}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cerrar
            </Button>
            <Button type="submit" color="primary">
              Modificar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
