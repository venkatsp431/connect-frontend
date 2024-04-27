import React, { useState, useEffect } from "react";
import axios from "axios";
import ConversationList from "./ConversationList";
import MessageList from "./MessageList";
import {
  Tab,
  Tabs,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AllUsersList from "./AllUsers";
// import "./ChatApp.css"; // Import CSS file for styling00

const ChatApp = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  // const [userid, setuserId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const user = JSON.parse(localStorage.getItem("ConnectUser"));
  const userid = user._id;
  useEffect(() => {
    // Fetch conversations when the component mounts
    fetchConversations();
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
      console.log(response.data[0].userId);
      setConversations(response.data);
      // setuserId(response.data[0].userId);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    console.log(userid, conversation);
  };

  const handleAllUsersSelect = (conversation) => {
    // Find the conversation with the matching conversationId
    // const selectedConversation = conversations.find(
    //   (conversation) => conversation.conversationId === conversationId
    // );
    setSelectedConversation(conversation);
    // Assuming userId exists in the conversation object
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");
    // Navigate to /login
    window.location.href = "/login";
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
