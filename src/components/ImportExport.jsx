import React, { useRef } from "react";
import { useTranslation } from 'react-i18next';
import * as XLSX from "xlsx";
import Select from "react-select";

export default function ImportExport({ tasks, setTasks }) {

  const {t} = useTranslation();
  const fileInputRef = useRef();

  const options = [
    { value: "xlsx", label: "Excel (.xlsx)" },
    { value: "csv", label: "CSV (.csv)" },
    { value: "json", label: "JSON (.json)" }
  ];

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

      <Select
      options={options}
      placeholder={t("export_as") + "..."}
      isSearchable={false} // you can set true if you want search box
      onChange={(option) => {
        if (option?.value) {
          exportFile(option.value);
        }
      }}
      className="w-48 text-sm"
      classNamePrefix="select2"
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "0.5rem",
          borderColor: "var(--border)",
          backgroundColor: "var(--card)",
          color: "var(--text)",
          minHeight: "36px",
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: "var(--card)",
          borderRadius: "0.5rem",
          overflow: "hidden",
          zIndex: 9999, // prevents "going behind" issue
        }),
        option: (base, { isFocused }) => ({
          ...base,
          backgroundColor: isFocused ? "var(--primary)" : "var(--card)",
          color: isFocused ? "white" : "var(--text)",
          cursor: "pointer",
          padding: "8px 12px",
        }),
        singleValue: (base) => ({
          ...base,
          color: "var(--text)",
        }),
        placeholder: (base) => ({
          ...base,
          color: "var(--muted)",
        }),
      }} />

      <button
        className="border"
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
