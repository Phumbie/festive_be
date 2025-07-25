export interface VendorCreateDTO {
  name: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  ownerId?: string;
}

export interface VendorUpdateDTO extends Partial<VendorCreateDTO> {}

export interface VendorResponse {
  id: string;
  name: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
} 