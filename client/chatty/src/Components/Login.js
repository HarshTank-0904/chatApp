import React, { useState } from "react";
import "./myStyle.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SimpleBackdrop from "./PageLoading";
import { message } from "antd";
import { styled } from "@mui/material/styles";
import chatnow from "./Images/chatnow.png";
import Chip from "@mui/material/Chip";
import ImageIcon from "@mui/icons-material/Image";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AttachEmailSharpIcon from "@mui/icons-material/AttachEmailSharp";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Login() {
  const ENDPOINT = process.env.REACT_APP_API_KEY;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);
  const navigate = useNavigate();
  const [Image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${ENDPOINT}/user/login`, {
        name: username.trimEnd(),
        password: password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data._id);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("userImage", response.data.image);

      if (response.data.token) {
        console.log("Login successful");
        setLoading(false);
        navigate("/app/welcome");
      } else {
        console.error("Login failed: Invalid token");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      if (error.response?.status === 401) {
        messageApi.open({
          type: "error",
          content: "Invalid credentials provided",
          className: "custom-class",
          style: { marginTop: "20vh" },
        });
      }
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (username === "" || email === "" || password === "") {
      messageApi.open({
        type: "error",
        content: "Fields cannot be left blank",
        className: "custom-class",
        style: { marginTop: "20vh" },
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", Image);
    formData.append("name", username.trimEnd());
    formData.append("email", email);
    formData.append("password", password);
    setLoading(true);

    try {
      const response = await axios.post(`${ENDPOINT}/user/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Registration successful");
      setLoading(false);
      navigate("/");
      setRegister(false);
    } catch (error) {
      console.error("Registration failed:", error);

      const errorMsg =
        error?.response?.data?.error ||
        "Something went wrong. Please try again.";

      messageApi.open({
        type: "error",
        content: errorMsg,
        className: "custom-class",
        style: { marginTop: "20vh" },
      });
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  return (
    <div className="login-container">
      {contextHolder}
      <div className="image-container">
        <img
          src={chatnow}
          alt="alt"
          className="welcome-logo"
          draggable="false"
        />
      </div>

      {!register ? (
        <div className="login-box" style={{ position: "relative" }}>
          <p>Login to your account</p>
          <TextField
            label="Enter Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ boxShadow: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ boxShadow: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button variant="outlined" onClick={handleLogin}>
            Login
          </Button>

          <p style={{ cursor: "pointer" }} onClick={() => setRegister(true)}>
            Register now
          </p>
        </div>
      ) : (
        <div
          className="login-box"
          style={{ position: "relative", overflowY: "auto" }}
        >
          <Stack direction={"column"} spacing={3}>
            {Image && (
              <div style={{ position: "relative" }}>
                <Avatar
                  sx={{
                    width: "auto",
                    height: "15vh",
                    maxWidth: "150px",
                    boxShadow: 15,
                  }}
                  src={URL.createObjectURL(Image)}
                />
                <Chip
                  label="X"
                  size="small"
                  variant="outlined"
                  onClick={() => setImage(null)}
                />
              </div>
            )}

            <p>Register now</p>

            <TextField
              label="Enter Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ boxShadow: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Enter Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ boxShadow: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AttachEmailSharpIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ boxShadow: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              component="label"
              variant="contained"
              startIcon={<ImageIcon />}
              style={{
                borderRadius: "23px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.6)",
              }}
              sx={{ bgcolor: "#bd906f" }}
            >
              Profile pic (optional)
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            <Button variant="outlined" className="btn" onClick={handleRegister}>
              Register
            </Button>

            <p
              style={{
                cursor: "pointer",
                bottom: "10px",
                position: "relative",
              }}
              onClick={() => setRegister(false)}
            >
              Already have an account?
            </p>
          </Stack>
        </div>
      )}

      {loading && <SimpleBackdrop title="please wait..." />}
    </div>
  );
}
