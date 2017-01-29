import { filter, keys, pipe, merge, indexBy, prop } from 'rambda';
import Event from './utils/event';
import { isUndefined, isHighlightedEl, isFilledObject } from './utils/predicates';


/**
 * createIndex - Создать индекс для массива автомобилей
 * @param  {Object[]} cars
 * @param {string} cars[].id - Идетификатор автомобиля
 * @param {string} cars[].model - Модель
 * @param {string} cars[].brand - Брэнд
 * @param {string} cars[].year - Год
 * @returns {Object}
 */
const createIndex = indexBy(prop('id'));

const DEFAULT_OPTIONS = {
  highlightingTimeout: 1000,
};

export default class CarListModel {
  constructor(state = {}, options = {}) {
    this._state = state;
    this._options = merge(DEFAULT_OPTIONS, options);

    // Блок инициализации наблюдателей
    this.carAdded = new Event(this);
    this.carUpdated = new Event(this);
    this.stateReseted = new Event(this);
  }

  /**
   * addCar - Добавление нового автомобиля
   * При добавлении автомобиля ему устанавливаеться флаг подсветки.
   * По прошествии HIGHLIGHTING_NEW_ELEMENT_TIMEOUT флаг автоматически будет снят
   *
   * @param  {Object} carInfo
   */
  addCar(carInfo) {
    const { id, brand, model, year } = carInfo;

    if (isUndefined(id, brand, model, year)) {
      throw new ReferenceError('Невозможно создать автомобиль');
    }

    this._state[id] = { id, brand, model, year, highlighting: true };
    this.carAdded.notify({ car: this._state[id] });

    setTimeout(() => {
      this._state[id].highlighting = undefined;
      this.carUpdated.notify({ id });
    }, this._options.highlightingTimeout);
  }

  /**
   * addOwner - Добавить собственника для автомобиля
   * При добавлении собственника автомобилю устанавливаеться флаг подсветки.
   * По прошествии HIGHLIGHTING_NEW_ELEMENT_TIMEOUT флаг автоматически будет снят
   *
   * @param  {number} idCar - Id автомобиля
   * @param  {string} owner - Владелец автомобиля
   */
  addOwner(idCar, owner) {
    if (isUndefined(idCar, owner)) {
      throw new ReferenceError('Невозможно назначить собственника автомобиля');
    }

    this._state[idCar].owner = owner;
    this._state[idCar].highlighting = true;
    this.carUpdated.notify({ id: this._state[idCar] });

    setTimeout(() => {
      this._state[idCar].highlighting = undefined;
      this.carUpdated.notify({ id: idCar });
    }, this._options.highlightingTimeout);
  }

  /**
   * reset - Заменить состояние модели
   *
   * @param  {(Object|Object[])} state description
   */
  reset(state) {
    const oldState = { ...this._state };
    this._state = (Array.isArray(state)) ? createIndex(state) : { ...state };

    if (isFilledObject(this._state)) {
      const highlightedElems = pipe(filter(isHighlightedEl), keys)(oldState);
      highlightedElems.forEach(function setElAsHighlighted(el) {
        this._state[el].highlighting = true;
      });
    }

    this.stateReseted.notify({ state: this._state });
  }

  get state() {
    return { ...this._state };
  }
}
