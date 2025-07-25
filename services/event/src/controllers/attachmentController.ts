import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AttachmentCreateDTO, AttachmentResponse } from '../types/attachment';
import path from 'path';
import fs from 'fs';
import type { Request as ExpressRequest } from 'express';
import type { Multer } from 'multer';
// import AWS from 'aws-sdk'; // Uncomment for S3

const prisma = new PrismaClient();

function toAttachmentResponse(attachment: any): AttachmentResponse {
  return {
    ...attachment,
    createdAt: attachment.createdAt instanceof Date ? attachment.createdAt.toISOString() : attachment.createdAt,
  };
}

/**
 * File Upload Endpoint
 * 
 * PURPOSE: Handles file upload and returns the file URL/path.
 * This endpoint ONLY handles file upload - it does NOT create database records.
 * 
 * USE CASE: When you need to upload a file and get back a URL that can be used
 * by other endpoints (like addAttachment) or stored elsewhere.
 * 
 * REQUEST: multipart/form-data containing:
 * - file: The actual file to upload
 * 
 * RESPONSE: JSON with file URL and metadata
 * - url: The URL/path where the file is stored
 * - filename: Original filename
 * - mimetype: File MIME type
 * - size: File size in bytes
 * 
 * EXAMPLE: Upload a file, get URL, then use that URL in addAttachment
 */
export async function uploadFile(
  req: ExpressRequest<{ eventId: string }, {}, any> & { file?: any },
  res: Response
) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Local file storage
    const fileUrl = `/uploads/attachments/${req.file.filename}`;
    
    res.status(200).json({
      url: fileUrl,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      message: 'File uploaded successfully'
    });

    // --- S3 Implementation (commented out) ---
    // const s3 = new AWS.S3({
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   region: process.env.AWS_REGION,
    // });
    // const fileContent = fs.readFileSync(req.file.path);
    // const s3Params = {
    //   Bucket: process.env.AWS_S3_BUCKET!,
    //   Key: `attachments/${req.file.filename}`,
    //   Body: fileContent,
    //   ContentType: req.file.mimetype,
    // };
    // const s3Result = await s3.upload(s3Params).promise();
    // fs.unlinkSync(req.file.path); // Remove local file after upload
    // res.status(200).json({
    //   url: s3Result.Location,
    //   filename: req.file.originalname,
    //   mimetype: req.file.mimetype,
    //   size: req.file.size,
    //   message: 'File uploaded to S3 successfully'
    // });
    // --- End S3 Implementation ---
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload file', details: err });
  }
}

/**
 * Add Attachment Endpoint
 * 
 * PURPOSE: Creates a new attachment record in the database that references a file URL.
 * 
 * USE CASE: After uploading a file (via uploadFile endpoint), use this endpoint to
 * create the database record that links the file to an event.
 * 
 * REQUEST: JSON body with metadata (name, description, url)
 * - name: Display name for the attachment
 * - description: Optional description
 * - url: Path/URL to the file (obtained from uploadFile endpoint)
 * 
 * WORKFLOW: 
 * 1. Call uploadFile to upload the file and get URL
 * 2. Call addAttachment with the URL to create the database record
 * 
 * EXAMPLE: 
 * 1. POST /events/123/attachments/upload (with file) → returns { url: "/uploads/file.pdf" }
 * 2. POST /events/123/attachments (with { name: "Invoice", url: "/uploads/file.pdf" })
 */
export async function addAttachment(req: Request<{ eventId: string }, {}, AttachmentCreateDTO>, res: Response<AttachmentResponse>) {
  try {
    const { name, description, url } = req.body;
    const attachment = await prisma.attachment.create({
      data: {
        eventId: req.params.eventId,
        name,
        description,
        url,
      },
    });
    res.status(201).json(toAttachmentResponse(attachment));
  } catch (err) {
    res.status(500).json({ error: 'Failed to add attachment', details: err } as any);
  }
}

export async function listAttachments(req: Request<{ eventId: string }>, res: Response<AttachmentResponse[]>) {
  try {
    const attachments = await prisma.attachment.findMany({
      where: { eventId: req.params.eventId },
    });
    res.json(attachments.map(toAttachmentResponse));
  } catch (err) {
    res.status(500).json({ error: 'Failed to list attachments', details: err } as any);
  }
}

export async function deleteAttachment(req: Request<{ eventId: string; attachmentId: string }>, res: Response) {
  try {
    await prisma.attachment.delete({ where: { id: req.params.attachmentId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete attachment', details: err } as any);
  }
} 