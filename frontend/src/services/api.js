import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const operacoesService = {
  // Criar nova operação
  create: async (data) => {
    const response = await api.post('/operacoes', data);
    return response.data;
  },

  // Listar todas as operações
  getAll: async () => {
    const response = await api.get('/operacoes');
    return response.data;
  },

  // Buscar operação por ID
  getById: async (id) => {
    const response = await api.get(`/operacoes/${id}`);
    return response.data;
  },

  // Atualizar operação
  update: async (id, data) => {
    const response = await api.put(`/operacoes/${id}`, data);
    return response.data;
  },

  // Deletar operação
  delete: async (id) => {
    const response = await api.delete(`/operacoes/${id}`);
    return response.data;
  },
};

export default api;