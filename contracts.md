# Contratos - SUPER BARREIRAS

## API Endpoints

### 1. POST /api/operacoes
Salvar nova operação ou atualizar existente
```json
Request Body:
{
  "prefixo": "string",
  "agencia": "string",
  "alcada": "string",
  "mci": "string",
  "cliente": "string",
  "idadeCliente": "string",
  "clienteDesde": "date",
  "proposta": "string",
  "linhaCredito": "string",
  "itemFinanciado": "string",
  "rating": "string",
  "autorizacaoGrao": "string",
  "valorOperacao": "string",
  "seguros": "string",
  "rsContratado": "string",
  "limiteCredito": "string",
  "condicionanteLC": "string",
  "receitaBrutaClientes": "string",
  "receitaBrutaObtida": "string",
  "receitaBrutaPrevista": "string",
  "resultadoObtido": "string",
  "resultadoPrevisto": "string",
  "pecuariaCompativel": "string",
  "justifique": "string",
  "garantias": "string",
  "recursosLiquidos": "string",
  "patrimonioTotal": "string",
  "endividamentoSFN": "string",
  "endividamentoBB": "string",
  "inadAgroAgencia": "string",
  "propostaCustomizada": "string",
  "percentualGarantiaHipotecaria": "string",
  "rendeFacil": "string",
  "shareBB": "string"
}

Response:
{
  "id": "string",
  "message": "Operação salva com sucesso",
  "data": { ...operacao }
}
```

### 2. GET /api/operacoes
Listar todas as operações
```json
Response:
[
  {
    "id": "string",
    "prefixo": "string",
    ...todos os campos
  }
]
```

### 3. GET /api/operacoes/{id}
Buscar operação por ID
```json
Response:
{
  "id": "string",
  "prefixo": "string",
  ...todos os campos
}
```

### 4. DELETE /api/operacoes/{id}
Deletar operação por ID

## MongoDB Schema

Collection: `operacoes`

```python
{
  "_id": ObjectId,
  "prefixo": str,
  "agencia": str,
  "alcada": str,
  "mci": str,
  "cliente": str,
  "idadeCliente": str,
  "clienteDesde": str,
  "proposta": str,
  "linhaCredito": str,
  "itemFinanciado": str,
  "rating": str,
  "autorizacaoGrao": str,
  "valorOperacao": str,
  "seguros": str,
  "rsContratado": str,
  "limiteCredito": str,
  "condicionanteLC": str,
  "receitaBrutaClientes": str,
  "receitaBrutaObtida": str,
  "receitaBrutaPrevista": str,
  "resultadoObtido": str,
  "resultadoPrevisto": str,
  "pecuariaCompativel": str,
  "justifique": str,
  "garantias": str,
  "recursosLiquidos": str,
  "patrimonioTotal": str,
  "endividamentoSFN": str,
  "endividamentoBB": str,
  "inadAgroAgencia": str,
  "propostaCustomizada": str,
  "percentualGarantiaHipotecaria": str,
  "rendeFacil": str,
  "shareBB": str,
  "createdAt": datetime,
  "updatedAt": datetime
}
```

## Frontend - Backend Integration

### Mudanças no Frontend:
1. Implementar chamadas reais à API no handleSave
2. Adicionar funcionalidade de carregar operações salvas
3. Adicionar lista/histórico de operações
4. Adicionar modal de seleção de operação para editar

### Mock Data a Remover:
- Não há mock data no momento, apenas toast simulado no handleSave

### Como Integrar:
1. Criar service file em `frontend/src/services/api.js` com axios
2. Atualizar handleSave para chamar POST /api/operacoes
3. Adicionar useEffect para carregar lista de operações
4. Adicionar funcionalidade de edição (carregar dados no form)
