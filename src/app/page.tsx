"use client";
import React from "react";
import "./globals.css";
import { FaBox, FaClipboard, FaHandPointDown, FaShare } from "react-icons/fa";
import FilePreview from "@/component/FilePreview";
import { createSharedFile } from "@/libs/file";
import { useRouter } from "next/navigation";

export default function Home() {
  const [file, setFile] = React.useState<File | null>(null);
  const [sharedId, setSharedId] = React.useState<{
    id: string | null;
    qrcode: string | null;
  } | null>(null);

  console.log(sharedId);

  const router = useRouter();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleShareFile = async () => {
    const filesData = new FormData();
    if (!file) {
      console.error("No file selected");
    }
    if (file) {
      filesData.append("file", file);
    }
    const fileCreate = await createSharedFile(filesData);
    if (fileCreate.status === 200) {
      setSharedId({
        id: fileCreate.id,
        qrcode: fileCreate.qrcode,
      });
    } else {
      alert("Error creating shared file");
    }
  };
  return (
    <div className="container">
      <div className="drop-card">
        <div className="card-header">
          <FaBox className="drop-icon" />
          <p>drop your file, url here.</p>
        </div>
        <div className="drop-body">
          {!file && !sharedId && (
            <>
              <input
                onChange={handleFileChange}
                type="file"
                id="files"
                className="drop-input"
              />

              <label className="drop-input-label" htmlFor="files">
                <FaHandPointDown className="drop-icon" />
                select file or drop here
              </label>
            </>
          )}
          {file && <FilePreview file={file} />}
        </div>
        {file && !sharedId && (
          <div onClick={handleShareFile} className="drop-button">
            <FaShare />
            Share
          </div>
        )}

        {sharedId && (
          <div
            // onClick={() => router.push(`/${sharedId}`)}
            className="drop-shared"
          >
            <p style={{color:'#666'}}>file shared successfully!</p>
            <div
              dangerouslySetInnerHTML={{ __html: sharedId.qrcode || "" }}
              className="drop-qrcode"
            ></div>
            {/* Clipboard  */}

            <div
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_SELF_URL}/${sharedId.id}`
                );
              }}
              className="drop-shared-id-button"
            >
              <FaClipboard />
              Copy to clipboard
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
