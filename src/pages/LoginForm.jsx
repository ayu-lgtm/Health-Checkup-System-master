import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Box,
  Modal,
} from "@mui/material";
import {
  Logout,
  ErrorOutline as ErrorOutlineIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

// import authData from "./AuthData.json";
import isAuthenticated from '../services/AuthService';


export default function LoginForm() {
  const [formValues, setFormValues] = React.useState({
    userId: "",
    password: "",
    captchaValue: "",
  });
  const [userIdHelperText, setUserIdHelperText] =
    React.useState("Enter UserID");
  const [passwordHelperText, setPasswordHelperText] =
    React.useState("Enter password");
  const [captchaHelperText, setCaptchaHelperText] = React.useState(
    "Enter captcha value"
  );
  const [captchaText, setCaptchaText] = React.useState(generateCaptcha());
  const [loading, setLoading] = React.useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const canvasRef = useRef(null);
  const [modalMessage, setModalMessage] = useState("");

  function generateCaptcha() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return captcha;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = "25px Roboto Slab";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(captchaText, canvas.width / 2, 55);
  }, [captchaText]);

  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    drawCaptcha();
  };

  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = "25px Roboto Slab";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(captchaText, canvas.width / 2, 55);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { userId, password, captchaValue } = formValues;

      const IsAuthenticated = await isAuthenticated(
        userId,
        password,
      );

      console.log(IsAuthenticated);

      if (captchaValue.toUpperCase() !== captchaText.toUpperCase() &&IsAuthenticated) {
        setModalMessage("Login successful!");
        setModalShow(true);
      } else {
        setModalMessage(
          "Authentication failed: Invalid credentials or captcha value"
        );
        setModalShow(true);
        refreshCaptcha();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setModalMessage("Authentication error: " + error.message);
      setModalShow(true);
    } finally {
      setLoading(false);
    }
  };

  // const authenticateUser = async (userId, password, captchaValue) => {
  //   try {
  //     const { userId: expectedUserId, password: expectedPassword } = authData;

  //     if (
  //       userId === expectedUserId &&
  //       password === expectedPassword &&
  //       captchaValue.toUpperCase() === captchaText.toUpperCase()
  //     ) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } catch (error) {
  //     console.error("Authentication error:", error);
  //     return false;
  //   }
  // };

  // const authenticateUser = async (userId, password, captchaValue) => {
  //   try {
  //     const response = await fetch('/api/v1/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         userId: userId,
  //         password: password,
  //         captchaValue: captchaValue
  //       }),
  //     });
  //     if (!response.ok) {
  //       throw new Error('Authentication failed');
  //     }
  //     const data = await response.json();
  //     const token = data.token; // Assuming the token is returned in the response
  //     return token;
  //   } catch (error) {
  //     console.error('Authentication error:', error);
  //     throw error;
  //   }
  // };

  
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleInputFocus = (field) => {
    switch (field) {
      case "userId":
        setUserIdHelperText("Please enter user ID");
        break;
      case "password":
        setPasswordHelperText("Please enter password");
        break;
      case "captchaValue":
        setCaptchaHelperText("Please enter captcha value");
        break;
      default:
        break;
    }
  };

  const handleInputBlur = (field) => {
    switch (field) {
      case "userId":
        if (!formValues.userId) {
          setUserIdHelperText("Enter UserID");
        }
        break;
      case "password":
        if (!formValues.password) {
          setPasswordHelperText("Enter password");
        }
        break;
      case "captchaValue":
        if (!formValues.captchaValue) {
          setCaptchaHelperText("Enter captcha value");
        }
        break;
      default:
        break;
    }
  };

  const handleRefreshCaptcha = () => {
    refreshCaptcha();
  };

  return (
    <Box
      my={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      p={2}
      mr={4}
    >
      <div className="header">
        <img
          src="/images/tata_logo.png"
          className="logo"
          alt="Tata Steel Logo"
        />
        <p className="subtitle">LIMS Sample Collection System</p>
      </div>
      <div className="login_card">
        <Card
          className="card"
          sx={{
            maxWidth: 400,
            position: "relative",
            boxShadow: 4,
            overflow: "visible",
          }}
        >
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "1rem",
                marginBottom: "2rem",
              }}
            >
              Login
              <IconButton
                sx={{
                  position: "absolute",
                  left: "-24px",
                  background: "#215eb2",
                  borderRadius: "50%",
                  color: "white",
                  boxShadow: 1,
                  border: "none",
                  zIndex: 1,
                }}
              >
                <Logout sx={{ fontSize: 28 }} />
              </IconButton>
            </Typography>

            <form
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <TextField
                error={!formValues.userId}
                id="userId"
                label="User ID"
                value={formValues.userId}
                onChange={handleInputChange}
                onFocus={() => handleInputFocus("userId")}
                onBlur={() => handleInputBlur("userId")}
                helperText={userIdHelperText}
                variant="standard"
                fullWidth
                required
                InputProps={{
                  endAdornment:
                    formValues.userId && formValues.userId.length >= 6 ? (
                      <InputAdornment position="end"></InputAdornment>
                    ) : (
                      <InputAdornment position="end">
                        {formValues.userId && formValues.userId.length > 0 && (
                          <ErrorOutlineIcon color="error" />
                        )}
                      </InputAdornment>
                    ),
                }}
              />
              <TextField
                error={!formValues.password}
                id="password"
                label="Password"
                type="password"
                value={formValues.password}
                onChange={handleInputChange}
                onFocus={() => handleInputFocus("password")}
                onBlur={() => handleInputBlur("password")}
                helperText={passwordHelperText}
                variant="standard"
                fullWidth
                required
                InputProps={{
                  endAdornment:
                    formValues.userId && formValues.userId.length >= 6 ? (
                      <InputAdornment position="end"></InputAdornment>
                    ) : (
                      <InputAdornment position="end">
                        {formValues.userId && formValues.userId.length > 0 && (
                          <ErrorOutlineIcon color="error" />
                        )}
                      </InputAdornment>
                    ),
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <TextField
                  error={!formValues.captchaValue}
                  id="captchaValue"
                  label="Captcha Value"
                  value={formValues.captchaValue}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus("captchaValue")}
                  onBlur={() => handleInputBlur("captchaValue")}
                  helperText={captchaHelperText}
                  variant="standard"
                  required
                  InputProps={{
                    endAdornment:
                      formValues.userId && formValues.userId.length >= 6 ? (
                        <InputAdornment position="end"></InputAdornment>
                      ) : (
                        <InputAdornment position="end">
                          {formValues.userId &&
                            formValues.userId.length > 0 && (
                              <ErrorOutlineIcon color="error" />
                            )}
                        </InputAdornment>
                      ),
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "#000000",
                    marginLeft: { xs: 1, sm: 3 }, // Adjust the left margin for different screen sizes
                  }}
                  onClick={handleRefreshCaptcha}
                >
                  <span
                    className="unselectable"
                    style={{
                      marginRight: { xs: 1, sm: 3 }, // Adjust the right margin for different screen sizes
                      fontSize: { xs: "1rem", sm: "1.5rem" }, // Adjust the font size for different screen sizes
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      id="captchaCanvas"
                      className="capcode"
                      width="110"
                      height="90"
                      onClick={drawCaptcha}
                    ></canvas>
                  </span>
                  <RefreshIcon />
                </Typography>
              </div>

              <CardContent
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ width: "45%", padding: "0.75rem 1rem" }}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </CardContent>
            </form>
          </CardContent>
        </Card>
      </div>
      <Modal open={modalShow} onClose={() => setModalShow(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {modalMessage}
          </Typography>
          <Button
            onClick={() => setModalShow(false)}
            sx={{ marginLeft: "auto" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
