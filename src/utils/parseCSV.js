import * as Papa from 'papaparse';

export const parseCSV = (shipData) => {
  console.log("Hello world");
  return new Promise((resolve, reject) => {
    const groupedData = {};

    Papa.parse(shipData, {
      header: true,
      download: true,
      complete: (results) => {
        results.data.forEach((row) => {
          const shipName = row.site_name;
          const timestamp = new Date(row.ec_timestamp);
          if (!groupedData[shipName]) {
            groupedData[shipName] = [];
          }
          groupedData[shipName].push({ ...row, ec_timestamp: timestamp });
        });

        // Sort ship data by timestamp in ascending order
        Object.values(groupedData).forEach((shipData) => {
          shipData.sort((a, b) => a.ec_timestamp - b.ec_timestamp);
        });

        console.log("bye world");
        resolve(groupedData);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};