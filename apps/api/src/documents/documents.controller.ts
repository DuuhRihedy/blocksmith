import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
} from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";

@Controller("documents")
export class DocumentsController {
    constructor(private readonly documentsService: DocumentsService) { }

    @Get()
    findAll() {
        return this.documentsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.documentsService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateDocumentDto) {
        return this.documentsService.create(dto);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() dto: UpdateDocumentDto) {
        return this.documentsService.update(id, dto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.documentsService.remove(id);
    }
}
