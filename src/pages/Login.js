import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { NavLink } from "react-router-dom";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";

import Notification from "../components/Notification";
import LoadingBackdrop from "../components/LoadingBackdrop";

import { auth } from "../firebase";
import { getErrorMesssage } from "../utils/errorMessage";
import { isAndroid } from "../utils";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
    },
  },
}));

export default function Login() {
  const classes = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState();

  const [loading, setLoading] = useState(false);

  const signInWithEmailAndPassword = async (email, password) => {
    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const onSubmit = ({ email, password }) => {
    signInWithEmailAndPassword(email, password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Notification
        type={"error"}
        open={error}
        setOpen={setError}
        message={getErrorMesssage(error?.code)}
      />
      <LoadingBackdrop open={loading} />
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Ingresar con usuario administrador
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            {...register("email", {
              required: true,
            })}
            error={errors.email}
            helperText={errors.email && "Se requiere email"}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: true,
            })}
            error={errors.password}
            helperText={errors.password && "Se requiere contraseña"}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Ingresar
          </Button>
          {!isAndroid() ? (
            <NavLink className={classes.link} to="/">
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.submit}
              >
                Regresar a registro
              </Button>
            </NavLink>
          ) : null}
        </form>
      </div>
    </Container>
  );
}
