import { IsString, IsOptional } from "class-validator";

export class CreateDocumentDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    content?: string;

    @IsString()
    @IsOptional()
    emoji?: string;
}
