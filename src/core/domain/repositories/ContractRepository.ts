import { Contract } from '../entities/Contract';

export interface IContractsIDs {
  contractID: string;
}

export abstract class ContractRepository {
  abstract createContract(
    userID: string,
    contractName: string,
    templateID: string,
  ): Promise<string>;

  abstract getContractsIDs(): Promise<IContractsIDs[]>;

  abstract getContractById(contractID: string): Promise<Contract | null>;
}
