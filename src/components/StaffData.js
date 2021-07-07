import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import EditIcon from "@material-ui/icons/Edit";

import EditDialog from "../components/EditStaffDialog";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function StaffData({ staff }) {
  const classes = useStyles();

  const [open, setOpen] = useState();

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        title={staff.name}
        action={
          <IconButton
            aria-label="settings"
            onClick={() => {
              setOpen(true);
            }}
          >
            <EditIcon />
          </IconButton>
        }
      ></CardHeader>
      <CardContent>
        <Typography className={classes.pos} variant="body2" component="p">
          Email: {staff.email}
        </Typography>
        <Typography className={classes.pos} variant="body2" component="p">
          Domicilio: {staff.address}
        </Typography>
        <Typography className={classes.pos} variant="body2" component="p">
          Fecha de Nacimiento: {staff.birthday}
        </Typography>
      </CardContent>
      <EditDialog open={open} setOpen={setOpen} />
    </Card>
  );
}
