import * as express from "express";
import * as dotenv from "dotenv";
import  sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import paperRoutes from "./routes/paperRoutes"
import journalRoutes from "./routes/journalRoutes";
import issueRoutes from "./routes/issueRoutes";
import './associations';

dotenv.config();

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/papers", paperRoutes);
app.use("/journals", journalRoutes);
app.use("/issues", issueRoutes);

sequelize.sync().then(() => {
  console.log("Successfully connected to PostgreSQL");
  app.listen(3000, () => console.log("Server running on port 3000"));
}).catch((error) => {
  console.error("Error connecting to database:", error);
});
