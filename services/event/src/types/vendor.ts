export interface VendorCreateDTO {
  name: string;
  description?: string;
  phoneNumber?: string;
  price: number;
  amount: number;
  paymentStatus: string;
}

export interface VendorUpdateDTO extends Partial<VendorCreateDTO> {}

export interface VendorResponse {
  id: string;
  name: string;
  description?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
} 