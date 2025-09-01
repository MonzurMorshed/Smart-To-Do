import React, { useRef } from "react";
import { useTranslation } from 'react-i18next';
import * as XLSX from "xlsx";

export default function ImportExport({ tasks, setTasks }) {

  const {t} = useTranslation();
  const fileInputRef = useRef();

  const exportFile = (type) => {
    if (type === "xlsx") {
      const ws = XLSX.utils.json_to_sheet(tasks);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "tasks");
      XLSX.writeFile(wb, "SmartToDo.xlsx");
    } 
    else if (type === "csv") {
      const csvContent =
        "data:text/csv;charset=utf-8," +
        ["Title,Completed,Date", ...tasks.map(todo =>
          `${todo.title},${todo.completed},${todo.date}`
        )].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.href = encodedUri;
      link.download = "SmartToDo.csv";
      link.click();
    }
    else if (type === "json") {
      const blob = new Blob([JSON.stringify(tasks, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SmartToDo.json";
      a.click();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExt = file.name.split(".").pop().toLowerCase();

    reader.onload = (e) => {
      if (fileExt === "json") {
        setTasks(JSON.parse(e.target.result));
      }
      else if (fileExt === "csv") {
        const lines = e.target.result.split("\n").slice(1);
        const importedtasks = lines
          .filter(line => line.trim() !== "")
          .map(line => {
            const [title, completed, date] = line.split(",");
            return { title, completed: completed === "true", date };
          });
        setTasks(importedtasks);
      }
      else if (fileExt === "xlsx") {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setTasks(jsonData);
      }
    };

    if (fileExt === "xlsx") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex items-center gap-2">
      
      <select
        onChange={(e) => {
          if (e.target.value) {
            exportFile(e.target.value);
            e.target.value = ""; 
          }
        }}
        className="border rounded p-1 text-sm bg-white dark:bg-gray-800 dark:text-white"
      >
        <option value="">{t('export_as')}...</option>
        <option value="xlsx">Excel (.xlsx)</option>
        <option value="csv">CSV (.csv)</option>
        <option value="json">JSON (.json)</option>
      </select>

      <button
        className="border rounded px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600"
        onClick={() => fileInputRef.current.click()}
      >
        {t('import')}
      </button>

      <input
        type="file"
        accept=".xlsx,.csv,.json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
    </div>
  );
}
