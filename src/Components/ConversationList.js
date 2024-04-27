import React from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

const ConversationList = ({ conversations, onSelect }) => {
  console.log(conversations);
  return (
    <div>
      {conversations.length === 0 ? (
        <Typography variant="body1">
          Empty conversation. Please select to start from all users.
        </Typography>
      ) : (
        <List>
          {conversations.map((conversation) => (
            <ListItem
              key={conversation.conversationId}
              button
              onClick={() => onSelect(conversation)}
            >
              <ListItemText
                primary={conversation?.otherUser?.name}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      {conversation.latestMessage}
                    </Typography>
                    {" - "}
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                    >
                      {new Date(conversation.createdAt).toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default ConversationList;
