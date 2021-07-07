import React, { useState, useRef, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useForm } from "react-hook-form";

import LoadingBackdrop from "./LoadingBackdrop";
import Notification from "./Notification";

export default function FormDialog({
  open,
  setOpen,
  accessDate,
  checkoutDate,
}) {
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
  const onSubmit = (data) => {};

  const handleClose = () => {
    setOpen(false);
    setRfidTag("");
    clearErrors();
    window.api.removeEventListeners("getTagId");
  };

  function handleEnter() {}

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
          <DialogTitle id="form-dialog-title">Modificar Acceso</DialogTitle>
          <DialogContent>
            {accessDate ? (
              <TextField
                fullWidth
                error={errors.birthday}
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={
                  new Date(accessDate.toString().split("GMT")[0] + " UTC")
                    .toISOString()
                    .split(".")[0]
                }
                label="Entrada"
                type="datetime-local"
                {...register("access", { required: true })}
                required
              />
            ) : null}
            {checkoutDate ? (
              <TextField
                fullWidth
                error={errors.birthday}
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue={
                  new Date(checkoutDate.toString().split("GMT")[0] + " UTC")
                    .toISOString()
                    .split(".")[0]
                }
                label="Salida"
                type="datetime-local"
                {...register("checkout", { required: true })}
                required
              />
            ) : null}
            {!checkoutDate ? (
              <TextField
                fullWidth
                error={errors.birthday}
                InputLabelProps={{
                  shrink: true,
                }}
                label="Salida"
                type="datetime-local"
                {...register("checkout", { required: true })}
              />
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cerrar
            </Button>
            <Button type="submit" color="primary">
              Actualizar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
