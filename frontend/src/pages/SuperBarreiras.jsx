import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Save, Download, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from '../hooks/use-toast';

const SuperBarreiras = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    prefixo: '',
    agencia: '',
    alcada: '',
    mci: '',
    cliente: '',
    idadeCliente: '',
    clienteDesde: '',
    proposta: '',
    linhaCredito: '',
    itemFinanciado: '',
    rating: '',
    autorizacaoGrao: '',
    valorOperacao: '',
    seguros: '',
    rsContratado: '',
    limiteCredito: '',
    condicionanteLC: '',
    receitaBrutaClientes: '',
    receitaBrutaObtida: '',
    receitaBrutaPrevista: '',
    resultadoObtido: '',
    resultadoPrevisto: '',
    pecuariaCompativel: 'naoSeAplica',
    justifique: '',
    garantias: '',
    recursosLiquidos: '',
    patrimonioTotal: '',
    endividamentoSFN: '',
    endividamentoBB: '',
    inadAgroAgencia: '',
    propostaCustomizada: 'naoSeAplica',
    percentualGarantiaHipotecaria: '',
    rendeFacil: 'naoSeAplica'
  });

  const [shareBB, setShareBB] = useState('0,00');

  // Calcular Share BB automaticamente
  useEffect(() => {
    const sfn = parseFloat(formData.endividamentoSFN.replace(/\./g, '').replace(',', '.')) || 0;
    const bb = parseFloat(formData.endividamentoBB.replace(/\./g, '').replace(',', '.')) || 0;
    if (sfn > 0) {
      const share = (bb / sfn) * 100;
      setShareBB(share.toFixed(2).replace('.', ','));
    } else {
      setShareBB('0,00');
    }
  }, [formData.endividamentoSFN, formData.endividamentoBB]);

  // Formatar moeda BRL
  const formatCurrency = (value) => {
    const num = value.replace(/\D/g, '');
    const formatted = (parseFloat(num) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatted;
  };

  const handleMoneyChange = (field, value) => {
    const formatted = formatCurrency(value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    // Mock save - será implementado com backend
    toast({
      title: "Dados salvos",
      description: "Operação salva com sucesso!"
    });
  };

  const handleExportPNG = async () => {
    setPreviewMode(true);
    setTimeout(async () => {
      const element = document.getElementById('export-container');
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#e8f7ff',
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `analise-operacao-${formData.proposta || 'sem-proposta'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      setPreviewMode(false);
      toast({
        title: "Exportação concluída",
        description: "Imagem PNG salva com sucesso!"
      });
    }, 100);
  };

  const moneyFields = [
    'valorOperacao', 'rsContratado', 'receitaBrutaClientes', 'receitaBrutaObtida',
    'receitaBrutaPrevista', 'resultadoObtido', 'resultadoPrevisto', 'recursosLiquidos',
    'patrimonioTotal', 'endividamentoSFN', 'endividamentoBB', 'inadAgroAgencia'
  ];

  const renderField = (label, field, type = 'text') => {
    if (type === 'money') {
      return (
        <div className="space-y-2">
          <Label className="text-xl font-medium text-gray-800">{label}</Label>
          {previewMode ? (
            <div className="text-2xl font-semibold text-gray-900 bg-white px-4 py-3 rounded-lg border-2 border-gray-200">
              R$ {formData[field] || '0,00'}
            </div>
          ) : (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-gray-600">R$</span>
              <Input
                value={formData[field]}
                onChange={(e) => handleMoneyChange(field, e.target.value)}
                className="text-2xl font-semibold pl-14 py-6 h-auto"
                placeholder="0,00"
              />
            </div>
          )}
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className="space-y-2">
          <Label className="text-xl font-medium text-gray-800">{label}</Label>
          {previewMode ? (
            <div className="text-xl text-gray-900 bg-white px-4 py-3 rounded-lg border-2 border-gray-200 min-h-[80px] whitespace-pre-wrap">
              {formData[field] || '-'}
            </div>
          ) : (
            <Textarea
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="text-xl min-h-[80px] resize-none"
            />
          )}
        </div>
      );
    }

    if (type === 'select') {
      return (
        <div className="space-y-2">
          <Label className="text-xl font-medium text-gray-800">{label}</Label>
          {previewMode ? (
            <div className="text-2xl font-semibold text-gray-900 bg-white px-4 py-3 rounded-lg border-2 border-gray-200">
              {formData[field] === 'sim' ? 'Sim' : formData[field] === 'nao' ? 'Não' : 'Não se aplica'}
            </div>
          ) : (
            <Select value={formData[field]} onValueChange={(value) => handleChange(field, value)}>
              <SelectTrigger className="text-2xl font-semibold py-6 h-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim" className="text-xl">Sim</SelectItem>
                <SelectItem value="nao" className="text-xl">Não</SelectItem>
                <SelectItem value="naoSeAplica" className="text-xl">Não se aplica</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      );
    }

    if (type === 'date') {
      return (
        <div className="space-y-2">
          <Label className="text-xl font-medium text-gray-800">{label}</Label>
          {previewMode ? (
            <div className="text-2xl font-semibold text-gray-900 bg-white px-4 py-3 rounded-lg border-2 border-gray-200">
              {formData[field] || '-'}
            </div>
          ) : (
            <Input
              type="date"
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="text-2xl font-semibold py-6 h-auto"
            />
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label className="text-xl font-medium text-gray-800">{label}</Label>
        {previewMode ? (
          <div className="text-2xl font-semibold text-gray-900 bg-white px-4 py-3 rounded-lg border-2 border-gray-200">
            {formData[field] || '-'}
          </div>
        ) : (
          <Input
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="text-2xl font-semibold py-6 h-auto"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8f7ff' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003399] to-[#0055cc] shadow-lg">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://logodownload.org/wp-content/uploads/2014/05/banco-do-brasil-logo-1.png" 
              alt="Banco do Brasil" 
              className="h-16 bg-white rounded-lg px-3 py-2"
            />
            <h1 className="text-4xl font-bold text-white">SUPER BARREIRAS</h1>
            <span className="text-2xl text-yellow-300 font-semibold">Análise de Operações</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              className="text-lg px-6 py-6 h-auto bg-white hover:bg-gray-100"
            >
              <Eye className="mr-2 h-5 w-5" />
              {previewMode ? 'Modo Edição' : 'Pré-visualizar'}
            </Button>
            <Button
              onClick={handleSave}
              className="text-lg px-6 py-6 h-auto bg-[#FFCC00] text-gray-900 hover:bg-[#FFD700] font-bold"
            >
              <Save className="mr-2 h-5 w-5" />
              Salvar
            </Button>
            <Button
              onClick={handleExportPNG}
              className="text-lg px-6 py-6 h-auto bg-white text-[#003399] hover:bg-gray-100 font-bold"
            >
              <Download className="mr-2 h-5 w-5" />
              Exportar PNG
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="export-container" className="max-w-[1600px] mx-auto p-6">
        {/* Campos do topo */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 grid grid-cols-2 gap-6">
          {renderField('Prefixo', 'prefixo')}
          {renderField('Agência', 'agencia')}
        </div>

        {/* Grid 2x2 dos 4 cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Card 1 - Dados Básicos (Amarelo BB) */}
          <div className="rounded-xl shadow-xl p-6 space-y-4" style={{ backgroundColor: '#FFFBEA' }}>
            <h2 className="text-3xl font-bold text-[#003399] mb-6 pb-3 border-b-4 border-[#FFCC00]">Dados Básicos</h2>
            {renderField('Alçada', 'alcada')}
            {renderField('MCI', 'mci')}
            {renderField('Cliente', 'cliente')}
            {renderField('Idade do Cliente', 'idadeCliente')}
            {renderField('Cliente desde', 'clienteDesde', 'date')}
            {renderField('Proposta', 'proposta')}
            {renderField('Linha de Crédito', 'linhaCredito')}
            {renderField('Item Financiado', 'itemFinanciado')}
            {renderField('Rating', 'rating')}
          </div>

          {/* Card 2 - Operação (Azul BB) */}
          <div className="rounded-xl shadow-xl p-6 space-y-4" style={{ backgroundColor: '#E6ECFF' }}>
            <h2 className="text-3xl font-bold text-[#003399] mb-6 pb-3 border-b-4 border-[#FFCC00]">Operação e Seguros</h2>
            {renderField('Autorização Grão', 'autorizacaoGrao', 'textarea')}
            {renderField('Valor Operação', 'valorOperacao', 'money')}
            {renderField('Seguros (Quais?)', 'seguros')}
            {renderField('RS contratado na operação', 'rsContratado', 'money')}
            {renderField('Limite de Crédito (Vigência e Risco)', 'limiteCredito')}
            {renderField('Condicionante do LC (Qual?)', 'condicionanteLC')}
          </div>

          {/* Card 3 - Receitas (Cinza claro) */}
          <div className="rounded-xl shadow-xl p-6 space-y-4" style={{ backgroundColor: '#F5F5F5' }}>
            <h2 className="text-3xl font-bold text-[#003399] mb-6 pb-3 border-b-4 border-[#FFCC00]">Receitas e Garantias</h2>
            {renderField('Receita bruta - Clientes 03-20-41 Selecionar LC, F12-6-F9', 'receitaBrutaClientes', 'money')}
            {renderField('Receita Bruta Total Obtida', 'receitaBrutaObtida', 'money')}
            {renderField('Receita Bruta Total Prevista', 'receitaBrutaPrevista', 'money')}
            {renderField('Resultado Operacional Agropecuário Obtido', 'resultadoObtido', 'money')}
            {renderField('Resultado Operacional Agropecuário Previsto', 'resultadoPrevisto', 'money')}
            {renderField('Pecuária: Quantidade de animais compatível com área do cliente?', 'pecuariaCompativel', 'select')}
            {renderField('Justifique', 'justifique', 'textarea')}
            {renderField('Garantias', 'garantias')}
          </div>

          {/* Card 4 - Financeiro (Branco com degradê) */}
          <div className="rounded-xl shadow-xl p-6 space-y-4 bg-gradient-to-br from-white to-gray-50">
            <h2 className="text-3xl font-bold text-[#003399] mb-6 pb-3 border-b-4 border-[#FFCC00]">Dados Financeiros</h2>
            
            {/* Share BB - Campo calculado */}
            <div className="space-y-2 bg-yellow-50 p-4 rounded-lg border-2 border-[#FFCC00]">
              <Label className="text-xl font-medium text-gray-800">Share BB (calculado automaticamente)</Label>
              <div className="text-3xl font-bold text-[#003399]">
                {shareBB}%
              </div>
              <p className="text-sm text-gray-600 italic">Endividamento BB ÷ Endividamento SFN</p>
            </div>
            
            {renderField('Recursos líquidos', 'recursosLiquidos', 'money')}
            {renderField('Patrimônio Total', 'patrimonioTotal', 'money')}
            {renderField('Endividamento no SFN', 'endividamentoSFN', 'money')}
            {renderField('Endividamento no BB', 'endividamentoBB', 'money')}
            {renderField('Inad Agro Agência (rel 5398)', 'inadAgroAgencia', 'money')}
            {renderField('Proposta Customizada', 'propostaCustomizada', 'select')}
            {renderField('% de operações do cliente Com garantia Hipotecária', 'percentualGarantiaHipotecaria')}
            {renderField('Rende Fácil', 'rendeFacil', 'select')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperBarreiras;