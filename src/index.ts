import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";

import userRoutes from "./routes/userRoutes";
import paperRoutes from "./routes/paperRoutes";
import journalRoutes from "./routes/journalRoutes";
import issueRoutes from "./routes/issueRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import reviewResultRoutes from "./routes/reviewResultRoutes";

import './associations';
import { setupSwagger } from "./config/swagger";

dotenv.config();

const app = express();
app.use(express.json());
setupSwagger(app);

app.use("/users", userRoutes);
app.use("/papers", paperRoutes);
app.use("/journals", journalRoutes);
app.use("/issues", issueRoutes);
app.use("/reviews", reviewRoutes);
app.use("/review-results", reviewResultRoutes);

sequelize.sync({force: true}).then(() => {
  console.log("Successfully connected to PostgreSQL");
  app.listen(3000, () => console.log("Server running on port 3000"));
}).catch((error) => {
  console.error("Error connecting to database:", error);
});
