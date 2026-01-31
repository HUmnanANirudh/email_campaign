import Papa from "papaparse";

export interface CsvRow {
  name: string;
  email: string;
  [key: string]: string;
}

export interface ParseResult {
  data: CsvRow[];
  error?: string;
  count: number;
}

export const parseCsvFile = (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, meta } = results;
        
        // Validation: Check for required columns
        const requiredHeaders = ["name", "email"];
        const headers = meta.fields || [];
        const missingHeaders = requiredHeaders.filter(
          (h) => !headers.map((header) => header.toLowerCase()).includes(h)
        );

        if (missingHeaders.length > 0) {
          resolve({
            data: [],
            count: 0,
            error: `Missing required columns: ${missingHeaders.join(", ")}`,
          });
          return;
        }

        // Normalize keys to lowercase for consistency
        const normalizedData = (data as Record<string, string>[]).map((row) => {
          const newRow: CsvRow = { name: "", email: "" };
          Object.keys(row).forEach((key) => {
            if (key.toLowerCase() === "name") newRow.name = row[key];
            else if (key.toLowerCase() === "email") newRow.email = row[key];
            else newRow[key] = row[key];
          });
          return newRow;
        });

        resolve({
          data: normalizedData,
          count: normalizedData.length,
        });
      },
      error: (error) => {
        resolve({
          data: [],
          count: 0,
          error: `CSV Parsing Error: ${error.message}`,
        });
      },
    });
  });
};
