import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useForm, Controller } from "react-hook-form";

import LoadingBackdrop from "./LoadingBackdrop";
import Notification from "./Notification";

import { getDateTimeLocalToString } from "../utils";
import { db } from "../firebase";
import { useAccessDispatch } from "../providers/AccessProvider";

export default function FormDialog({
  open,
  setOpen,
  accessDate,
  checkoutDate,
  id,
  staffId,
}) {
  const {
    handleSubmit,
    formState: { errors },
    clearErrors,
    control,
    setValue,
  } = useForm();
  const [state, setState] = useState({});

  const dispatch = useAccessDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState("");

  const onSubmit = (data) => {
    console.log(data);

    const { access, checkout } = data;

    setLoading(true);
    db.collection("staff")
      .doc(staffId)
      .collection("access")
      .doc(id)
      .update({
        access: new Date(access),
        checkout: checkout !== "" ? new Date(checkout) : null,
      })
      .then((docRef) => {
        console.log("Document written", docRef);

        dispatch({
          type: "UPDATE_ACCESS",
          payload: {
            id,
            access,
            checkout: checkout !== "" ? checkout : null,
          },
        });

        setResult(`Se ha modificado acceso`);
        setLoading(false);
        setSuccess(true);
        handleClose();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        setResult(`Error al intentar modificar acceso`);

        setLoading(false);
        setError(true);
      });
  };

  const updateFieldValue = (fieldName) => {
    return (event) => {
      setState({ ...state, [fieldName]: event.target.value });
    };
  };

  const handleClose = () => {
    setOpen(false);
    clearErrors();
    window.api.removeEventListeners("getTagId");
  };

  useEffect(() => {
    setValue("access", getDateTimeLocalToString(accessDate));

    checkoutDate
      ? setValue("checkout", getDateTimeLocalToString(checkoutDate))
      : setValue("checkout", "");
  }, [accessDate, checkoutDate, setValue]);

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
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogTitle id="form-dialog-title">Modificar Acceso</DialogTitle>
          <DialogContent>
            {accessDate ? (
              <Controller
                name="access"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    {...field}
                    defaultValue={state.access}
                    onChange={updateFieldValue("access")}
                    error={errors.access}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Entrada"
                    type="datetime-local"
                    required
                  />
                )}
              />
            ) : null}
            {checkoutDate ? (
              <Controller
                name="checkout"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    defaultValue={state.checkout}
                    onChange={updateFieldValue("checkout")}
                    error={errors.checkout}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Salida"
                    type="datetime-local"
                    required
                    {...field}
                  />
                )}
              />
            ) : null}
            {!checkoutDate ? (
              <Controller
                name="checkout"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    fullWidth
                    onChange={updateFieldValue("checkout")}
                    error={errors.checkout}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Salida"
                    type="datetime-local"
                    required
                    {...field}
                  />
                )}
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
