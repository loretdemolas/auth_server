import { PORT } from './config/config.js';
import http from "http";
import app from "./server.js";

const server = http.createServer(app);

server.listen(PORT, () => {});
console.log(`Server running on port ${PORT}`);