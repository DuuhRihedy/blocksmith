import { Module } from "@nestjs/common";
import { DocumentsModule } from "./documents/documents.module";
import { PrismaModule } from "./prisma/prisma.module";

@Module({
    imports: [PrismaModule, DocumentsModule],
})
export class AppModule { }
