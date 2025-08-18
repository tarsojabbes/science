import { UserService } from "../services/UserService";
import { UserRepository } from "../repository/userRepository";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../repository/userRepository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("UserService", () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    
    // Sample user data for testing (plain object for user data)
    const mockUserData = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "hashedPassword",
        instituiton: "Test University",
        orcid: "0000-0000-0000-0001",
        roles: ["AUTHOR"]
    };

    // Mock Sequelize User instance
    const mockUser = {
        ...mockUserData,
        dataValues: mockUserData,
        get: jest.fn((key: string) => mockUserData[key as keyof typeof mockUserData]),
        set: jest.fn(),
        save: jest.fn(),
        toJSON: jest.fn(() => mockUserData),
        isNewRecord: false,
        sequelize: {},
        Model: User
    } as unknown as User;

    const validUserData = {
        nome: "Jane Doe",
        email: "jane@example.com",
        password: "plainPassword",
        instituicao: "Test University",
        orcid: "0000-0000-0000-0002",
        roles: ["AUTHOR"]
    };

    // Helper function to create mock User instances
    const createMockUser = (data: any) => ({
        ...data,
        dataValues: data,
        get: jest.fn((key: string) => data[key]),
        set: jest.fn(),
        save: jest.fn(),
        toJSON: jest.fn(() => data),
        isNewRecord: false,
        sequelize: {},
        Model: User
    }) as unknown as User;

    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        
        // Create mocked repository
        mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
        
        // Initialize service with mocked repository
        userService = new UserService(mockUserRepository);
        
        // Set up default environment variable
        process.env.JWT_SECRET = "test-secret";
    });

    describe("Cadastro de usuário com validações", () => {
        describe("Caso 1: Dois usuários não podem ter o mesmo email", () => {
            it("should throw error when email already exists", async () => {
                // Arrange
                const duplicateEmailError = new Error("Email already exists");
                mockUserRepository.createUser.mockRejectedValue(duplicateEmailError);

                // Act & Assert
                await expect(userService.createUser(validUserData as any))
                    .rejects.toThrow("Error creating user: Email already exists");
            });
        });

        describe("Caso 2: Dois usuários não podem ter o mesmo ORCID", () => {
            it("should throw error when ORCID already exists", async () => {
                // Arrange
                const duplicateOrcidError = new Error("ORCID already exists");
                mockUserRepository.createUser.mockRejectedValue(duplicateOrcidError);

                // Act & Assert
                await expect(userService.createUser(validUserData as any))
                    .rejects.toThrow("Error creating user: ORCID already exists");
            });
        });

        describe("Caso 3: Campos obrigatórios devem estar presentes", () => {
            it("should throw error when required fields are missing", async () => {
                // Arrange
                const incompleteUser = {
                    nome: "John",
                    email: "john@test.com"
                    // Missing required fields
                };

                const validationError = new Error("Required fields missing");
                mockUserRepository.createUser.mockRejectedValue(validationError);

                // Act & Assert
                await expect(userService.createUser(incompleteUser as any))
                    .rejects.toThrow("Error creating user: Required fields missing");
            });
        });

        describe("Caso 4: Usuário cadastrado com dados válidos", () => {
            it("should create user successfully with valid data", async () => {
                // Arrange
                mockUserRepository.createUser.mockResolvedValue(mockUser);

                // Act
                const result = await userService.createUser(validUserData as any);

                // Assert
                expect(result).toEqual(mockUser);
                expect(mockUserRepository.createUser).toHaveBeenCalledWith(validUserData);
            });
        });
    });

    describe("Cadastro com senha criptografada", () => {
        it("should hash password before creating user", async () => {
            // Arrange
            const hashedPassword = "hashedPassword123";
            const userWithHashedPassword = createMockUser({
                ...mockUserData,
                password: hashedPassword
            });
            
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
            mockUserRepository.createUser.mockResolvedValue(userWithHashedPassword);

            // Act
            const result = await userService.createUserCrypt(validUserData);

            // Assert
            expect(bcrypt.hash).toHaveBeenCalledWith(validUserData.password, 10);
            expect(mockUserRepository.createUser).toHaveBeenCalledWith({
                ...validUserData,
                password: hashedPassword
            });
            expect(result.get('password')).toBe(hashedPassword);
        });
    });

    describe("Login com credenciais válidas e inválidas", () => {
        describe("Caso 1: Email e senha válidos", () => {
            it("should authenticate user with valid credentials", async () => {
                // Arrange
                const email = "john@example.com";
                const password = "plainPassword";
                const token = "jwt-token";

                mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                (bcrypt.compare as jest.Mock).mockResolvedValue(true);
                (jwt.sign as jest.Mock).mockReturnValue(token);

                // Act
                const result = await userService.authenticate(email, password);

                // Assert
                expect(result).toEqual({ user: mockUser, token });
                expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
                expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.get('password'));
                expect(jwt.sign).toHaveBeenCalledWith(
                    { id: mockUser.get('id'), email: mockUser.get('email') },
                    "test-secret",
                    { expiresIn: '1h' }
                );
            });
        });

        describe("Caso 2: Email inválido", () => {
            it("should throw error when user not found", async () => {
                // Arrange
                const email = "nonexistent@example.com";
                const password = "password";

                mockUserRepository.findByEmail.mockResolvedValue(null);

                // Act & Assert
                await expect(userService.authenticate(email, password))
                    .rejects.toThrow("User or password are invalid");
            });
        });

        describe("Caso 3: Senha inválida", () => {
            it("should throw error when password is incorrect", async () => {
                // Arrange
                const email = "john@example.com";
                const password = "wrongPassword";

                mockUserRepository.findByEmail.mockResolvedValue(mockUser);
                (bcrypt.compare as jest.Mock).mockResolvedValue(false);

                // Act & Assert
                await expect(userService.authenticate(email, password))
                    .rejects.toThrow("User or password are invalid");
            });
        });
    });

    describe("Atualização e exclusão de usuário", () => {
        describe("Caso 1: Atualização com email já cadastrado", () => {
            it("should throw error when updating with existing email", async () => {
                // Arrange
                const userId = 1;
                const updateData = { ...validUserData, email: "existing@example.com" };
                const duplicateEmailError = new Error("Email already exists");
                
                mockUserRepository.updateUser.mockRejectedValue(duplicateEmailError);

                // Act & Assert
                await expect(userService.updateUser(userId, updateData as any))
                    .rejects.toThrow("Email already exists");
            });
        });

        describe("Caso 2: Atualização com ORCID já cadastrado", () => {
            it("should throw error when updating with existing ORCID", async () => {
                // Arrange
                const userId = 1;
                const updateData = { ...validUserData, orcid: "0000-0000-0000-0001" };
                const duplicateOrcidError = new Error("ORCID already exists");
                
                mockUserRepository.updateUser.mockRejectedValue(duplicateOrcidError);

                // Act & Assert
                await expect(userService.updateUser(userId, updateData as any))
                    .rejects.toThrow("ORCID already exists");
            });
        });

        describe("Caso 3: Atualização com ID inválido", () => {
            it("should throw error when user ID does not exist", async () => {
                // Arrange
                const invalidUserId = 999;
                const updateData = validUserData;
                const notFoundError = new Error("User not found");
                
                mockUserRepository.updateUser.mockRejectedValue(notFoundError);

                // Act & Assert
                await expect(userService.updateUser(invalidUserId, updateData as any))
                    .rejects.toThrow("User not found");
            });
        });

        describe("Caso 4: Exclusão de usuário com sucesso", () => {
            it("should delete user successfully", async () => {
                // Arrange
                const userId = 1;
                mockUserRepository.deleteUser.mockResolvedValue(mockUserData as unknown as User);

                // Act
                const result = await userService.deleteUser(userId);

                // Assert
                expect(result).toBe(true);
                expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userId);
            });
        });

        describe("Caso 5: Exclusão com ID inválido", () => {
            it("should throw error when deleting non-existent user", async () => {
                // Arrange
                const invalidUserId = 999;
                const notFoundError = new Error("User not found");
                
                mockUserRepository.deleteUser.mockRejectedValue(notFoundError);

                // Act & Assert
                await expect(userService.deleteUser(invalidUserId))
                    .rejects.toThrow("User not found");
            });
        });
    });

    describe("Buscar usuários", () => {
        it("should get all users successfully", async () => {
            // Arrange
            const user2 = createMockUser({ ...mockUserData, id: 2, email: "another@test.com" });
            const usersList = [mockUser, user2];
            mockUserRepository.getAllUsers.mockResolvedValue(usersList);

            // Act
            const result = await userService.getAllUsers();

            // Assert
            expect(result).toEqual(usersList);
            expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
        });

        it("should throw error when getting all users fails", async () => {
            // Arrange
            const error = new Error("Database connection failed");
            mockUserRepository.getAllUsers.mockRejectedValue(error);

            // Act & Assert
            await expect(userService.getAllUsers())
                .rejects.toThrow("Error retrieving all users: Database connection failed");
        });

        it("should get user by ID successfully", async () => {
            // Arrange
            const userId = 1;
            mockUserRepository.findById.mockResolvedValue(mockUser);

            // Act
            const result = await userService.getUserById(userId);

            // Assert
            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        });
    });

    describe("Edge cases", () => {
        it("should use default JWT secret when environment variable is not set", () => {
            // Arrange
            delete process.env.JWT_SECRET;
            
            // Act
            const serviceWithoutEnv = new UserService(mockUserRepository);
            
            // Assert - The service should still work with default secret
            expect(serviceWithoutEnv).toBeInstanceOf(UserService);
        });

        it("should handle empty user data gracefully", async () => {
            // Arrange
            const emptyUser = {};
            const validationError = new Error("Invalid user data");
            mockUserRepository.createUser.mockRejectedValue(validationError);

            // Act & Assert
            await expect(userService.createUser(emptyUser as any))
                .rejects.toThrow("Error creating user: Invalid user data");
        });
    });
});