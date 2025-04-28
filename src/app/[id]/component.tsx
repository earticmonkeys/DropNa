"use client";

import { downloadFileAction } from "@/libs/file";
import "../globals.css";

const onDownload = (
  file: { buffer: Buffer; fileType: string; name: string },
  id: string
) => {
  const blob = new Blob([file.buffer], { type: file.fileType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name; // กำหนดชื่อไฟล์
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

type DownloadButtonProps = {
  id: string;
};

export default function DownloadButton({ id }: DownloadButtonProps) {
  const handleClick = async () => {
    const file = await downloadFileAction(id); // เรียกผ่าน server action
    if (!file) {
      console.error("File not found");
      return;
    }
    const buffer = Buffer.from(file.base64, "base64");
    onDownload(
      {
        buffer,
        fileType: file.fileType || "application/octet-stream",
        name: file.name,
      },
      id
    );
  };

  return (
    <button className="download-button" onClick={handleClick}>
      Download File
    </button>
  );
}
