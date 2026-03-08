export type BedStatus = 'available' | 'occupied' | 'maintenance';
export type BedType = 'standard' | 'vip';

export interface Bed {
  id: string;
  roomNumber: string;
  bedNumber: string;
  type: BedType;
  status: BedStatus;
  createdAt?: string;
  updatedAt?: string;
}