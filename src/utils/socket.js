// src/utils/socket.js
import { io } from "socket.io-client";
import { BASE_URL } from "../constants/appConstants";

const socket = io(BASE_URL);

export default socket;
