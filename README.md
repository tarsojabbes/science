# Princípios de Desenvolvimento Web

Projeto desenvolvido para a disciplina de Princípios de Desenvolvimento Web (2025.1), com foco na construção de uma API para gerenciamento de revistas científicas, submissão de artigos e revisão por pares duplamente cega.

## Como executar o projeto?

⚠️ É necessário ter o Docker e o Docker Compose instalados na sua máquina

```sh
docker compose up --build
```

Com esse comando, serão instanciados dois contêineres

1. Container `webserver-science`, com a imagem da API desenvolvida em Node.js + Typescript, expondo a porta `3000` para conexões HTTP
2. Container `postgres-db`, com a imagem do banco dados escolhido (PostgreSQL)

A documentação dos endpoints da API está disponível em `http://localhost:3000/api-docs`