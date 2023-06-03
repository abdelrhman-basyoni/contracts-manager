import { lambdaUser } from '@functions/utils/lambdaWrapper';
import { Contract } from 'src/core/domain/entities/Contract';
import { ContractUseCase } from 'src/core/domain/useCases/Contract';
import { DynamoContractRepository } from 'src/core/implementation/repositories/ContractRepository';

interface ICreateContractReq {
  userID: string;
  contractName: string;
  templateID: string;
}
interface IContractsID {
  contractID: string;
}

export const createContract = lambdaUser<ICreateContractReq, IContractsID>(async (req) => {
  const contractRepo = new DynamoContractRepository();
  const useCase = new ContractUseCase(contractRepo);
  const contractID = await useCase.createContract(req.userID, req.contractName, req.templateID);

  return { contractID };
});

export const getContracts = lambdaUser<void, IContractsID[]>(async () => {
  const contractRepo = new DynamoContractRepository();
  const useCase = new ContractUseCase(contractRepo);

  return useCase.getContracts();
});

export const getContract = lambdaUser<{ id: string }, Contract>(async (req, params) => {
  const contractRepo = new DynamoContractRepository();
  const useCase = new ContractUseCase(contractRepo);

  return useCase.getContract(params.id);
});
