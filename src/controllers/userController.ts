import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { UserRepository } from "../repository/userRepository";

const repository = new UserRepository();
const service = new UserService(repository);

export const UserController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body; 
      const user = await service.createUserCrypt(userData);
      res.status(201).json(user);
      return 
    } catch (error: any) {
      res.status(400).json({ message: error.message });
      return 
    }
  },

  async update(req: Request, res: Response): Promise<void> {
    try {
      const user = await service.updateUser(Number(req.params.id), req.body);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async list(req: Request, res: Response): Promise<void> {
    try {
      const users = await service.getAllUsers();
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const user = await service.getUserById(Number(req.params.id));
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const deleted = await service.deleteUser(Number(req.params.id));
      if (!deleted) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.sendStatus(204);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const authResult = await service.authenticate(email, password);
      return res.json(authResult);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }
};