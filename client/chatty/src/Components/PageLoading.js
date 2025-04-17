import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export default function SimpleBackdrop({ title = "Loading..." }) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      open={true}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h6" sx={{ paddingLeft: 2 }}>
        {title}
      </Typography>
    </Backdrop>
  );
}
