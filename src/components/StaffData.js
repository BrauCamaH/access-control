import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
      <CardContent>
        <Typography variant="h5" component="h2">
          {staff.name}
        </Typography>
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
      <CardActions>
        <Button
          size="small"
          color={staff.status === "accessed" ? "primary" : "secondary"}
        >
          {getStatusInfo(staff.status)}
        </Button>
      </CardActions>
    </Card>
  );
}
