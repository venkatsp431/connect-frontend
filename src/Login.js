import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Snackbar,
  CircularProgress, // Import CircularProgress for loading spinner
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const AuthPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
  });

  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupMessage, setSignupMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while waiting for response
    try {
      const response = await axios.post(
        "https://connect-backend-dzrh.onrender.com/api/users/login",
        loginData
      );
      console.log(response);
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem(
        "ConnectUser",
        JSON.stringify(response.data.data.user)
      );
      // Redirect to home page after successful login
      window.location.href = "/chat";
    } catch (error) {
      console.error("Login Error:", error);
      // Handle login error
    } finally {
      setLoading(false); // Set loading back to false after response
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while waiting for response
    try {
      const response = await axios.post(
        "https://connect-backend-dzrh.onrender.com/api/users/signup",
        signupData
      );
      console.log(response);
      setSignupSuccess(true);
      setSignupMessage("Signup Successfull. Please login to continue");
      setOpenSnackbar(true);
      // Clear signup form data
      setSignupData({
        name: "",
        email: "",
        password: "",
        username: "",
      });
    } catch (error) {
      console.error("Signup Error:", error);
      setSignupMessage("Signup Failed. Please try again");
      // Handle signup error
    } finally {
      setLoading(false); // Set loading back to false after response
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 8 }}
      >
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" gutterBottom align="center">
            <LockOutlinedIcon fontSize="large" sx={{ mr: 1 }} />
            Connect - Login
          </Typography>
          <form onSubmit={handleLoginSubmit}>
            <TextField
              label="Email"
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h5" gutterBottom align="center">
            <LockOutlinedIcon fontSize="large" sx={{ mr: 1 }} />
            Connect - Signup
          </Typography>
          <form onSubmit={handleSignupSubmit}>
            <TextField
              label="Name"
              type="text"
              name="name"
              value={signupData.name}
              onChange={handleSignupChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Username"
              type="text"
              name="username"
              value={signupData.username}
              onChange={handleSignupChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Signup"}
            </Button>
          </form>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={signupMessage}
      />
    </Container>
  );
};

export default AuthPage;
