# 🧱 Blocksmith — Block-Based Editor Monorepo

Ecossistema monorepo para construção e edição de documentos estruturados em blocos (estilo Notion), utilizando **Turborepo**, **NestJS**, **Next.js** e **Tiptap**.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=flat-square)
![Turborepo](https://img.shields.io/badge/Turborepo-v2.4-EF4444?style=flat-square&logo=turborepo)
![PNPM](https://img.shields.io/badge/pnpm-Workspaces-F69220?style=flat-square&logo=pnpm)
![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)

---

## 🎯 Sobre o Projeto

O **Blocksmith** é um projeto de arquitetura avançada construído como um Monorepo modular. O objetivo é fornecer uma experiência de edição de texto rica baseada em blocos reutilizáveis, permitindo a criação de documentos, notas e conteúdos estruturados com navegação via comandos de teclado.

---

## 📦 Estrutura do Monorepo

```
blocksmith/
├── apps/
│   ├── api/             # API REST construída com NestJS + Prisma ORM
│   └── web/             # Aplicação Frontend Next.js (@blocksmith/web)
├── packages/
│   └── editor/          # Pacote reutilizável do editor Tiptap (@blocksmith/editor)
├── package.json         # Gerenciamento de scripts raiz e PNPM Workspaces
└── turbo.json           # Pipelines de build e cache do Turborepo
```

---

## ✨ Funcionalidades Principais

- 📝 **Editor Estruturado em Blocos (`packages/editor`):** Construído sobre a engine Tiptap, oferecendo suporte a títulos, listas, citações, blocos de código e imagens.
- ⚡ **Slash Commands Menu (`/`):** Menu suspenso acionado ao digitar `/` para inserção rápida de novos tipos de blocos sem tirar as mãos do teclado.
- 🛠️ **Barra de Ferramentas Flutuante (`Toolbar.tsx`):** Opções de formatação rápida de texto selecionado (negrito, itálico, links, realce).
- 🔄 **API NestJS de Documentos (`apps/api`):** Endpoints RESTful para criação, leitura, atualização e deleção (CRUD) de documentos persistidos via Prisma ORM.
- 📤 **Menu de Exportação (`ExportMenu.tsx`):** Exportação dos documentos para diferentes formatos.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (v20 ou superior)
- PNPM (v9 ou superior)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/DuuhRihedy/blocksmith.git
cd blocksmith

# 2. Instale as dependências de todos os pacotes via PNPM Workspaces
pnpm install

# 3. Execute o ambiente de desenvolvimento completo (API + Web) via Turborepo
pnpm run dev

# Ou execute apenas uma aplicação específica:
# pnpm run dev:web
# pnpm run dev:editor
```
