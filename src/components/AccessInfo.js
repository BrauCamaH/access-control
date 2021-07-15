import React from "react";
import {
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { green, red } from "@material-ui/core/colors";

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MeetingRoom from "@material-ui/icons/MeetingRoom";
import AccessIcon from "@material-ui/icons/AccessTime";

import { formatAMPM, isCheckout } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  danger: {
    color: red[500],
    "&:hover": {
      color: red[600],
    },
  },
  success: {
    color: green[500],
    "&:hover": {
      color: green[600],
    },
  },
}));

export default function AccessInfo({ access }) {
  const classes = useStyles();
  return (
    <div>
      <ListItem key={access.id} button>
        <ListItemAvatar>
          <Avatar>
            <AccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${access.date
            .toDate()
            .toLocaleDateString()} a las ${formatAMPM(access.date.toDate())}`}
        />
        <ListItemSecondaryAction>
          {isCheckout(access.type) ? (
            <ExitToAppIcon className={classes.danger} />
          ) : (
            <MeetingRoom className={classes.success} />
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  );
}
