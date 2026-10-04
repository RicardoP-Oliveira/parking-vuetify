# repositories/unidades_repository.py
def criar_tabelas_temporarias(cur):
    cur.execute("""
        CREATE TEMP TABLE dgp (
            "Unidade" text,
            unidade_limpa text
        ) ON COMMIT DROP;
    """)

    cur.execute("""
        CREATE TEMP TABLE dicionario (
            padrao_regex text,
            unidade_traduzida text
        ) ON COMMIT DROP;
    """)

def carregar_dgp(cur, arquivo):
    cur.copy_expert(
        'COPY dgp ("Unidade") FROM STDIN WITH (FORMAT CSV)',
        arquivo,
    )