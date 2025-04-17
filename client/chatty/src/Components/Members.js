import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

function Members({ name, userImage, isAdmin }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" mt={2}>
      {userImage ? (
        <Avatar src={userImage} sx={{ height: 50, width: 50 }} />
      ) : (
        <Avatar sx={{ height: 50, width: 50 }}>
          {name?.[0]?.toUpperCase() || "?"}
        </Avatar>
      )}

      <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>

      {isAdmin && <AdminPanelSettingsIcon color="primary" />}
    </Stack>
  );
}

export default Members;
