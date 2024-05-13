import * as Papa from 'papaparse';

export const parsePortsCSV = () => {
  return new Promise((resolve, reject) => {
    Papa.parse(require('./../data/port_geo_location.csv'), {
      header: true,
      download: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};