import { validateSync } from 'class-validator';

import { PermissionError, ValidationError } from 'src/core/domain/utils/Errors';
import { CustomEvent } from './types';

export abstract class ValidationStrategy {
  abstract validate(event?: CustomEvent): void;
}

export class UserValidationStrategy extends ValidationStrategy {
  validate(event: CustomEvent) {
    if (!event.tokenPayload) throw new PermissionError('Bad token');
  }
}

interface IReqBodyValidation {
  requestDto: any;
  reqBody: any;
}

export class RequestBodyValidationStrategy extends ValidationStrategy {
  constructor(readonly requestDto: any, readonly reqBody: any) {
    super();
  }

  private validateDTO(classType: any, data: any) {
    const instance = Object.assign(new classType(), data);

    return validateSync(instance);
  }

  validate() {
    const validationErrors = this.validateDTO(this.requestDto, this.reqBody);
    if (validationErrors.length > 0) {
      const constraints = Object.values(validationErrors[0].constraints);
      const formattedError = `${validationErrors[0].property} : ${constraints.join(', ')}`;

      throw new ValidationError(formattedError);
    }
  }
}

export class RequestValidationChain {
  private strategies: ValidationStrategy[] = [];

  constructor(readonly event: CustomEvent, initStrategies?: ValidationStrategy[]) {
    initStrategies ? (this.strategies = initStrategies) : null;
  }

  addStrategy(strategy: ValidationStrategy): RequestValidationChain {
    this.strategies.push(strategy);

    return this;
  }

  validate() {
    for (const strategy of this.strategies) {
      strategy.validate(this.event);
    }
  }
}
