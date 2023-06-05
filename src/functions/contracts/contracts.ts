import { lambdaUser } from '@functions/utils/lambdaWrapper';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Contract } from 'src/core/domain/entities/Contract';
import { ContractUseCase } from 'src/core/domain/useCases/Contract';
import { DynamoContractRepository } from 'src/core/implementation/repositories/ContractRepository';

class CreateContractRequestDTO {
  @IsUUID()
  @IsNotEmpty()
  userID: string;

  @IsString()
  @IsNotEmpty()
  contractName: string;

  @IsUUID()
  @IsNotEmpty()
  templateID: string;
}

interface IContractsID {
  contractID: string;
}

interface IContractsIDsRes {
  contractsIDs: IContractsID[];
}

export const createContract = lambdaUser<CreateContractRequestDTO, IContractsID>(
  CreateContractRequestDTO,
  async (req) => {
    const contractRepo = new DynamoContractRepository();
    const useCase = new ContractUseCase(contractRepo);
    const contractID = await useCase.createContract(req.userID, req.contractName, req.templateID);

    return { contractID };
  },
);

export const getContracts = lambdaUser<void, IContractsIDsRes>(null, async () => {
  const contractRepo = new DynamoContractRepository();
  const useCase = new ContractUseCase(contractRepo);
  const ids = await useCase.getContracts();
  const res = { contractsIDs: ids };

  return res;
});

export const getContract = lambdaUser<{ id: string }, Contract>(null, async (req, params) => {
  const contractRepo = new DynamoContractRepository();
  const useCase = new ContractUseCase(contractRepo);

  return useCase.getContract(params.id);
});
