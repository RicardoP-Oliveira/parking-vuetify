import csv
import io
import tempfile

def normalizar_nome_coluna(nome):
    return (
        nome.strip()
        .lower()
        .replace("_", "")
        .replace("-", "")
        .replace(" ", "")
    )

def preparar_csv(upload, nome_arquivo, colunas_esperadas):
    """
    Valida o cabeçalho e devolve um arquivo temporário compatível com COPY.
    Retorna (arquivo_temporario, quantidade_de_linhas).
    """
    origem = upload.file
    origem.seek(0)

    amostra = origem.read(8192)
    if not amostra:
        raise ValueError(f"O arquivo {nome_arquivo} está vazio.")

    try:
        amostra_texto = amostra.decode("utf-8-sig")
    except UnicodeDecodeError as erro:
        raise ValueError(
            f"O arquivo {nome_arquivo} deve estar codificado em UTF-8."
        ) from erro

    try:
        delimitador = csv.Sniffer().sniff(
            amostra_texto,
            delimiters=",;\t|",
        ).delimiter
    except csv.Error:
        primeira_linha = amostra_texto.splitlines()[0]
        delimitador = ";" if ";" in primeira_linha else ","

    origem.seek(0)
    texto_origem = io.TextIOWrapper(
        origem,
        encoding="utf-8-sig",
        newline="",
    )

    temporario = tempfile.SpooledTemporaryFile(
        mode="w+",
        encoding="utf-8",
        newline="",
    )

    try:
        leitor = csv.DictReader(texto_origem, delimiter=delimitador)

        if not leitor.fieldnames:
            raise ValueError(f"O arquivo {nome_arquivo} não tem cabeçalho.")

        cabecalhos = {
            normalizar_nome_coluna(cabecalho): cabecalho
            for cabecalho in leitor.fieldnames
            if cabecalho
        }

        ausentes = [
            coluna
            for coluna in colunas_esperadas
            if normalizar_nome_coluna(coluna) not in cabecalhos
        ]

        if ausentes:
            raise ValueError(
                f"No arquivo {nome_arquivo}, faltam as colunas: "
                + ", ".join(ausentes)
            )

        escritor = csv.writer(temporario)
        quantidade = 0

        for numero_linha, linha in enumerate(leitor, start=2):
            if None in linha:
                raise ValueError(
                    f"Linha {numero_linha} de {nome_arquivo}: "
                    "número inesperado de valores."
                )

            valores = [
                linha.get(
                    cabecalhos[normalizar_nome_coluna(coluna)]
                ) or ""
                for coluna in colunas_esperadas
            ]

            if not any(valores):
                continue

            escritor.writerow(valores)
            quantidade += 1

        temporario.seek(0)
        return temporario, quantidade

    except Exception:
        temporario.close()
        raise

    finally:
        # Fecha o wrapper sem fechar o arquivo recebido pelo FastAPI.
        try:
            texto_origem.detach()
        except Exception:
            pass