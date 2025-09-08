# Projeto Fullstack E-commerce

Este repositório contém um projeto fullstack de e-commerce, desenvolvido com Spring Boot para o backend e Next.js para o frontend. O objetivo é fornecer uma plataforma robusta e escalável para vendas online.

## Visão Geral do Projeto

O projeto é dividido em duas partes principais:

*   **Backend**: Uma API RESTful desenvolvida em Java com Spring Boot, responsável pela lógica de negócios, persistência de dados e autenticação.
*   **Frontend**: Uma aplicação web construída com Next.js e TypeScript, que consome a API do backend para exibir produtos, gerenciar carrinhos de compra e processar pedidos.

## Tecnologias Utilizadas

### Backend

*   **Linguagem**: Java
*   **Framework**: Spring Boot
*   **Banco de Dados**: PostgreSQL
*   **Ferramenta de Build**: Maven
*   **Autenticação**: Spring Security

### Frontend

*   **Framework**: Next.js
*   **Linguagem**: TypeScript
*   **Estilização**: Tailwind CSS
*   **Gerenciamento de Estado**: Context API

## Estrutura do Projeto

### Backend (`/backend`)

A estrutura do diretório `backend` segue as convenções de um projeto Spring Boot:

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/comercio/projeto_dscommerce/
│   │   │   ├── config/             # Configurações da aplicação
│   │   │   ├── controllers/        # Endpoints da API REST
│   │   │   ├── dto/                # Objetos de Transferência de Dados
│   │   │   ├── entities/           # Entidades de Banco de Dados
│   │   │   ├── projections/        # Projeções de dados para consultas específicas
│   │   │   ├── repositories/       # Interfaces de acesso a dados (Spring Data JPA)
│   │   │   ├── services/           # Lógica de negócios
│   │   │   └── ProjetoDscommerceApplication.java # Classe principal da aplicação
│   │   └── resources/            # Arquivos de configuração e recursos estáticos
│   └── test/                 # Testes unitários e de integração
├── pom.xml                   # Configurações do projeto Maven
└── ...                       # Outros arquivos de configuração e build
```

### Frontend (`/frontend`)

A estrutura do diretório `frontend` segue as convenções de um projeto Next.js:

```
frontend/
├── public/                   # Arquivos estáticos
├── src/
│   ├── app/                  # Rotas e páginas da aplicação
│   ├── components/           # Componentes reutilizáveis da UI
│   ├── contexts/             # Contextos React para gerenciamento de estado global
│   ├── hooks/                # Hooks personalizados
│   ├── lib/                  # Funções utilitárias e bibliotecas
│   ├── services/             # Funções para interagir com a API do backend
│   ├── middleware.ts         # Middleware do Next.js
│   └── tailwind.config.js    # Configuração do Tailwind CSS
├── package.json              # Dependências e scripts do projeto Node.js
├── next.config.ts            # Configurações do Next.js
└── ...                       # Outros arquivos de configuração e build
```

## Como Rodar o Projeto

### Backend

1.  **Pré-requisitos**: Certifique-se de ter o Java Development Kit (JDK) 17+ e o Maven instalados.
2.  **Banco de Dados**: Configure um banco de dados PostgreSQL e atualize as credenciais no arquivo `application.properties` (ou `application.yml`) dentro de `backend/src/main/resources`.
3.  **Compilar e Rodar**: Navegue até o diretório `backend` e execute:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```
    A API estará disponível em `http://localhost:8080` (porta padrão do Spring Boot).

### Frontend

1.  **Pré-requisitos**: Certifique-se de ter o Node.js (versão 18.x ou superior) e o npm (ou yarn/pnpm) instalados.
2.  **Instalar Dependências**: Navegue até o diretório `frontend` e execute:
    ```bash
    npm install
    # ou yarn install
    # ou pnpm install
    ```
3.  **Rodar a Aplicação**: Execute:
    ```bash
    npm run dev
    # ou yarn dev
    # ou pnpm dev
    ```
    A aplicação frontend estará disponível em `http://localhost:3000`.