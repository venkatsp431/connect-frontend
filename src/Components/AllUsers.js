import React, { useState, useEffect } from "react";
import axios from "axios";
import { List, ListItem, ListItemText } from "@mui/material";

const AllUsersList = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("ConnectUser"));
  const userid = user._id;
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(
        "https://connect-backend-dzrh.onrender.com/api/users/all"
      );
      // Filter users who have both name and username
      const filteredUsers = response.data.users.filter(
        (user) => user?.name && user?.username
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleUserClick = async (selectedUser) => {
    try {
      console.log(selectedUser._id, userid);
      const conversationId = generateConversationId(userid, selectedUser._id);

      const messageResponse = await axios.get(
        `https://connect-backend-dzrh.onrender.com/api/chat/conversation/${conversationId}`,
        {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        }
      );

      let text = "";
      console.log(messageResponse);
      if (messageResponse.data.length === 0) {
        // No messages, send "hi"
        text = "hi";
        const response = await axios.post(
          "https://connect-backend-dzrh.onrender.com/api/chat/",
          {
            receiver: selectedUser._id,
            text: text, // Sending an empty message
          },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );
        if (response.status === 201) {
          console.log("New conversation started");

          const newConversation = {
            userId: userid,
            conversationId,
            otherUser: selectedUser,
            latestMessage: "", // No message initially
            createdAt: new Date().toISOString(),
          };
          console.log(conversationId);
          onSelect(newConversation);
        }
      } else {
        const oldConversation = {
          userId: userid,
          conversationId,
          otherUser: selectedUser,
          latestMessage: "", // No message initially
          createdAt: new Date().toISOString(),
        };
        console.log(conversationId);
        onSelect(oldConversation);
      }
    } catch (error) {
      console.error("Error fetching or creating conversation:", error);
    }
  };

  // Function to get the current user from local storage or context

  // Function to generate the conversation ID
  const generateConversationId = (userId1, userId2) => {
    // Determine which user ID comes first
    const sortedUserIds = [userId1, userId2].sort();
    // Combine the user IDs to create the conversation ID
    const conversationId = sortedUserIds.join("-");
    return conversationId;
  };

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user._id} button onClick={() => handleUserClick(user)}>
          <ListItemText primary={user.name} secondary={user.username} />
        </ListItem>
      ))}
    </List>
  );
};

export default AllUsersList;
