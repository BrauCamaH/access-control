import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";

import EditIcon from "@material-ui/icons/Edit";

import { getStatusInfo } from "../utils";

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

  console.log(staff);

  return (
    <Card className={classes.root} variant="outlined">
      <CardHeader
        title={staff.name}
        action={
          <IconButton aria-label="settings">
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
        <Chip
          label={getStatusInfo(staff.status)}
          color={staff.status === "accessed" ? "primary" : "secondary"}
        />
      </CardContent>
    </Card>
  );
}
