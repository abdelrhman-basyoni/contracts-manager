import { ContractRepository } from '../repositories/ContractRepository';
import { NotFoundError } from '../utils/Errors';

export class ContractUseCase {
  constructor(private readonly contractRepo: ContractRepository) {}

  async createContract(userID: string, contractName: string, templateID: string) {
    const contractID = await this.contractRepo.createContract(userID, contractName, templateID);

    return contractID;
  }

  async getContracts() {
    const contracts = await this.contractRepo.getContractsIDs();

    return contracts;
  }

  async getContract(contractID: string) {
    const contract = await this.contractRepo.getContractById(contractID);
    if (!contract) {
      throw new NotFoundError('Contract Not Found');
    }

    return contract;
  }
}
