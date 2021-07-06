export function getStatusInfo(status) {
  return status === "accessed"
    ? "Accedio"
    : status === "finished"
    ? "Salio"
    : "No ha accedido";
}

export function isCheckout(status) {
  return status === "checkout";
}

export function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes() || "";
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}
