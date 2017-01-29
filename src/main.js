import JQuery from 'jquery';
import CarListCtrl from './CarListCtrl';
import CarListModel from './CarListModel';
import CarListView from './CarListView';


JQuery(() => {
  const model = new CarListModel();
  const view = new CarListView(model, {
    tableContainer: '#app',
    addCar: '#add-car',
    addOwner: '#add-owner',
  }, {
    columns: {
      order: ['id', 'brand', 'model', 'year', 'owner'],
      data: {
        id: 'ID',
        brand: 'Марка',
        model: 'Модель',
        year: 'Год выпуска',
        owner: 'Собственник',
      },
    },
    tableClass: 'table',
  });
  const ctrl = new CarListCtrl(model, view); // eslint-disable-line
});
