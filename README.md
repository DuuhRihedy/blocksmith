# 🧱 Blocksmith

Um poderoso ecossistema de ferramentas web, estruturado como um **Monorepo** moderno utilizando **Turborepo** e **PNPM**.

<div align="center">
  <!-- Adicione o link real de uma imagem do seu projeto aqui depois -->
  <img src="https://raw.githubusercontent.com/DuuhRihedy/DuuhRihedy/main/assets/blocksmith-placeholder.png" alt="Blocksmith Demo" width="800">
</div>

<br>

<div align="center">
  ![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=flat-square)
  ![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
  ![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white)
  ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)
</div>

## 🚀 Features

- ✅ **Arquitetura Monorepo:** Código modularizado em múltiplos pacotes para maximizar o reuso.
- ✅ **Alta Performance de Build:** Gerenciamento de tarefas em cache remoto e local com Turborepo.
- ✅ **Pacotes Independentes:** Contém um pacote principal web (`@blocksmith/web`) e um editor isolado (`@blocksmith/editor`).
- ✅ **Gerenciamento Eficiente:** Controle rigoroso de dependências com o PNPM (Workspaces).

## 🛠️ Tech Stack

### Tooling & Arquitetura
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white)
![PNPM](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)

## ⚡ Quick Start

### Pré-requisitos
- Node.js (v20+)
- pnpm (v9+)

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/DuuhRihedy/blocksmith.git
cd blocksmith
```

2. Instale as dependências (Na raiz do Monorepo)
```bash
pnpm install
```

3. Rodando o ecossistema (todos os pacotes)
```bash
pnpm run dev
```

Ou rode aplicações específicas:
```bash
# Rodar apenas a aplicação Web
pnpm run dev:web

# Rodar apenas o Editor
pnpm run dev:editor
```

## 📁 Estrutura do Monorepo

```
blocksmith/
├── apps/              # Aplicações principais
│   ├── web/           # (@blocksmith/web) Aplicação cliente principal
│   └── editor/        # (@blocksmith/editor) Ferramenta de edição
├── packages/          # Pacotes compartilhados (UI, Configs, Utils)
├── package.json       # Orquestração do pnpm workspace
└── turbo.json         # Pipeline de build do Turborepo
```
