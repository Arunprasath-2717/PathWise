"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { token, studentId } = useAuth();
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError("");
    const validTypes = [".csv", ".xls", ".xlsx"];
    const isValid = validTypes.some(type => selectedFile.name.toLowerCase().endsWith(type));
    
    if (isValid) {
      setFile(selectedFile);
    } else {
      setError("Please upload a valid .csv, .xls, or .xlsx file.");
    }
  };

  const handleUpload = async () => {
    if (!file || !token || !studentId) return;
    
    setUploading(true);
    setError("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload-scores", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        // Trigger background analysis regenerate just in case
        fetch(`http://localhost:8000/analysis/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setError(data.detail || "Upload failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageTransition>
      {/* Header */}
      <header className="h-16 flex justify-between items-center px-container-margin w-full bg-surface border-b border-outline-variant z-10 shrink-0">
        <div className="flex flex-col">
          <h2 className="font-headline-md text-headline-md font-bold text-primary leading-tight">
            Upload Scores
          </h2>
          <span className="text-[12px] text-on-surface-variant opacity-80">Sync your academic performance</span>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-lg relative flex items-center justify-center bg-surface-container-lowest">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-surface border border-outline-variant rounded-2xl shadow-sm p-xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">Upload Your Grades</h3>
            <p className="text-on-surface-variant mt-2 text-sm">
              We support Excel (.xlsx, .xls) and CSV (.csv) files.
            </p>
          </div>

          <form onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".csv,.xls,.xlsx" 
              onChange={handleChange} 
            />
            <div 
              className={`w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors duration-200 ${
                dragActive ? "border-primary bg-primary/5" : "border-outline-variant bg-surface-container-low"
              } cursor-pointer`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {file ? (
                <div className="text-center">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">draft</span>
                  <p className="font-bold text-on-surface">{file.name}</p>
                  <p className="text-xs text-on-surface-variant mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div className="text-center pointer-events-none">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">upload_file</span>
                  <p className="font-bold text-on-surface">Drag & drop your file here</p>
                  <p className="text-xs text-on-surface-variant mt-1">or click to browse from your computer</p>
                </div>
              )}
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg flex items-center gap-2 text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-green-500/10 text-green-600 rounded-lg flex items-center gap-2 text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                Scores uploaded successfully! Analyzing data...
              </motion.div>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => { setFile(null); setError(""); }}
                className="px-6 py-2 rounded-lg font-bold text-primary hover:bg-primary/10 transition-colors"
                disabled={uploading || !file}
              >
                Clear
              </button>
              <button 
                type="button" 
                onClick={handleUpload}
                disabled={!file || uploading || success}
                className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Uploading...
                  </>
                ) : success ? (
                  <>
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    Done
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">publish</span>
                    Upload & Analyze
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
}
