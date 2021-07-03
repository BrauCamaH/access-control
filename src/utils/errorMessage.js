export function getErrorMesssage(code) {
  const authErrors = {
    "email-already-in-use": "El correo electrónico es usado por otra cuenta.",
    "weak-password": "La contraseña debe ser igual o mayor a 6 caracteres.",
    "network-request-failed": "No hay conexión a internet",
    "wrong-password": "Error en email o contraseña.",
    "unverified-email": "Error no verificado.",
    "user-mismatch": "Error en email o contraseña.",
    "invalid-email": "El correo electrónico no es valido",
    "user-not-found": "Error en email o contraseña",
  };

  if (!code) {
    return "";
  }

  code = code.split("/")[1];
  if (authErrors[code]) {
    return authErrors[code];
  } else {
    return "Ha ocurrido un error desconocido " + code;
  }
}
