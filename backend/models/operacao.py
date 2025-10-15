from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid

class OperacaoBase(BaseModel):
    prefixo: str = ''
    agencia: str = ''
    alcada: str = ''
    mci: str = ''
    cliente: str = ''
    idadeCliente: str = ''
    clienteDesde: str = ''
    proposta: str = ''
    linhaCredito: str = ''
    itemFinanciado: str = ''
    rating: str = ''
    autorizacaoGrao: str = ''
    valorOperacao: str = ''
    seguros: str = ''
    rsContratado: str = ''
    limiteCredito: str = ''
    condicionanteLC: str = ''
    receitaBrutaClientes: str = ''
    receitaBrutaObtida: str = ''
    receitaBrutaPrevista: str = ''
    resultadoObtido: str = ''
    resultadoPrevisto: str = ''
    pecuariaCompativel: str = 'naoSeAplica'
    justifique: str = ''
    garantias: str = ''
    recursosLiquidos: str = ''
    patrimonioTotal: str = ''
    endividamentoSFN: str = ''
    endividamentoBB: str = ''
    inadAgroAgencia: str = ''
    propostaCustomizada: str = 'naoSeAplica'
    percentualGarantiaHipotecaria: str = ''
    rendeFacil: str = 'naoSeAplica'
    shareBB: str = '0,00'

class OperacaoCreate(OperacaoBase):
    pass

class Operacao(OperacaoBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "prefixo": "001",
                "agencia": "1234-5",
                "cliente": "João da Silva",
                "proposta": "PROP-2025-001"
            }
        }