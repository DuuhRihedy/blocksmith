import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Injectable()
export class DocumentsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.document.findMany({
            select: {
                id: true,
                title: true,
                emoji: true,
                updatedAt: true,
                createdAt: true,
            },
            orderBy: { updatedAt: "desc" },
        });
    }

    async findOne(id: string) {
        const document = await this.prisma.document.findUnique({
            where: { id },
        });

        if (!document) {
            throw new NotFoundException(`Documento "${id}" não encontrado`);
        }

        return document;
    }

    async create(dto: CreateDocumentDto) {
        return this.prisma.document.create({
            data: {
                title: dto.title,
                content: dto.content ?? "{}",
                emoji: dto.emoji,
            },
        });
    }

    async update(id: string, dto: UpdateDocumentDto) {
        try {
            return await this.prisma.document.update({
                where: { id },
                data: dto,
            });
        } catch {
            throw new NotFoundException(`Documento "${id}" não encontrado`);
        }
    }

    async remove(id: string) {
        try {
            await this.prisma.document.delete({
                where: { id },
            });
            return { deleted: true };
        } catch {
            throw new NotFoundException(`Documento "${id}" não encontrado`);
        }
    }
}
