"use client";

import React from "react";
import "../app/globals.css";
import { FaImage } from "react-icons/fa";

interface FilePreviewProps {
  file: File | null;
}

const FilePreview = ({ file }: FilePreviewProps) => {
  if (!file) return null;
  const handleFileType = (file: File) => {
    switch (file.type.split("/")[0]) {
      case "image":
        return <FaImage className="file-preview-icon" />;
      default:
        return null;
    }
  };
  return (
    <div className="file-preview">
      <p>{handleFileType(file)}</p>
      <p>{file.name}</p>
    </div>
  );
};

export default FilePreview;
