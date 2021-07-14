import { Capacitor } from "@capacitor/core";

export function isAndroid() {
  return Capacitor.getPlatform() === "android";
}

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

//get the string or days, hours and minutes of the difference between two dates
export function timeDiffCalc(date1, date2) {
  let diff = Math.abs(date1.getTime() - date2.getTime());
  let oneDay = 1000 * 60 * 60 * 24;
  let oneHour = 1000 * 60 * 60;
  let oneMinute = 1000 * 60;
  let days = Math.floor(diff / oneDay);
  let hours = Math.floor((diff % oneDay) / oneHour);
  let minutes = Math.floor(((diff % oneDay) % oneHour) / oneMinute);

  let strTime = "";
  if (days > 0) {
    strTime += days + (days === 1 ? " día, " : " días, ");
  }
  strTime += hours + (hours === 1 ? " hora, " : " horas, ");
  strTime += minutes + (minutes === 1 ? " minuto, " : " minutos");

  return strTime;
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

export function getFirestoreDoc(doc) {
  return { id: doc.id, ...doc.data() };
}

export function getFirestoreCollection(snapshot) {
  return snapshot.docs.map((doc) => getFirestoreDoc(doc));
}
