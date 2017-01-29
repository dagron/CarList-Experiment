import Api from './api';
import { CreateCar } from './forms/createCar';
import { CreateOwner } from './forms/createOwner';

export default class CarListCtrl {
  constructor(model, view) {
    this._model = model;
    this._view = view;
    this._view.render();

    // Слушатели view
    this._view.createCarCmd.attach(() => this.createCar());
    this._view.createOwnerCmd.attach(carId => this.createOwner(carId));
  }

  createCar() {
    const form = new CreateCar('#createCarForm');
    form.show();
    form.process()
      .then(Api.createCarRequest)
      .then(this._model.addCar)
      .catch((err) => {
        console.log(err);
        alert('Произошла ошибка. Попробуйте позже');
      });
  }
  createOwner(carId) {
    const form = new CreateOwner('#createOwnerForm', carId);
    form.show();
    form.process()
      .then(Api.createOwnerRequest)
      .then(owner => this._model.addOwner(carId, owner))
      .catch((err) => {
        console.log(err);
        alert('Произошла ошибка. Попробуйте позже');
      });
  }
}
