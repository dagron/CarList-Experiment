import { isEmpty, gte, __, both } from 'rambda';
import { Form } from './base';
import { isInt } from '../utils/predicates';

const FIRST_CAR_YEAR = 1768;

export default class CreateOwner extends Form {
  constructor(formSel, carId) {
    super(formSel);
    this.mixinFields = { carId };
  }
  static get defaultValidators() {
    return {
      id: isInt,
      model: !isEmpty,
      brand: !isEmpty,
      year: both(isInt, gte(__, FIRST_CAR_YEAR)),
    };
  }
  show() {
    super.reset();
    this.form.modal('show');
  }

  close() {
    this.form.modal('hide');
  }
}
