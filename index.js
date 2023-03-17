import { PORT } from './Auth-Server/config/config.js';
import http from "http";
import app from "./Auth-Server/server.js";

const server = http.createServer(app);

server.listen(PORT, () => {});
console.log(`Server running on port ${PORT}`);