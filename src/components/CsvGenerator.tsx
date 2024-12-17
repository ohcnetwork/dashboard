import React from "react";

interface CsvGeneratorProps {
  data: object[]; // Array of objects to convert to CSV
  fileName?: string; // Name of the CSV file
}

const CsvGenerator: React.FC<CsvGeneratorProps> = ({ data, fileName = "data.csv" }) => {
  const generateCsv = () => {
    if (!data || data.length === 0) {
      alert("No data available to generate CSV.");
      return;
    }

    // Extract headers
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(","));

    // Add data rows
    data.forEach((row) => {
      const values = headers.map((header) => {
        const cell = row[header];
        return typeof cell === "string" ? `"${cell.replace(/"/g, '""')}"` : cell;
      });
      csvRows.push(values.join(","));
    });

    // Combine rows into a single string
    const csvContent = csvRows.join("\n");

    // Create a blob and a downloadable link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url); // Clean up
  };

  return (
    <button
      onClick={generateCsv}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
    >
      Download CSV
    </button>
  );
};

export default CsvGenerator;
