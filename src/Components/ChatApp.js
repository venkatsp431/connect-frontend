import React, { useState, useEffect } from "react";
import axios from "axios";
import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import AllUsersList from "./AllUsers";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const ChatApp = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const user = JSON.parse(localStorage.getItem("ConnectUser"));
  const userid = user._id;
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If token does not exist, navigate to "/"
      navigate("/");
    } else {
      fetchConversations(); // Fetch conversations if token exists
    }
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://connect-backend-dzrh.onrender.com/api/chat/conversations",
        {
          headers: {
            authorization: token,
          },
        }
      );
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleAllUsersSelect = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="chat-container">
      <div className="conversation-list">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Connect
            </Typography>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Conversations" />
          <Tab label="All Users" />
        </Tabs>
        <div role="tabpanel" hidden={tabValue !== 0}>
          {tabValue === 0 && (
            <ConversationList
              conversations={conversations}
              onSelect={handleConversationSelect}
            />
          )}
        </div>
        <div role="tabpanel" hidden={tabValue !== 1}>
          <AllUsersList userid={userid} onSelect={handleAllUsersSelect} />
        </div>
      </div>
      <div className="message-list">
        {selectedConversation !== null && userid !== null ? (
          <MessageList conversation={selectedConversation} userId={userid} />
        ) : (
          <p>Please select a conversation</p>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
