import { User } from "../models/User";

export class UserRepository {
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    institution: string;
    orcid: string;
    roles: string[];
  }) {
    return await User.create(data);
  }

  async updateUser(id: number, data: {
  name?: string;
  email?: string;
  password?: string;
  institution?: string;
  orcid?: string;
  roles?: string[];
}) {
  const [rowsUpdated] = await User.update(data, {
    where: { id }
  });

  if (rowsUpdated === 0) return null;

  return await User.findByPk(id);
}


  async getAllUsers() {
    return await User.findAll();
  }

  async findById(id: number) {
    return await User.findByPk(id);
  }

  async deleteUser(id: number) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  }
}
