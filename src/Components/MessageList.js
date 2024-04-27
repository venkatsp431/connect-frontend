// MessageList.js
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const MessageList = ({ conversation, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageListRef = useRef(null);

  useEffect(() => {
    console.log(conversation, userId);
    if (conversation) {
      fetchMessages(conversation?.conversationId);
    }
  }, [conversation]);
  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `https://connect-backend-dzrh.onrender.com/api/chat/conversation/${conversationId}`,
        {
          headers: {
            authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const handleMessageSend = async () => {
    if (!newMessage.trim()) return;
    try {
      console.log(
        "Sending message...",
        conversation.otherUser._id,
        newMessage,
        userId
      );
      const response = await axios.post(
        "http://localhost:7070/api/chat/",
        {
          receiver: conversation.otherUser._id,
          text: newMessage,
        },
        {
          headers: {
            authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Message sent successfully:", response.data);
      // Clear the message input after sending
      setNewMessage("");
      // Refetch messages to update the list
      fetchMessages(conversation?.conversationId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6" sx={{ marginTop: "10px" }}>
        {conversation?.otherUser?.name}
      </Typography>{" "}
      <div
        className="message-list"
        style={{
          flex: "1",
          overflowY: "auto",
        }}
        ref={messageListRef}
      >
        <List>
          {messages.map((message) => (
            <ListItem
              key={message._id}
              alignItems={
                message?.sender?._id === userId ? "flex-end" : "flex-start"
              }
              className={message?.sender?._id === userId ? "sent" : "received"}
            >
              <ListItemText
                primary={message.text}
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    color="textPrimary"
                  >
                    {new Date(message.createdAt).toLocaleString()}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          backgroundColor: "#ffffff",
        }}
      >
        <TextField
          label="Send a message"
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleMessageSend();
            }
          }}
        />
        <Button variant="contained" onClick={handleMessageSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageList;
