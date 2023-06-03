import { Contract } from 'src/core/domain/entities/Contract';
import { ContractRepository } from 'src/core/domain/repositories/ContractRepository';
import { ContractUseCase } from 'src/core/domain/useCases/Contract';
import { instance, mock, verify, when } from 'ts-mockito';

describe('ContractUseCase', () => {
  describe('create useCase', () => {
    let contractRepo: ContractRepository;
    let useCase: ContractUseCase;

    beforeEach(() => {
      contractRepo = mock<ContractRepository>();
      useCase = new ContractUseCase(instance(contractRepo));
    });
    it('should create a contract and return the contract ID', async () => {
      const userID = 'user123';
      const contractName = 'Contract 1';
      const templateID = 'template123';
      const contractID = 'contract123';

      when(contractRepo.createContract(userID, contractName, templateID)).thenResolve(contractID);

      const result = await useCase.createContract(userID, contractName, templateID);

      expect(result).toBe(contractID);
      verify(contractRepo.createContract(userID, contractName, templateID)).called();
    });
  });

  describe('contracts list', () => {
    let contractRepo: ContractRepository;
    let useCase: ContractUseCase;

    beforeEach(() => {
      contractRepo = mock<ContractRepository>();
      useCase = new ContractUseCase(instance(contractRepo));
    });

    it('should retrieve a list of contracts IDs', async () => {
      const contractsIDs: { contractID: string }[] = [
        { contractID: 'contract1' },
        { contractID: 'contract2' },
        { contractID: 'contract3' },
      ];

      when(contractRepo.getContractsIDs()).thenResolve(contractsIDs);

      const result = await useCase.getContracts();

      expect(result).toEqual(contractsIDs);
      verify(contractRepo.getContractsIDs()).called();
    });
  });

  describe('get contract by id', () => {
    let contractRepo: ContractRepository;
    let useCase: ContractUseCase;

    beforeEach(() => {
      contractRepo = mock<ContractRepository>();
      useCase = new ContractUseCase(instance(contractRepo));
    });

    it('should retrieve a specific contract by ID', async () => {
      const contractID = 'contract123';
      const contract = new Contract(contractID, 'userID', 'contractName', 'templateId');

      when(contractRepo.getContractById(contractID)).thenResolve(contract);

      const result = await useCase.getContract(contractID);

      expect(result).toEqual(contract);
      verify(contractRepo.getContractById(contractID)).called();
    });

    it('should throw error contract not found', async () => {
      const contractID = 'contract123';

      when(contractRepo.getContractById(contractID)).thenResolve(null);

      expect(useCase.getContract(contractID)).rejects.toThrow();
      verify(contractRepo.getContractById(contractID)).called();
    });
  });
});
