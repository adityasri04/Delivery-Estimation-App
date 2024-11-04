import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';

export const parseCSV = async (fileUri) => {
  const file = await FileSystem.readAsStringAsync(fileUri);
  
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
