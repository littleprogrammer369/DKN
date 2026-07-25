import { IsString, IsOptional, IsNotEmpty, IsIn, IsNumber, IsDateString } from 'class-validator';
const SEV = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export class CreatePestDto {
  @IsString() @IsNotEmpty() pestName: string;
  @IsOptional() @IsString() category?: string;
  @IsString() @IsIn(SEV) severity: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() chemical?: string;
  @IsOptional() @IsString() image?: string;          // base64 data URL (downscaled on client)
  @IsOptional() @IsNumber() probability?: number;    // AI confidence 0-100
  @IsOptional() @IsDateString() detectedAt?: string;
}
export class UpdatePestDto {
  @IsOptional() @IsString() @IsNotEmpty() pestName?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() @IsIn(SEV) severity?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() chemical?: string;
  @IsOptional() @IsString() image?: string;
  @IsOptional() @IsNumber() probability?: number;
}
export class DetectDto {
  @IsString() @IsNotEmpty() image: string;
  @IsOptional() @IsString() mimeType?: string;
  @IsOptional() @IsString() farmId?: string;
}
