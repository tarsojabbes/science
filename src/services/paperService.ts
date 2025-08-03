import { Paper } from "../models/Paper";
import { PaperRepository } from "../repository/paperRepository";
import { UserService } from "./userService";
import {User} from "../models/User"
import { UserRepository } from "../repository/userRepository";

const userRepository = new UserRepository()
const userService = new UserService(userRepository);

export class PaperService {
  private repo = new PaperRepository();

  async createPaper(data: {
    name: string;
    publishedDate?: Date;
    submissionDate?: Date;
    url?: string;
    researcherIds?: number[];
  }) {
    return await this.repo.createPaper(data);
  }

  async updatePaper(id: number, data: {
    name?: string;
    publishedDate?: Date;
    submissionDate?: Date;
    url?: string;
    researcherIds?: number[];
  }) {
    return await this.repo.updatePaper(id, data);
  }

  async getAllPapers() {
    return await this.repo.getAllPapers();
  }

  async getPaperById(id: number) {
    return await this.repo.findById(id);
  }

  async deletePaper(id: number) {
    return await this.repo.deletePaper(id);
  }

  async addResearcher(paperId: number, userId: number) {
    return await this.repo.addResearcher(paperId, userId);
  }

  async removeResearcher(paperId: number, userId: number) {
    return await this.repo.removeResearcher(paperId, userId);
  }

  async getPapersByResearcher(userId: number) {
    return await this.repo.getPapersByResearcher(userId);
  }
}