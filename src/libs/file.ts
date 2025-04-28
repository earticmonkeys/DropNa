"use server";

import prismaClient from "./prisma";
import QRCode from "qrcode";

export const createSharedFile = async (data: FormData) => {
  try {
    const file = data.get("file") as File;
    if (!file) {
      throw new Error("File not found");
    }

    const fileData = await file.arrayBuffer();
    const buffer = Buffer.from(fileData);

    //generate an unique id for the file with 6 characters include a-zA-Z0-9
    const generateUniqueId = () => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    };

    const fileCreate = await prismaClient.dropFile.create({
      data: {
        id: generateUniqueId(),
        name: file.name,
        size: file.size,
        type: file.type,
        base64: buffer.toString("base64"),

        expiresAt: new Date(Date.now() + 1000 * 60 * 10), /// 10 minutes expiration
      },
    });
    console.log(`File size: ${buffer.length} bytes`);
    const qrcode = await QRCode.toString(
      `${process.env.SELF_URL}/${fileCreate.id}`,
      { type: "svg" }
    );

    return {
      status: 200,
      id: fileCreate.id,
      qrcode: qrcode,
    };
  } catch (error) {
    console.error("Error creating shared file:", error);
    return {
      status: 500,
      id: null,
      qrcode: null,
      message: "Error creating shared file",
    };
  }
};

export const getSharedFile = async (id: string) => {
  try {
    const file = await prismaClient.dropFile.findUnique({
      where: {
        id: id,
        expiresAt: {
          gte: new Date(Date.now()),
        },
      },
    });
    if (!file) {
      throw new Error("File not found");
    }
    if (!file.base64) {
      throw new Error("File base64 data is null");
    }
    const buffer = Buffer.from(file.base64, "base64");
    return {
      name: file.name,
      buffer: buffer,
      fileType: file.type,
    };
  } catch (error) {
    console.error("Error getting shared file:", error);
    return null;
  }
};

export async function downloadFileAction(id: string) {
  const file = await getSharedFile(id);
  if (!file) throw new Error("File not found");

  return {
    name: file.name,
    fileType: file.fileType,
    base64: file.buffer.toString("base64"), // ส่ง base64 ไป
  };
}
