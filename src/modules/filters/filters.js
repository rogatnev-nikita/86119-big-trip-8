import Filter from './filter';
import createStatistics from '../statistics/statistics';

const filtersContainer = document.querySelector(`.trip-filter`);

const filterTripPoints = (filterName, points) => {
  switch (filterName) {
    case `filter-everything`:
      return points;
    case `filter-future`:
      return points.filter((it) => it.dateStart > new Date());
    case `filter-past`:
      return points.filter((it) => it.dateStart < new Date());
    default:
      return points;
  }
};

const createFilters = (names, renderTripPoints, api) => {
  filtersContainer.innerHTML = ``;

  for (let filterName of names) {
    const filterComponent = new Filter(filterName, names.indexOf(filterName) === 0);

    filtersContainer.appendChild(filterComponent.render(filtersContainer));
    filterComponent.onFilter = (evt) => {
      const activeFilter = evt.target.id;

      if (document.querySelector(`.statistic`).classList.contains(`visually-hidden`)) {
        renderTripPoints(filterTripPoints, activeFilter);
      } else {
        api.getTripPoints()
          .then((points) => {
            points = filterTripPoints(activeFilter, points);
            createStatistics(evt, points);
          });
      }
    };
  }
};

export default createFilters;
