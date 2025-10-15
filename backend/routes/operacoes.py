from fastapi import APIRouter, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from models.operacao import Operacao, OperacaoCreate
from typing import List
import os
from datetime import datetime

router = APIRouter()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
operacoes_collection = db.operacoes

@router.post("/operacoes", response_model=Operacao)
async def create_operacao(operacao_data: OperacaoCreate):
    """
    Criar nova operação
    """
    try:
        operacao_dict = operacao_data.dict()
        operacao_obj = Operacao(**operacao_dict)
        operacao_dict_full = operacao_obj.dict()
        
        # Inserir no MongoDB
        result = await operacoes_collection.insert_one(operacao_dict_full)
        
        if result.inserted_id:
            return operacao_obj
        else:
            raise HTTPException(status_code=500, detail="Erro ao salvar operação")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao criar operação: {str(e)}")

@router.get("/operacoes", response_model=List[Operacao])
async def get_all_operacoes():
    """
    Listar todas as operações
    """
    try:
        operacoes = await operacoes_collection.find().sort("createdAt", -1).to_list(1000)
        return [Operacao(**op) for op in operacoes]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar operações: {str(e)}")

@router.get("/operacoes/{operacao_id}", response_model=Operacao)
async def get_operacao(operacao_id: str):
    """
    Buscar operação por ID
    """
    try:
        operacao = await operacoes_collection.find_one({"id": operacao_id})
        if operacao:
            return Operacao(**operacao)
        else:
            raise HTTPException(status_code=404, detail="Operação não encontrada")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar operação: {str(e)}")

@router.put("/operacoes/{operacao_id}", response_model=Operacao)
async def update_operacao(operacao_id: str, operacao_data: OperacaoCreate):
    """
    Atualizar operação existente
    """
    try:
        # Verificar se existe
        existing = await operacoes_collection.find_one({"id": operacao_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Operação não encontrada")
        
        # Atualizar dados
        update_data = operacao_data.dict()
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await operacoes_collection.update_one(
            {"id": operacao_id},
            {"$set": update_data}
        )
        
        if result.modified_count > 0 or result.matched_count > 0:
            updated_operacao = await operacoes_collection.find_one({"id": operacao_id})
            return Operacao(**updated_operacao)
        else:
            raise HTTPException(status_code=500, detail="Erro ao atualizar operação")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar operação: {str(e)}")

@router.delete("/operacoes/{operacao_id}")
async def delete_operacao(operacao_id: str):
    """
    Deletar operação
    """
    try:
        result = await operacoes_collection.delete_one({"id": operacao_id})
        
        if result.deleted_count > 0:
            return {"message": "Operação deletada com sucesso", "id": operacao_id}
        else:
            raise HTTPException(status_code=404, detail="Operação não encontrada")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao deletar operação: {str(e)}")