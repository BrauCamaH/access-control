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

export function timeDiffCalc(dateFuture, dateNow) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  // calculate seconds
  const seconds = Math.floor(diffInMilliSeconds) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = "";
  if (days > 0) {
    difference += days === 1 ? `${days} dia, ` : `${days} dias, `;
  }

  difference += hours === 1 ? `${hours} hora, ` : `${hours} horas, `;

  difference += hours === 1 ? `${minutes} minuto` : `${minutes} minutos, `;

  difference += seconds === 1 ? `${seconds} segundo` : `${seconds} segundos`;

  return difference;
}

export function GetReadableDate(date) {
  var meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return (
    date.getDate() +
    " de " +
    meses[date.getMonth()] +
    " de " +
    date.getFullYear()
  );
}

export function getDateTimeLocalToString(date) {
  return new Date(date.toString().split("GMT")[0] + " UTC")
    .toISOString()
    .split(".")[0];
}
