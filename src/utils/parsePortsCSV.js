import * as Papa from 'papaparse';

export const parsePortsCSV = (setPortLocations) => {
  Papa.parse(require('./../data/port_geo_location.csv'), {
    header: true,
    download: true,
    complete: (results) => {
      setPortLocations(results.data);
    },
  });
};
