import { User } from "../models/User";
import { UserRepository } from "../repository/userRepository";

export class UserService {
  private repo = new UserRepository();

  async createUser(data: User) {
    return await this.repo.createUser(data);
  }

  async updateUser(id: number, data: User) {
    return await this.repo.updateUser(id, data);
  }

  async getAllUsers() {
    return await this.repo.getAllUsers();
  }

  async getUserById(id: number) {
    return await this.repo.findById(id);
  }

  async deleteUser(id: number) {
    return await this.repo.deleteUser(id);
  }
}