import { getSharedFile } from "@/libs/file";
import DownloadButton from "./component";
import "../globals.css";
import { FaFile, FaSadCry } from "react-icons/fa";
import { BiSad } from "react-icons/bi";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const file = await getSharedFile(id);

  return (
    <div className="download-container">
      {file && (
        <>
          <div className="file-info">
            <FaFile /> {file.name}
          </div>
          <DownloadButton id={id} />
        </>
      )}
      {!file && (
        <div className="file-not-found">
          <p>
            <BiSad /> file not found or expired
          </p>
        </div>
      )}
    </div>
  );
}
