import { Sequelize } from "sequelize-typescript";
import { User } from "../models/User";
import { UserRepository } from "../repository/userRepository";
import { UserService } from "../services/userService";
import bcrypt from "bcryptjs";
import { DataTypes } from "sequelize";

describe("UserService (teste de integração)", () => {
  let sequelize: Sequelize;
  let userRepository: UserRepository;
  let userService: UserService;

  const validUserData = {
    nome: "Jane Doe",
    email: "jane@example.com",
    password: "plainPassword",
    instituicao: "Test University",
    orcid: "0000-0000-0000-0002",
    roles: ["AUTHOR"]
  };

  beforeAll(async () => {
    process.env.JWT_SECRET = "test-secret"

    sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
    });

    User.init(
    {
        nome: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        instituicao: { type: DataTypes.STRING },
        orcid: { type: DataTypes.STRING, unique: true },
        roles: { type: DataTypes.JSON }
    },
    { sequelize, modelName: "User" }
    );

    await sequelize.sync({ force: true });

    userRepository = new UserRepository();
    userService = new UserService(userRepository);
  });

  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.drop();
    await sequelize.close(); 
  });

  describe("Cadastro de usuário com validações", () => {
    describe("Caso 1: Dois usuários não podem ter o mesmo email", () => {
      it("Retorna erro pois o email é único", async () => {
        await userService.createUser(validUserData as any);

        const duplicateUser = { ...validUserData, nome: "Outra Pessoa" };

        await expect(userService.createUser(duplicateUser as any))
          .rejects.toThrow('Error creating user: Validation error');
      });
    });

    describe("Caso 2: Dois usuários não podem ter o mesmo ORCID", () => {
      it("Retorna erro pois o ORCID é único", async () => {
        await userService.createUser(validUserData as any);

        const duplicateUser = {
          ...validUserData,
          email: "outro@example.com"
        };

        await expect(userService.createUser(duplicateUser as any))
          .rejects.toThrow("Error creating user: Validation error");
      });
    });

    describe("Caso 3: Campos obrigatórios devem estar presentes", () => {
      it("Retorna erro pois faltam campos obrigatórios", async () => {
        const incompleteUser = {
          nome: "John",
          email: "john@test.com"
        };

        await expect(userService.createUser(incompleteUser as any))
          .rejects.toThrow("Error creating user: notNull Violation: User.password cannot be null");
      });
    });

    describe("Caso 4: Usuário cadastrado com dados válidos", () => {
      it("Retorna sucesso pois todos os dados são válidos", async () => {
        const result = await userService.createUser(validUserData as any);

        expect(result).toBeInstanceOf(User);
        expect(result.get("email")).toBe(validUserData.email);
      });
    });
  });

  describe("Cadastro com senha criptografada", () => {
    it("Retorna sucesso e a senha é hasheada", async () => {
      const result = await userService.createUserCrypt(validUserData as any);

      const savedUser = await User.findOne({ where: { email: validUserData.email } });
      expect(savedUser).not.toBeNull();
      expect(await bcrypt.compare(validUserData.password, savedUser!.get("password"))).toBe(true);
    });
  });

  describe("Login com credenciais válidas e inválidas", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("plainPassword", 10);
      await User.create({
        nome: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        instituicao: "Test University",
        orcid: "0000-0000-0000-0001",
        roles: ["AUTHOR"]
      });
    });

    describe("Caso 1: Email e senha válidos", () => {
      it("Autentica com sucesso", async () => {
        const result = await userService.authenticate("john@example.com", "plainPassword");

        expect(result.user).toBeInstanceOf(User);
        expect(result.user.get("email")).toBe("john@example.com");
      });
    });

    describe("Caso 2: Email inválido", () => {
      it("Retorna erro pois o email é inválido", async () => {
        await expect(userService.authenticate("naoexiste@example.com", "plainPassword"))
          .rejects.toThrow("User or password are invalid");
      });
    });

    describe("Caso 3: Senha inválida", () => {
      it("Retorna erro pois a senha é inválida", async () => {
        await expect(userService.authenticate("john@example.com", "wrongPassword"))
          .rejects.toThrow("User or password are invalid");
      });
    });
  });

  describe("Atualização e exclusão de usuário", () => {
    let createdUser: User;

    beforeEach(async () => {
      createdUser = await userService.createUserCrypt(validUserData as any);
    });

    describe("Caso 1: Atualização com email já cadastrado", () => {
      it("Retorna erro pois já existe um usuário com o mesmo email", async () => {
        await userService.createUserCrypt({
          ...validUserData,
          email: "existing@example.com",
          orcid: "0000-0000-0000-9999"
        } as any);

        await expect(userService.updateUser(createdUser.get("id"), {
          ...validUserData,
          email: "existing@example.com"
        } as any)).rejects.toThrow("Validation error");
      });
    });

    describe("Caso 2: Atualização com ORCID já cadastrado", () => {
      it("Retorna erro pois já existe um usuário com o mesmo ORCID", async () => {
        await userService.createUserCrypt({
          ...validUserData,
          email: "outro@example.com",
          orcid: "0000-0000-0000-9999"
        } as any);

        await expect(userService.updateUser(createdUser.get("id"), {
          ...validUserData,
          orcid: "0000-0000-0000-9999"
        } as any)).rejects.toThrow("Validation error");
      });
    });

    describe("Caso 3: Atualização com ID inválido", () => {
      it("Retorna null pois o usuário não existe", async () => {
        const result = await userService.updateUser(9999, validUserData as any);
        expect(result).toBeNull();
      });
    });

    describe("Caso 4: Exclusão de usuário com sucesso", () => {
      it("Retorna com sucesso pois o usuário existe", async () => {
        await userService.deleteUser(createdUser.get("id"));

        const deleted = await User.findByPk(createdUser.get("id"));
        expect(deleted).toBeNull();
      });
    });

    describe("Caso 5: Exclusão com ID inválido", () => {
      it("Retorna null pois o usuário não existe", async () => {
        const result = await userService.deleteUser(9999);
        expect(result).toBeNull();
        });
    });
  });
});
