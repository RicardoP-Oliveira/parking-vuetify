-- CreateEnum
CREATE TYPE "enum_movimentacoes_tipo" AS ENUM ('VEICULO', 'PEDESTRE');

-- CreateTable
CREATE TABLE "orgaos" (
    "id" BIGSERIAL NOT NULL,
    "sigla" VARCHAR(255) NOT NULL,
    "sigla_curta" VARCHAR(255),
    "orgao" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orgaos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_documentos" (
    "id" BIGSERIAL NOT NULL,
    "tipo" VARCHAR(255) NOT NULL,
    "documento" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipo_documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tratamentos" (
    "id" BIGSERIAL NOT NULL,
    "sigla" VARCHAR(255) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tratamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" BIGSERIAL NOT NULL,
    "sigla" VARCHAR(255),
    "unidade" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinos" (
    "id" BIGSERIAL NOT NULL,
    "unidade_id" BIGINT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "destinos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" BIGSERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(255),
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" BIGSERIAL NOT NULL,
    "documento" VARCHAR(50) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "orgao_id" BIGINT,
    "tratamento_id" BIGINT NOT NULL,
    "unidade_id" BIGINT NOT NULL,
    "tipo_doc_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veiculos" (
    "id" BIGSERIAL NOT NULL,
    "placa" VARCHAR(255) NOT NULL,
    "marca" VARCHAR(255),
    "modelo" VARCHAR(255),
    "renavam" VARCHAR(255),
    "prefixo" VARCHAR(255),
    "usuario_id" BIGINT,
    "orgao_id" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" BIGSERIAL NOT NULL,
    "tipo" "enum_movimentacoes_tipo" NOT NULL,
    "entrada" TIMESTAMPTZ(6) NOT NULL,
    "saida" TIMESTAMPTZ(6),
    "user_entrada_id" BIGINT NOT NULL,
    "user_saida_id" BIGINT,
    "veiculo_id" BIGINT,
    "destino_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "acessos" (
    "id" BIGSERIAL NOT NULL,
    "usuario_id" BIGINT NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "role_id" BIGINT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acessos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ceics" (
    "id" BIGSERIAL NOT NULL,
    "entrada" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "hEntrada" TIME(6) DEFAULT CURRENT_TIMESTAMP,
    "saida" TIMESTAMP,
    "hSaida" TIME(6),
    "placa" VARCHAR(50),
    "marcaModelo" VARCHAR(50),
    "eCondutor" VARCHAR(255),
    "eRg" VARCHAR(50),
    "sRg" VARCHAR(50),
    "sCondutor" VARCHAR(255),
    "destino" VARCHAR(50),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ceics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orgaos_sigla_key" ON "orgaos"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "orgaos_sigla_curta_key" ON "orgaos"("sigla_curta");

-- CreateIndex
CREATE UNIQUE INDEX "orgaos_orgao_key" ON "orgaos"("orgao");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_documentos_tipo_key" ON "tipo_documentos"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_documentos_documento_key" ON "tipo_documentos"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "tratamentos_sigla_key" ON "tratamentos"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "tratamentos_nome_key" ON "tratamentos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_sigla_key" ON "unidades"("sigla");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_unidade_key" ON "unidades"("unidade");

-- CreateIndex
CREATE UNIQUE INDEX "destinos_unidade_id_key" ON "destinos"("unidade_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_nome_key" ON "roles"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_documento_key" ON "usuarios"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_placa_key" ON "veiculos"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "acessos_usuario_id_key" ON "acessos"("usuario_id");

-- AddForeignKey
ALTER TABLE "destinos" ADD CONSTRAINT "destinos_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_orgao_id_fkey" FOREIGN KEY ("orgao_id") REFERENCES "orgaos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_tipo_doc_id_fkey" FOREIGN KEY ("tipo_doc_id") REFERENCES "tipo_documentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_tratamento_id_fkey" FOREIGN KEY ("tratamento_id") REFERENCES "tratamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_unidade_id_fkey" FOREIGN KEY ("unidade_id") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_orgao_id_fkey" FOREIGN KEY ("orgao_id") REFERENCES "orgaos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veiculos" ADD CONSTRAINT "veiculos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_destino_id_fkey" FOREIGN KEY ("destino_id") REFERENCES "destinos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_user_entrada_id_fkey" FOREIGN KEY ("user_entrada_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_user_saida_id_fkey" FOREIGN KEY ("user_saida_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "veiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acessos" ADD CONSTRAINT "acessos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acessos" ADD CONSTRAINT "acessos_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
