// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
require("dotenv").config();

// eslint-disable-next-line import/no-extraneous-dependencies,import/first
import axios from "axios";

// Setup the base URL
axios.defaults.baseURL = process.env.API_BASE_URL || "http://localhost:3004";
