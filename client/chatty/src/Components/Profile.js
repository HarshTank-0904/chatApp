import * as React from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
  Typography,
  Tooltip,
  Stack,
  Modal,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import Logout from "@mui/icons-material/Logout";
import AttachEmailSharpIcon from "@mui/icons-material/AttachEmailSharp";
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const lightTheme = useSelector((state) => state.themeKey);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const userImage = localStorage.getItem("userImage");
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("email");

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleCloseModal = () => setShowModal(false);

  const handleLogout = () => {
    [
      "token",
      "userId",
      "userName",
      "conversations",
      "email",
      "userImage",
    ].forEach((key) => localStorage.removeItem(key));
    handleClose();
    navigate("/");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "60%", sm: "40%", md: "30%", lg: "30%", xl: "20%" },
    height: { xs: "auto", sm: "auto", md: "auto", lg: "auto", xl: "auto" },
    maxHeight: "90vh",
    overflowY: "auto",
    bgcolor: lightTheme ? "background.paper" : "#C5BAAF",
    boxShadow: 24,
    borderRadius: "5%",
    p: 4,
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Options">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{ width: 42, height: 42 }}
              src={
                userImage ? `data:image/jpeg;base64,${userImage}` : undefined
              }
            >
              {userName?.[0] || "U"}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setShowModal(true);
          }}
        >
          <Avatar /> Profile
        </MenuItem>

        <MenuItem onClick={() => navigate("create-groups")}>
          <GroupsIcon style={{ marginRight: 10 }} fontSize="large" />
          New Group
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="column" spacing={2} alignItems="center">
            <motion.div
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  boxShadow: 15,
                }}
                src={
                  userImage ? `data:image/jpeg;base64,${userImage}` : undefined
                }
              >
                {userName?.[0] || "U"}
              </Avatar>
            </motion.div>

            <Typography fontSize={"1.5rem"} fontFamily={"monospace"}>
              {userName}
              {userImage ? (
                <VerifiedSharpIcon sx={{ color: "#7A306C" }} />
              ) : null}
            </Typography>

            <MenuItem>
              <AttachEmailSharpIcon
                sx={{ color: "#7A306C", marginRight: "10px" }}
              />
              <Typography fontSize={"1.1rem"} fontFamily={"monospace"}>
                {userEmail}
              </Typography>
            </MenuItem>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
