import ModelOffer from '../models/model-offer';
import ModelTripPoint from '../models/model-trip-point';

const CheckStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

class API {
  constructor({endPoint, authorization}) {
    this._METHODS = {
      GET: `GET`,
      POST: `POST`,
      PUT: `PUT`,
      DELETE: `DELETE`
    };

    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTripPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(ModelTripPoint.parseTripPoints);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON)
      .then(ModelOffer.parseOffers);
  }

  createTripPoint({point}) {
    return this._load({
      url: `points`,
      method: this._METHODS.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTripPoint.parseTripPoints);
  }

  updateTripPoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: this._METHODS.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(toJSON)
      .then(ModelTripPoint.parseTripPoints);
  }

  deleteTripPoint({id}) {
    return this._load({
      url: `points/${id}`,
      method: this._METHODS.DELETE,
    });
  }

  _load({url, method = this._METHODS.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(CheckStatus)
      .catch((error) => {
        throw error;
      });
  }
}

export default API;