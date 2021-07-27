import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";

import EditIcon from "@material-ui/icons/Edit";

import EditDialog from "./EditAccessDialog";
import { formatAMPM, timeDiffCalc, getReadableDate } from "../utils";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function getValidDate(row) {
  const { access, checkout } = row;
  const accessDate = access?.toDate ? access.toDate() : new Date(access);

  const checkoutDate = checkout?.toDate
    ? checkout.toDate()
    : new Date(checkout);
  return { accessDate, checkoutDate: checkout ? checkoutDate : null, ...row };
}

export default function BasicTable({ rows, staffId, fetchMoreData }) {
  const classes = useStyles();
  const [open, setOpen] = useState();
  const [selectedAccess, setSelectedAccess] = useState();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Entrada</TableCell>
            <TableCell>Salida</TableCell>
            <TableCell>Tiempo Total</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => {
            const { accessDate, checkoutDate } = getValidDate(row);

            return (
              <TableRow key={row.id}>
                <TableCell>{getReadableDate(accessDate)}</TableCell>
                <TableCell>{formatAMPM(accessDate)}</TableCell>
                <TableCell>
                  {checkoutDate ? formatAMPM(checkoutDate) : ""}
                </TableCell>
                <TableCell>
                  {checkoutDate
                    ? timeDiffCalc(checkoutDate, accessDate)
                    : "No ha salido"}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      setSelectedAccess(getValidDate(row));
                      setOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        {selectedAccess ? (
          <EditDialog
            accessDate={selectedAccess?.accessDate}
            checkoutDate={
              selectedAccess.checkoutDate
                ? selectedAccess.checkoutDate
                : undefined
            }
            id={selectedAccess.id}
            open={open}
            setOpen={setOpen}
            staffId={staffId}
          />
        ) : null}
      </Table>
    </TableContainer>
  );
}
