import { Paper } from "../models/Paper";
import { User } from "../models/User";

export class PaperRepository {
  async createPaper(data: {
    name: string;
    publishedDate?: Date;
    submissionDate?: Date;
    url?: string;
    researcherIds?: number[];
  }) {
    const { researcherIds, ...paperData } = data;
    
    const paper = await Paper.create(paperData);
    
    if (researcherIds && researcherIds.length > 0) {
      const researchers = await User.findAll({
        where: { id: researcherIds }
      });
      await paper.setResearchers(researchers);
    }
    
    return await Paper.findByPk(paper.id, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid']
      }]
    });
  }

  async updatePaper(id: number, data: {
    name?: string;
    publishedDate?: Date;
    submissionDate?: Date;
    url?: string;
    researcherIds?: number[];
  }) {
    const { researcherIds, ...paperData } = data;
    
    const [rowsUpdated] = await Paper.update(paperData, {
      where: { id }
    });

    if (rowsUpdated === 0) return null;

    const paper = await Paper.findByPk(id);
    if (!paper) return null;

    if (researcherIds !== undefined) {
      if (researcherIds.length > 0) {
        const researchers = await User.findAll({
          where: { id: researcherIds }
        });
        await paper.setResearchers(researchers);
      } else {
        await paper.setResearchers([]);
      }
    }

    return await Paper.findByPk(id, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid']
      }]
    });
  }

  async getAllPapers() {
    return await Paper.findAll({
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid']
      }]
    });
  }

  async findById(id: number) {
    return await Paper.findByPk(id, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid']
      }]
    });
  }

  async deletePaper(id: number) {
    const paper = await Paper.findByPk(id, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid']
      }]
    });
    
    if (!paper) return null;
    
    await paper.setResearchers([]);
    await paper.destroy();
    
    return paper;
  }

  async addResearcher(paperId: number, userId: number) {
    const paper = await Paper.findByPk(paperId);
    const user = await User.findByPk(userId);
    
    if (!paper || !user) return null;
    
    await paper.addResearcher(user);
    
    return await Paper.findByPk(paperId, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid']
      }]
    });
  }

  async removeResearcher(paperId: number, userId: number) {
    const paper = await Paper.findByPk(paperId);
    const user = await User.findByPk(userId);
    
    if (!paper || !user) return null;
    
    await paper.removeResearcher(user);
    
    return await Paper.findByPk(paperId, {
      include: [{
        model: User,
        as: 'researchers',
        attributes: ['id', 'name', 'email', 'institution', 'orcid']
      }]
    });
  }

  async getPapersByResearcher(userId: number) {
    return await Paper.findAll({
      include: [{
        model: User,
        as: 'researchers',
        where: { id: userId },
        attributes: ['id', 'name', 'email', 'institution', 'orcid']
      }]
    });
  }
}