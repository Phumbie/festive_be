export interface AttachmentCreateDTO {
  name: string;
  description?: string;
  url: string;
}

export interface AttachmentResponse {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  url: string;
  createdAt: string;
} 