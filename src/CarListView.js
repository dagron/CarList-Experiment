import { set, over, view, not, lensPath, map, join, pipe,
         ascend, descend, sortWith, prop, values, curry } from 'rambda';
import $ from 'jquery';

const sortByFieldLens = lensPath(['_sortBy', 'field']);
const sortOrderFlagLens = lensPath(['_sortBy', 'notRevers']);

const carToString = curry((fields, car) => {
  let html = join('',
                  map(field => `<td>${car[field] || ''}</td>`, fields));
  return `<tr data-car-id="${car.id}">
    ${html}
  </tr>`;
});

/**
 * CarListView
 * TODO: Добавить React, Vue или хотябы Handlebars
 * TODO: Мемоизация метода render от model и _sortBy
 */
export default class CarListView {
  constructor(model, elems, viewConf) {
    this._model = model;
    this._elements = elems;
    this._viewConf = viewConf;
    this._sortBy = { field: undefined, notRevers: false };

    this.createCarCmd = new Event(this);
    this.createOwnerCmd = new Event(this);

    // Слушатели интерфейса.
    //
    // Сортировка автомобилей
    // TODO: требуеться рефракторинг
    this._elements.tableContainer.find('th').click((event) => {
      let field = $(event.currentTarget).data('field');
      if (view(sortByFieldLens, this) === field) {
        // если поле сортировки текущее инвертируем порядок
        over(sortOrderFlagLens, not, this);
      } else {
        // устанавливаем новое поле сортировки и порядок по умолчанию
        set(sortByFieldLens, field, this);
        set(sortOrderFlagLens, true, this);
      }
      this.render();
    });
    // Добавление автомобиля
    this._elements.addCar.click(() => this.createCarCmd.notify());
    // Добавление собственника
    this._elements.addOwner.click((event) => {
      let carId = $(event.currentTarget).parent('tr').data('car-id');
      this.createOwnerCmd.notify({ carId });
    });

    // слушатели модели
    map((event) => {
      this._model[event].attach(() => {
        this.rebuild();
      });
    }, ['carAdded', 'carUpdated', 'stateReseted']);
  }

  sortedCar() {
    const field = view(sortByFieldLens, this);
    const notReverse = view(sortByFieldLens, this);
    const orderFn = (notReverse) ? ascend : descend;
    const sortFn = sortWith([orderFn(prop(field))]);
    return sortFn(values(this._model.state));
  }

  render() {
    this._elements.tableContainer.html(this.renderToString());
  }

  rebuild() {
    this._elements.tableContainer.find('table tbody').replaceWith(this.renderToStringBody());
  }

  renderToString() {
    const head = this.renderToStringHead();
    const body = this.renderToStringBody();
    return `<table class="${this._viewConf.tableClass}">${head} ${body}</table>`;
  }

  renderToStringHead() {
    const order = this._viewConf.columns.order;
    const th = (field) => {
      const fieldTitle = this._viewConf.columns.data[field];
      return `<th data-field="${field}">${fieldTitle}</th>`;
    };
    const thList = join('', map(th, order));
    return `<thead>${thList}</thead>`;
  }

  renderToStringBody() {
    const orderColumns = this._viewConf.columns.order;
    const state = this.sortedCar;
    const trList = pipe(
      map(carToString(orderColumns)),
      join(''),
    )(state);
    return `<tbody>${trList}</tbody>`;
  }
}
