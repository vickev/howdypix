require("dotenv").config();
import axios from "axios";

// Setup the base URL
axios.defaults.baseURL = process.env.API_BASE_URL ?? "http://localhost:3004";
