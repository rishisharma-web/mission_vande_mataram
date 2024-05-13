import * as Papa from 'papaparse';

export const parseCSV = (shipData, setParsedData) => {
  Papa.parse(shipData, {
    header: true,
    download: true,
    complete: (results) => {
      const groupedData = results.data.reduce((acc, row) => {
        const shipName = row.site_name;
        const timestamp = new Date(row.ec_timestamp);
        if (!acc[shipName] || acc[shipName].ec_timestamp < timestamp) {
          acc[shipName] = row;
        }
        return acc;
      }, {});
      const latestLocations = Object.values(groupedData);
      setParsedData(latestLocations);
    },
  });
};
