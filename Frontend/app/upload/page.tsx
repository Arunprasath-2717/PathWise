"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");
    try {
      const res = await fetch("http://localhost:8000/upload-scores", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`Success: ${data.message}`);
      } else {
        setStatus(`Error: ${data.detail || "Upload failed"}`);
      }
    } catch (err) {
      setStatus(`Error: ${err}`);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-[var(--primary-lavender)] flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border-t-4 border-[var(--accent-mint)]">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Upload Scores</h1>
        <p className="text-gray-600 mb-8">Upload your .csv, .xls, or .xlsx file containing Student Name, Subject, Test Name, Score, Max Score, Date.</p>
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center bg-[var(--accent-blush)] bg-opacity-30 cursor-pointer hover:bg-opacity-50 transition-all"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            accept=".csv, .xls, .xlsx" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          {file ? (
            <p className="text-lg font-medium text-gray-800">Selected: {file.name}</p>
          ) : (
            <>
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="text-gray-600 font-medium">Click to select or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">.csv, .xls, .xlsx files only</p>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button 
            onClick={() => setFile(null)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
            disabled={!file}
          >
            Clear
          </button>
          <button 
            onClick={handleUpload}
            disabled={!file}
            className="bg-[var(--accent-mint)] hover:bg-green-200 text-gray-800 font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-green-200"
          >
            Upload
          </button>
        </div>
        
        {status && (
          <div className="mt-6 p-4 rounded-md bg-gray-50 border border-gray-200 text-center text-gray-700">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
