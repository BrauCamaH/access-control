import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import LoadingBackdrop from "./LoadingBackdrop";
import Notification from "./Notification";

import audioSrc from "../beep.mp3";

import { db } from "../firebase";

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes() || "";
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export default function FormDialog({ open, setOpen, isCheckout }) {
  const audio = useRef(new Audio(audioSrc));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validTag, setValidTag] = useState(false);

  const [staffData, setStaffData] = useState(null);

  const [statusMessage, setStatusMessage] = useState("");

  const [rfidTag, setRfidTag] = useState("");

  function clearData() {
    setStaffData(null);
    setValidTag(false);
    setRfidTag(null);
  }

  function createAccess() {
    let staffRef = db.collection("staff").doc(staffData.tagId);

    db.collection("staff")
      .doc(staffData.tagId)
      .collection("access")
      .add({
        access: new Date(),
      })
      .then((docRef) => {
        const savedDate = new Date();

        staffRef
          .update({
            currentAccessId: docRef.id,
            status: "accessed",
          })
          .then((doc) => {
            console.log(doc);
            setStatusMessage(
              `${"Entrada "} Guardada el ${savedDate.toLocaleDateString()} a las ${formatAMPM(
                savedDate
              )}`
            );
            setLoading(false);
            setSuccess(true);
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error adding document: ", error);
          });
        console.log("Access Saved");

        handleClose();
      })
      .catch((error) => {
        setLoading(false);
        setStatusMessage(`Revise conexion a internet`);
        setError(true);

        console.error("Error adding document: ", error);
      });
  }

  function setCheckout() {
    let staffRef = db.collection("staff").doc(staffData.tagId);

    staffRef
      .collection("access")
      .doc(staffData.currentAccessId)
      .update({
        checkout: new Date(),
      })
      .then((docRef) => {
        const savedDate = new Date();

        staffRef
          .update({
            currentAccessId: null,
            status: "finished",
          })
          .then((doc) => {
            setStatusMessage(
              `${"Salida "} Guardada el ${savedDate.toLocaleDateString()} a las ${formatAMPM(
                savedDate
              )}`
            );
            setLoading(false);
            setSuccess(true);
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error adding document: ", error);
          });
        console.log("Access Saved");

        handleClose();
      })
      .catch((error) => {
        setLoading(false);
        setStatusMessage(`Revise conexion a internet`);
        setError(true);

        console.error("Error adding document: ", error);
      });
  }

  const handleAccess = (e) => {
    e.preventDefault();

    if (!validTag) {
      setError(true);
      setStatusMessage("No se ha ingresado una tarjeta registrada");
      return;
    }

    if (isCheckout && staffData.status === "finished") {
      setStatusMessage("Ya se ha salido");
      setError(true);
      return;
    }

    if (!isCheckout && staffData.status === "accessed") {
      setStatusMessage("Ya se ha accedido");
      setError(true);
      return;
    }

    setLoading(true);

    if (isCheckout) {
      setCheckout();
      return;
    }

    createAccess();
  };

  const handleClose = () => {
    setOpen(false);
    window.api.removeEventListeners("getTagId");
  };

  function handleEnter() {
    clearData();
    window.api.getTagId((data) => {
      audio.current.play();
      console.log("setting data...");
      setRfidTag(data);
    });
  }

  useEffect(() => {
    if (!rfidTag) return;
    setValidTag(false);
    setLoading(true);

    db.collection("staff")
      .where("tagId", "==", rfidTag)
      .get()
      .then((snap) => {
        console.log(snap.docs);
        setLoading(false);

        const doc = snap.docs[0];
        if (doc) {
          setValidTag(true);

          console.log(doc.data());
          setStaffData({ id: doc.id, ...doc.data() });

          return;
        }
        setError(true);
        setStatusMessage("La tarjeta no esta registrada");
        setValidTag(false);
        setStaffData(null);

        console.log("no existe usuario");
      })
      .catch((error) => {
        setValidTag(false);
        console.log(error);
        setLoading(false);
      });
  }, [rfidTag]);

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
        message={statusMessage}
        type="success"
      />
      <Notification
        open={error}
        setOpen={setError}
        message={statusMessage}
        type="error"
      />
      <Dialog
        open={open}
        onClose={handleClose}
        onEnter={handleEnter}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleAccess}>
          <DialogTitle id="form-dialog-title">
            {isCheckout ? "Registrar Salida" : "Registrar Entrada"}
          </DialogTitle>
          <DialogContent>
            {!validTag ? (
              <DialogContentText>
                Acerque la tarjeta al lector...
              </DialogContentText>
            ) : null}
            <DialogContentText>
              {staffData ? staffData.name : ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Continuar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
