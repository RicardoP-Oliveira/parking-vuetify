import logging

from fastapi import FastAPI, File, HTTPException, UploadFile
from psycopg2 import Error as PsycopgError

from services.unidades import inserir_unidades