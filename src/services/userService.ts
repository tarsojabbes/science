import { UserRepository } from "../repository/userRepository";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export class UserService {

    private userRepository = new UserRepository();
    private jwtSecret: jwt.Secret;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.jwtSecret = (process.env.JWT_SECRET || "defaultSecret") as jwt.Secret;
    }

    async createUser(userData: User): Promise<User> {
        try {
            const user = await this.userRepository.createUser(userData);
            return user;
        } catch (error: any) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async updateUser(id: number, data: User) {
    return await this.userRepository.updateUser(id, data);
    }

    async createUserCrypt(userData: any) {
        
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userWithHashedPass = { ...userData, password: hashedPassword };

        return await this.userRepository.createUser(userWithHashedPass);
    }

    async getAllUsers() {
        try {
            return await this.userRepository.getAllUsers();
        } catch (error: any) {
             throw new Error(`Error retrieving all users: ${error.message}`);
        }
    }

    async authenticate(email: string, password: string) {
        
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new Error("User or password are invalid");

        const passwordOk = await bcrypt.compare(password, user.password);

        if (!passwordOk) throw new Error("User or password are invalid");

        const payload = { id: user.id, email: user.email };

        const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });

        return { user, token };
  }

    async getUserById(id: number) {
      return await this.userRepository.findById(id);
    }

    async deleteUser(id: number) {
      return await this.userRepository.deleteUser(id);
    }
}