import fs from 'fs';
import{ parse } from 'csv-parse/sync';

export class DataProvider {

// Method to read data from a JSON file and return it as an array of objects
    static getTestDataFromJson(filePath: string)
    {
        let data:string =JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return data;

}
   // Method to read data from a CSV file
    static getTestDataFromCsv(filePath: string)
    {
       let data=parse(fs.readFileSync(filePath),{columns:true, skip_empty_lines:true})
       return data;
    }   
}