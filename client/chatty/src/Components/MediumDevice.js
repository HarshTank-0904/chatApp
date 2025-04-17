import React, { useState, useEffect, useContext } from "react";
import ConversationsItem from "./ConversationsItem";
import { IconButton } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import axios from "axios";
import empty from "./Images/empty2.png";
import Facebook from "./Skeleton";
import { useSelector } from "react-redux";
import { RefreshContext } from "../App";

export default function MediumDevice() {
  const URL = process.env.REACT_APP_API_KEY;
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  const lightTheme = useSelector((state) => state.themeKey);
  const { notifications, setNotifications } = useContext(RefreshContext);

  const bufferToImage = (buffer) => {
    const uint8Array = new Uint8Array(buffer.data);
    const binaryString = uint8Array.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    const base64String = btoa(binaryString);
    return `data:${buffer.type};base64,${base64String}`;
  };

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${URL}/chats/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const formatted = data.map((chat) => {
          const isGroupChat = chat.isGroupChat;
          let chatName = isGroupChat ? chat.chatName : "";

          if (!isGroupChat) {
            const otherUser = chat.users.find((u) => u._id !== userId);
            chatName = otherUser?.name || "";
          }

          const lastMessage = chat.latestMessage?.content || "";
          const timeStamp = chat.latestMessage?.createdAt || "";

          const otherUserImageObj = chat.users.find(
            (user) => user._id !== userId && user.image !== null
          );

          return {
            _id: chat._id,
            name: chatName,
            lastMessage,
            timeStamp,
            isGroup: isGroupChat,
            otherUserImage: otherUserImageObj?.image
              ? bufferToImage(otherUserImageObj.image)
              : null,
            otherUser: chat.users.find((u) => u._id !== userId)?._id,
          };
        });

        formatted.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

        setConversations(formatted);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userName]);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="medium-device-container">
      <div className={`medium-search${lightTheme ? "" : " dark"}`}>
        <IconButton className="icon">
          <SearchSharpIcon />
        </IconButton>
        <input
          placeholder="search"
          className={`search-box${lightTheme ? "" : " dark"}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={`medium-con${lightTheme ? "" : " dark"}`}>
        {loading ? (
          <Facebook />
        ) : filteredConversations.length === 0 ? (
          <img
            src={empty}
            alt="No conversations"
            style={{ height: "40%", width: "100%" }}
          />
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationsItem key={conversation._id} props={conversation} />
          ))
        )}
      </div>
    </div>
  );
}
