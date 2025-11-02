import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Save, Download, Eye, List, Plus, Trash2, Edit } from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from '../hooks/use-toast';
import { operacoesService } from '../services/api';
import '../styles/super-barreiras.css';

const SuperBarreiras = () => {
  const [previewMode, setPreviewMode] = useState(false);
  const [showList, setShowList] = useState(false);
  const [operacoes, setOperacoes] = useState([]);
  const [currentOperacaoId, setCurrentOperacaoId] = useState(null);
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
    limiteCreditoVigencia: '',
    limiteCreditoRisco: '',
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

  // Carregar operações ao montar
  useEffect(() => {
    loadOperacoes();
  }, []);

  const loadOperacoes = async () => {
    try {
      const data = await operacoesService.getAll();
      setOperacoes(data);
    } catch (error) {
      console.error('Erro ao carregar operações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar operações",
        variant: "destructive"
      });
    }
  };

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

  const handleNew = () => {
    setFormData({
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
      limiteCreditoVigencia: '',
      limiteCreditoRisco: '',
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
    setCurrentOperacaoId(null);
    setShowList(false);
  };

  const handleLoad = async (operacao) => {
    setFormData({
      prefixo: operacao.prefixo || '',
      agencia: operacao.agencia || '',
      alcada: operacao.alcada || '',
      mci: operacao.mci || '',
      cliente: operacao.cliente || '',
      idadeCliente: operacao.idadeCliente || '',
      clienteDesde: operacao.clienteDesde || '',
      proposta: operacao.proposta || '',
      linhaCredito: operacao.linhaCredito || '',
      itemFinanciado: operacao.itemFinanciado || '',
      rating: operacao.rating || '',
      autorizacaoGrao: operacao.autorizacaoGrao || '',
      valorOperacao: operacao.valorOperacao || '',
      seguros: operacao.seguros || '',
      rsContratado: operacao.rsContratado || '',
      limiteCredito: operacao.limiteCredito || '',
      limiteCreditoVigencia: operacao.limiteCreditoVigencia || '',
      limiteCreditoRisco: operacao.limiteCreditoRisco || '',
      condicionanteLC: operacao.condicionanteLC || '',
      receitaBrutaClientes: operacao.receitaBrutaClientes || '',
      receitaBrutaObtida: operacao.receitaBrutaObtida || '',
      receitaBrutaPrevista: operacao.receitaBrutaPrevista || '',
      resultadoObtido: operacao.resultadoObtido || '',
      resultadoPrevisto: operacao.resultadoPrevisto || '',
      pecuariaCompativel: operacao.pecuariaCompativel || 'naoSeAplica',
      justifique: operacao.justifique || '',
      garantias: operacao.garantias || '',
      recursosLiquidos: operacao.recursosLiquidos || '',
      patrimonioTotal: operacao.patrimonioTotal || '',
      endividamentoSFN: operacao.endividamentoSFN || '',
      endividamentoBB: operacao.endividamentoBB || '',
      inadAgroAgencia: operacao.inadAgroAgencia || '',
      propostaCustomizada: operacao.propostaCustomizada || 'naoSeAplica',
      percentualGarantiaHipotecaria: operacao.percentualGarantiaHipotecaria || '',
      rendeFacil: operacao.rendeFacil || 'naoSeAplica'
    });
    setCurrentOperacaoId(operacao.id);
    setShowList(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta operação?')) {
      try {
        await operacoesService.delete(id);
        toast({
          title: "Sucesso",
          description: "Operação deletada com sucesso!"
        });
        loadOperacoes();
        if (currentOperacaoId === id) {
          handleNew();
        }
      } catch (error) {
        console.error('Erro ao deletar:', error);
        toast({
          title: "Erro",
          description: "Erro ao deletar operação",
          variant: "destructive"
        });
      }
    }
  };

  const handleSave = async () => {
    try {
      const dataToSave = { ...formData, shareBB };
      
      if (currentOperacaoId) {
        // Atualizar existente
        await operacoesService.update(currentOperacaoId, dataToSave);
        toast({
          title: "Sucesso",
          description: "Operação atualizada com sucesso!"
        });
      } else {
        // Criar nova
        const newOperacao = await operacoesService.create(dataToSave);
        setCurrentOperacaoId(newOperacao.id);
        toast({
          title: "Sucesso",
          description: "Operação salva com sucesso!"
        });
      }
      
      loadOperacoes();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar operação",
        variant: "destructive"
      });
    }
  };

  const handleExportPNG = async () => {
    setPreviewMode(true);
    setTimeout(async () => {
      const element = document.getElementById('export-container');
      
      // Adiciona classe para exportação
      element.classList.add('super-barreiras');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#e8f7ff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('export-container');
          if (clonedElement) {
            // Garante que os estilos sejam aplicados no clone
            clonedElement.style.width = `${element.offsetWidth}px`;
            clonedElement.style.height = `${element.offsetHeight}px`;
          }
        }
      });
      
      // Remove classe de exportação
      element.classList.remove('super-barreiras');
      
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

  const renderField = (label, field, type = 'text') => {
    if (type === 'money') {
      return (
        <div className="space-y-1.5">
          <Label className="text-base font-semibold text-white">{label}</Label>
          {previewMode ? (
            <div className="text-lg font-semibold text-gray-900 bg-white px-3 py-2.5 rounded border border-gray-300">
              R$ {formData[field] || '0,00'}
            </div>
          ) : (
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-600">R$</span>
              <Input
                value={formData[field]}
                onChange={(e) => handleMoneyChange(field, e.target.value)}
                className="text-lg font-semibold pl-12 py-2.5 h-auto bg-white"
                placeholder="0,00"
              />
            </div>
          )}
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div className="space-y-1.5">
          <Label className="text-base font-semibold text-white">{label}</Label>
          {previewMode ? (
            <div className="text-base text-gray-900 bg-white px-3 py-2.5 rounded border border-gray-300 min-h-[65px] whitespace-pre-wrap">
              {formData[field] || '-'}
            </div>
          ) : (
            <Textarea
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="text-base min-h-[65px] resize-none bg-white py-2.5"
            />
          )}
        </div>
      );
    }

    if (type === 'select') {
      return (
        <div className="space-y-1.5">
          <Label className="text-base font-semibold text-white">{label}</Label>
          {previewMode ? (
            <div className="text-lg font-semibold text-gray-900 bg-white px-3 py-2.5 rounded border border-gray-300">
              {formData[field] === 'sim' ? 'Sim' : formData[field] === 'nao' ? 'Não' : 'Não se aplica'}
            </div>
          ) : (
            <Select value={formData[field]} onValueChange={(value) => handleChange(field, value)}>
              <SelectTrigger className="text-lg font-semibold py-2.5 h-auto bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim" className="text-lg">Sim</SelectItem>
                <SelectItem value="nao" className="text-lg">Não</SelectItem>
                <SelectItem value="naoSeAplica" className="text-lg">Não se aplica</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      );
    }

    if (type === 'date') {
      return (
        <div className="space-y-1.5">
          <Label className="text-base font-semibold text-white">{label}</Label>
          {previewMode ? (
            <div className="text-lg font-semibold text-gray-900 bg-white px-3 py-2.5 rounded border border-gray-300">
              {formData[field] || '-'}
            </div>
          ) : (
            <Input
              type="date"
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="text-lg font-semibold py-2.5 h-auto bg-white"
            />
          )}
        </div>
      );
    }

    return (
      <div className="space-y-1.5">
        <Label className="text-base font-semibold text-white">{label}</Label>
        {previewMode ? (
          <div className="text-lg font-semibold text-gray-900 bg-white px-3 py-2.5 rounded border border-gray-300">
            {formData[field] || '-'}
          </div>
        ) : (
          <Input
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="text-lg font-semibold py-2.5 h-auto bg-white"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e8f7ff' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#003399] to-[#0055cc] shadow-lg">
        <div className="mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img 
                src="https://logodownload.org/wp-content/uploads/2014/05/banco-do-brasil-logo-1.png" 
                alt="Banco do Brasil" 
                className="h-12 bg-white rounded px-2 py-1"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">SUPER BARREIRAS</h1>
                <span className="text-sm text-yellow-300 font-semibold">Análise de Operações</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setShowList(!showList)}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100 text-sm px-3 py-2"
            >
              <List className="mr-1 h-4 w-4" />
              {showList ? 'Ocultar' : 'Listar'}
            </Button>
            <Button
              onClick={handleNew}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100 text-sm px-3 py-2"
            >
              <Plus className="mr-1 h-4 w-4" />
              Nova
            </Button>
            <Button
              onClick={() => setPreviewMode(!previewMode)}
              variant="outline"
              size="sm"
              className="bg-white hover:bg-gray-100 text-sm px-3 py-2"
            >
              <Eye className="mr-1 h-4 w-4" />
              {previewMode ? 'Edição' : 'Preview'}
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-[#FFCC00] text-gray-900 hover:bg-[#FFD700] font-bold text-sm px-3 py-2"
            >
              <Save className="mr-1 h-4 w-4" />
              Salvar
            </Button>
            <Button
              onClick={handleExportPNG}
              size="sm"
              className="bg-white text-[#003399] hover:bg-gray-100 font-bold text-sm px-3 py-2"
            >
              <Download className="mr-1 h-4 w-4" />
              Exportar PNG
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Operações */}
      {showList && (
        <div className="mx-auto p-4" style={{ maxWidth: '1400px' }}>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-2xl font-bold text-[#003399] mb-4">Operações Salvas</h2>
            <div className="space-y-2">
              {operacoes.length === 0 ? (
                <p className="text-lg text-gray-600 text-center py-4">Nenhuma operação salva</p>
              ) : (
                operacoes.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="text-base font-bold text-gray-900">
                        {op.proposta || 'Sem proposta'} - {op.cliente || 'Sem cliente'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Agência: {op.agencia || '-'} | Criado em: {new Date(op.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleLoad(op)}
                        variant="outline"
                        size="sm"
                        className="text-sm px-3 py-1"
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        Carregar
                      </Button>
                      <Button
                        onClick={() => handleDelete(op.id)}
                        variant="destructive"
                        size="sm"
                        className="text-sm px-3 py-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div id="export-container" className="mx-auto p-3" style={{ maxWidth: '1200px', aspectRatio: '3 / 3.5' }}>
        {/* Título para exportação */}
        <div className="text-center mb-3 py-2 bg-gradient-to-r from-[#003399] to-[#0055cc] rounded-lg">
          <h2 className="text-xl font-bold text-white tracking-wide">ANÁLISE DE OPERAÇÕES SUPER BARREIRAS</h2>
        </div>

        {/* Campos do topo */}
        <div className="rounded-lg shadow-md p-3 mb-3 grid grid-cols-2 gap-3" style={{ backgroundColor: '#D4AF37' }}>
          <div className="space-y-1.5">
            <Label className="text-base font-bold text-gray-900">Prefixo</Label>
            {previewMode ? (
              <div className="text-lg font-semibold text-gray-900 bg-white px-3 py-2.5 rounded border border-gray-300">
                {formData.prefixo || '-'}
              </div>
            ) : (
              <Input
                value={formData.prefixo}
                onChange={(e) => handleChange('prefixo', e.target.value)}
                className="text-lg font-semibold py-2.5 h-auto bg-white"
              />
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-base font-bold text-gray-900">Agência</Label>
            {previewMode ? (
              <div className="text-lg font-semibold text-gray-900 bg-white px-3 py-2.5 rounded border border-gray-300">
                {formData.agencia || '-'}
              </div>
            ) : (
              <Input
                value={formData.agencia}
                onChange={(e) => handleChange('agencia', e.target.value)}
                className="text-lg font-semibold py-2.5 h-auto bg-white"
              />
            )}
          </div>
        </div>

        {/* Grid 2x2 dos 4 cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1 - Dados Básicos (Amarelo BB) */}
          <div className="rounded-lg shadow-lg p-3 space-y-2" style={{ backgroundColor: '#B8860B' }}>
            <h2 className="text-xl font-bold text-white mb-2 pb-1 border-b-2 border-[#FFCC00]">Dados Básicos</h2>
            {renderField('Valor da Operação', 'valorOperacao', 'money')}
            {renderField('MCI', 'mci')}
            {renderField('Cliente', 'cliente')}
            {renderField('Idade do Cliente', 'idadeCliente')}
            {renderField('Cliente desde', 'clienteDesde', 'date')}
            {renderField('Proposta', 'proposta')}
            {renderField('Linha de Crédito', 'linhaCredito')}
            {renderField('Item Financiado', 'itemFinanciado')}
            {renderField('Rating', 'rating')}
          </div>

          {/* Card 2 - Garantias Seguros e LC (Azul BB) */}
          <div className="rounded-lg shadow-lg p-3 space-y-2" style={{ backgroundColor: '#003399' }}>
            <h2 className="text-xl font-bold text-white mb-2 pb-1 border-b-2 border-[#FFCC00]">Garantias Seguros e LC</h2>
            {renderField('Garantias', 'garantias')}
            {renderField('Pecuária: Quantidade de animais compatível com área do cliente?', 'pecuariaCompativel', 'select')}
            {renderField('Justifique', 'justifique', 'textarea')}
            
            {/* Limite de Crédito - Vigência e Risco */}
            <div className="space-y-1.5">
              <Label className="text-base font-semibold text-white">Limite de Crédito (Vigência e Risco)</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select value={formData.limiteCreditoVigencia} onValueChange={(value) => handleChange('limiteCreditoVigencia', value)}>
                  <SelectTrigger className="text-lg font-semibold py-2.5 h-auto bg-white">
                    <SelectValue placeholder="Sim/Não" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim" className="text-lg">Sim</SelectItem>
                    <SelectItem value="nao" className="text-lg">Não</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={formData.limiteCreditoRisco} onValueChange={(value) => handleChange('limiteCreditoRisco', value)}>
                  <SelectTrigger className="text-lg font-semibold py-2.5 h-auto bg-white">
                    <SelectValue placeholder="A-D" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A" className="text-lg">A</SelectItem>
                    <SelectItem value="B" className="text-lg">B</SelectItem>
                    <SelectItem value="C" className="text-lg">C</SelectItem>
                    <SelectItem value="D" className="text-lg">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {renderField('Condicionante do LC (Qual?)', 'condicionanteLC', 'textarea')}
            {renderField('Seguros (Quais?)', 'seguros')}
            {renderField('RS contratado na operação', 'rsContratado', 'money')}
          </div>

          {/* Card 3 - Receitas (Cinza escuro) */}
          <div className="rounded-lg shadow-lg p-3 space-y-2" style={{ backgroundColor: '#4A5568' }}>
            <h2 className="text-xl font-bold text-white mb-2 pb-1 border-b-2 border-[#FFCC00]">Receitas</h2>
            
            {/* Subtítulo - não editável */}
            <div className="bg-gray-700 p-2 rounded">
              <p className="text-xs font-bold text-yellow-300 italic">Clientes 03-20-41 Selecionar LC, F12-6-F9</p>
            </div>
            
            {renderField('Receita Bruta Total Obtida', 'receitaBrutaObtida', 'money')}
            {renderField('Receita Bruta Total Prevista', 'receitaBrutaPrevista', 'money')}
            {renderField('Resultado Operacional Agropecuário Obtido', 'resultadoObtido', 'money')}
            {renderField('Resultado Operacional Agropecuário Previsto', 'resultadoPrevisto', 'money')}
            {renderField('Recursos líquidos', 'recursosLiquidos', 'money')}
            {renderField('Patrimônio Total', 'patrimonioTotal', 'money')}
          </div>

          {/* Card 4 - Financeiro (Verde escuro) */}
          <div className="rounded-lg shadow-lg p-3 space-y-2" style={{ backgroundColor: '#2F855A' }}>
            <h2 className="text-xl font-bold text-white mb-2 pb-1 border-b-2 border-[#FFCC00]">Dados Financeiros</h2>
            
            {/* Share BB - Campo calculado */}
            <div className="space-y-1 bg-yellow-100 p-2 rounded-lg border-2 border-[#FFCC00]">
              <Label className="text-sm font-medium text-gray-800">Share BB (calculado automaticamente)</Label>
              <div className="text-2xl font-bold text-[#003399]">
                {shareBB}%
              </div>
              <p className="text-xs text-gray-600 italic">Endividamento BB ÷ Endividamento SFN</p>
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