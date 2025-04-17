import React, { createContext, useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import MainContainer from "./Components/MainContainer";
import Login from "./Components/Login";
import Welcome from "./Components/Welcome";
import ChatArea from "./Components/ChatArea";
import CreateGroups from "./Components/CreateGroups";
import Users from "./Components/Users_groups";
import MediumDevice from "./Components/MediumDevice";

export const RefreshContext = createContext();
export const ChatContext = createContext();

function App() {
  const [MasterRefresh, setMasterRefresh] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [ChatInfo, setChatInfo] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const lightTheme = useSelector((state) => state.themeKey);

  const contextValue = {
    MasterRefresh,
    setMasterRefresh,
    notifications,
    setNotifications,
  };

  const chatContextValue = {
    ChatInfo,
    setChatInfo,
    onlineUsers,
    setOnlineUsers,
  };

  return (
    <RefreshContext.Provider value={contextValue}>
      <ChatContext.Provider value={chatContextValue}>
        <div
          className="App"
          style={{ backgroundColor: lightTheme ? "#C5BAAF" : "#2d3941" }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="app" element={<MainContainer />}>
              <Route path="welcome" element={<Welcome />} />
              <Route path="chat" element={<ChatArea />} />
              <Route path="users" element={<Users />} />
              <Route path="create-groups" element={<CreateGroups />} />
              <Route path="start-chats" element={<MediumDevice />} />
            </Route>
          </Routes>
        </div>
      </ChatContext.Provider>
    </RefreshContext.Provider>
  );
}

export default App;
