import $ from 'jquery';
import { mapObjIndexed, defaultTo, filter, pipe } from 'rambda';
import { isUndefined, isFilledObject } from '../utils/predicates';

class InvalidForm {
  constructor(form, errors) {
    this.name = 'InvalidForm';
    this.message = 'Ошибка валидации';
    this.form = form;
    this.errors = errors;
  }
}

class CloseForm {
  constructor() {
    this.name = 'CloseForm';
    this.message = '';
  }
}

/**
 *  Базовый клас Формы
 *  Служит для управления формой идентификатор которой передан при создании
 */
class Form {
  /**
   * construction - Иниц. формы
   *
   * @param  {String} form_sel - css селектор формы.
   * @param  {Object} validators - Валидаторы формы
   * @param  {function} validators.<string> - Функция валидации поля формы,
   *                                          где <string> имя поля
   * @return {Form} Экземпляр формы
   */
  constructor(formSel, validators) {
    this._form = $(formSel);
    this._validators = validators || this.constructor.defaultValidators;

    this._submitPromise = new Promise((resolve) => {
      this.form.submit((event) => {
        event.preventDefault();
        resolve(this.toObject);
      });
    });
  }

  static get defaultValidators() {
    return {};
  }

  /**
   * validate - Проверка на валидность формы.
   * Если форма не валидна - бросаем исключение InvalidForm
   *
   * @return {Object}
   */
  validate(state) {
    let errors = pipe(
      mapObjIndexed((i, field, obj) => {
        let fn = this._validators[field] || defaultTo(undefined);
        return fn(state[field], obj);
      }),
      filter(!isUndefined),
    )(state);

    if (isFilledObject(errors)) {
      throw new InvalidForm(state, errors);
    } else {
      return state;
    }
  }

  /**
   * toObject - Object представление данных в форме.
   * Если существует this.mixinFields он помешиваеться в итоговый обьект
   *
   * @return {Object}
   */
  get toObject() {
    let obj = this.form.serializeObject();
    return (this.mixinFields) ? { ...this.mixinFields, ...obj } : obj;
  }

  /**
   * process - Обещание отправляемой формы
   *
   * @return {Promise}
   */
  process() {
    return this._submitPromise
      .then(this.validate);
  }

  reset() {
    this.form.trigger('reset');
  }
}

export default {
  InvalidForm,
  CloseForm,
  Form,
};
