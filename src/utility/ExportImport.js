import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = (todos) => {
  // Convert array to worksheet
  const worksheet = XLSX.utils.json_to_sheet(todos);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "ToDos");

  // Export
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "SmartToDoList.xlsx");
};

const importFromExcel = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Merge or Replace existing todos
    setTodos(jsonData);
  };

  reader.readAsArrayBuffer(file);
};

export {exportToExcel, importFromExcel};