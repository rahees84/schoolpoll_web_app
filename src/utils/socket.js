// src/utils/socket.js
import { io } from "socket.io-client";
import { BASE_URL_WSS } from "../constants/appConstants";

const socket = io(BASE_URL_WSS);

export default socket;
