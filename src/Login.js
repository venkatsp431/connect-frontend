import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Snackbar,
} from "@mui/material";

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

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" gutterBottom>
            Login
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
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </form>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" gutterBottom>
            Signup
          </Typography>
          {signupSuccess && (
            <Typography variant="body1" color="success">
              {signupMessage}
            </Typography>
          )}
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
            <Button type="submit" variant="contained" color="primary">
              Signup
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
