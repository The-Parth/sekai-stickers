import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

export default function Info({ open, handleClose, config }) {
  const dialogStyle = {
    maxWidth: "300px",
    margin: "auto",
  };

  const contentStyle = {
    fontSize: "0.7rem",
  };

  const titleStyle = {
    fontSize: "0.9rem",
  };

  const listItemTextStyle = {
    fontSize: "0.7rem",
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: dialogStyle }}
      >
        <DialogTitle id="alert-dialog-title" style={titleStyle}>
          Info
        </DialogTitle>
        <DialogContent style={contentStyle}>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="h6" component="h3" style={titleStyle}>
              This tool made possible by:
            </Typography>
            <List>
              <ListItem
                button
                onClick={() =>
                  (window.location.href = "https://github.com/theoriginalayaka")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Ayaka"
                    src="https://avatars.githubusercontent.com/theoriginalayaka"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Ayaka"
                  secondary="for the original idea"
                  primaryTypographyProps={{ style: listItemTextStyle }}
                  secondaryTypographyProps={{ style: listItemTextStyle }}
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  (window.location.href = "https://github.com/modder4869")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Modder4869"
                    src="https://avatars.githubusercontent.com/modder4869"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Modder4869"
                  secondary="for the help with the code"
                  primaryTypographyProps={{ style: listItemTextStyle }}
                  secondaryTypographyProps={{ style: listItemTextStyle }}
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  (window.location.href =
                    "https://www.reddit.com/r/ProjectSekai/comments/x1h4v1/after_an_ungodly_amount_of_time_i_finally_made/")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="u/SherenPlaysGames"
                    src="https://styles.redditmedia.com/t5_mygft/styles/profileIcon_n1kman41j5891.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="u/SherenPlaysGames"
                  secondary="for the original stamps"
                  primaryTypographyProps={{ style: listItemTextStyle }}
                  secondaryTypographyProps={{ style: listItemTextStyle }}
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  (window.location.href = 
                    "https://github.com/The-Parth")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Parth"
                    src="https://avatars.githubusercontent.com/The-Parth"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Parth B"
                  secondary="I made this modification"
                  primaryTypographyProps={{ style: listItemTextStyle }}
                  secondaryTypographyProps={{ style: listItemTextStyle }}
                />
              </ListItem>
              <ListItem
                button
                onClick={() =>
                  (window.location.href =
                    "https://github.com/The-Parth/sekai-stickers/graphs/contributors")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="Contributors"
                    src="https://avatars.githubusercontent.com/u/583231"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Contributors"
                  secondary="for the help with the code"
                  primaryTypographyProps={{ style: listItemTextStyle }}
                  secondaryTypographyProps={{ style: listItemTextStyle }}
                />
              </ListItem>
            </List>
            <Typography variant="h6" component="h3" style={titleStyle}>
              Source Code
            </Typography>
            <List>
              <ListItem
                button
                onClick={() =>
                  (window.location.href =
                    "https://github.com/The-Parth/sekai-stickers")
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt="GitHub"
                    src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="GitHub"
                  secondary="Source Code"
                  primaryTypographyProps={{ style: listItemTextStyle }}
                  secondaryTypographyProps={{ style: listItemTextStyle }}
                />
              </ListItem>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}