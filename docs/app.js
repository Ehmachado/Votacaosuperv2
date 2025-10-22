// Estado global
let previewMode = false;
let currentOperationId = null;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadOperationsList();
});

// Formatação de moeda
function formatMoney(input) {
    let value = input.value.replace(/\D/g, '');
    if (value === '') {
        input.value = '';
        return;
    }
    const number = parseFloat(value) / 100;
    input.value = number.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Calcular Share BB
function calculateShareBB() {
    const sfnValue = document.getElementById('endividamentoSFN').value;
    const bbValue = document.getElementById('endividamentoBB').value;
    
    const sfn = parseFloat(sfnValue.replace(/\./g, '').replace(',', '.')) || 0;
    const bb = parseFloat(bbValue.replace(/\./g, '').replace(',', '.')) || 0;
    
    let share = 0;
    if (sfn > 0) {
        share = (bb / sfn) * 100;
    }
    
    document.getElementById('shareBB').textContent = share.toFixed(2).replace('.', ',') + '%';
}

// Toggle Preview
function togglePreview() {
    previewMode = !previewMode;
    const container = document.getElementById('exportContainer');
    const btn = document.getElementById('btnPreview');
    
    if (previewMode) {
        container.classList.add('preview-mode');
        btn.textContent = '✏ Edição';
    } else {
        container.classList.remove('preview-mode');
        btn.textContent = '👁 Preview';
    }
}

// Toggle Lista
function toggleList() {
    const list = document.getElementById('listContainer');
    const btn = document.getElementById('btnList');
    
    if (list.style.display === 'none') {
        list.style.display = 'block';
        btn.textContent = '✖ Ocultar';
        loadOperationsList();
    } else {
        list.style.display = 'none';
        btn.textContent = '📋 Listar';
    }
}

// Nova Operação
function newOperation() {
    currentOperationId = null;
    document.querySelectorAll('input, textarea, select').forEach(el => {
        if (el.type === 'select-one') {
            el.selectedIndex = 0;
        } else {
            el.value = '';
        }
    });
    document.getElementById('shareBB').textContent = '0,00%';
    document.getElementById('listContainer').style.display = 'none';
    alert('Formulário limpo para nova operação');
}

// Salvar Operação
function saveOperation() {
    const data = {
        id: currentOperationId || generateId(),
        timestamp: new Date().toISOString(),
        prefixo: document.getElementById('prefixo').value,
        agencia: document.getElementById('agencia').value,
        valorOperacao: document.getElementById('valorOperacao').value,
        mci: document.getElementById('mci').value,
        cliente: document.getElementById('cliente').value,
        idadeCliente: document.getElementById('idadeCliente').value,
        clienteDesde: document.getElementById('clienteDesde').value,
        proposta: document.getElementById('proposta').value,
        linhaCredito: document.getElementById('linhaCredito').value,
        itemFinanciado: document.getElementById('itemFinanciado').value,
        rating: document.getElementById('rating').value,
        garantias: document.getElementById('garantias').value,
        pecuariaCompativel: document.getElementById('pecuariaCompativel').value,
        justifique: document.getElementById('justifique').value,
        limiteCreditoVigencia: document.getElementById('limiteCreditoVigencia').value,
        limiteCreditoRisco: document.getElementById('limiteCreditoRisco').value,
        condicionanteLC: document.getElementById('condicionanteLC').value,
        seguros: document.getElementById('seguros').value,
        rsContratado: document.getElementById('rsContratado').value,
        receitaBrutaObtida: document.getElementById('receitaBrutaObtida').value,
        receitaBrutaPrevista: document.getElementById('receitaBrutaPrevista').value,
        resultadoObtido: document.getElementById('resultadoObtido').value,
        resultadoPrevisto: document.getElementById('resultadoPrevisto').value,
        recursosLiquidos: document.getElementById('recursosLiquidos').value,
        patrimonioTotal: document.getElementById('patrimonioTotal').value,
        endividamentoSFN: document.getElementById('endividamentoSFN').value,
        endividamentoBB: document.getElementById('endividamentoBB').value,
        inadAgroAgencia: document.getElementById('inadAgroAgencia').value,
        propostaCustomizada: document.getElementById('propostaCustomizada').value,
        percentualGarantiaHipotecaria: document.getElementById('percentualGarantiaHipotecaria').value,
        rendeFacil: document.getElementById('rendeFacil').value,
        shareBB: document.getElementById('shareBB').textContent
    };
    
    // Salvar no localStorage
    let operations = JSON.parse(localStorage.getItem('operations') || '[]');
    const index = operations.findIndex(op => op.id === data.id);
    
    if (index >= 0) {
        operations[index] = data;
    } else {
        operations.push(data);
    }
    
    localStorage.setItem('operations', JSON.stringify(operations));
    currentOperationId = data.id;
    
    alert('Operação salva com sucesso!');
    loadOperationsList();
}

// Carregar lista de operações
function loadOperationsList() {
    const operations = JSON.parse(localStorage.getItem('operations') || '[]');
    const container = document.getElementById('operationsList');
    
    if (operations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 32px;">Nenhuma operação salva</p>';
        return;
    }
    
    container.innerHTML = operations.map(op => `
        <div class="operation-item">
            <div class="operation-info">
                <h3>${op.proposta || 'Sem proposta'} - ${op.cliente || 'Sem cliente'}</h3>
                <p>Agência: ${op.agencia || '-'} | Criado em: ${new Date(op.timestamp).toLocaleDateString('pt-BR')}</p>
            </div>
            <div class="operation-actions">
                <button onclick="loadOperation('${op.id}')" class="btn btn-white btn-small">✏ Carregar</button>
                <button onclick="deleteOperation('${op.id}')" class="btn btn-danger btn-small">🗑</button>
            </div>
        </div>
    `).join('');
}

// Carregar operação
function loadOperation(id) {
    const operations = JSON.parse(localStorage.getItem('operations') || '[]');
    const operation = operations.find(op => op.id === id);
    
    if (!operation) return;
    
    currentOperationId = id;
    
    // Preencher campos
    Object.keys(operation).forEach(key => {
        const el = document.getElementById(key);
        if (el && key !== 'id' && key !== 'timestamp' && key !== 'shareBB') {
            el.value = operation[key] || '';
        }
    });
    
    document.getElementById('shareBB').textContent = operation.shareBB || '0,00%';
    document.getElementById('listContainer').style.display = 'none';
    alert('Operação carregada!');
}

// Deletar operação
function deleteOperation(id) {
    if (!confirm('Tem certeza que deseja deletar esta operação?')) return;
    
    let operations = JSON.parse(localStorage.getItem('operations') || '[]');
    operations = operations.filter(op => op.id !== id);
    localStorage.setItem('operations', JSON.stringify(operations));
    
    if (currentOperationId === id) {
        newOperation();
    }
    
    loadOperationsList();
    alert('Operação deletada!');
}

// Exportar PNG
function exportToPNG() {
    const wasPreview = previewMode;
    if (!wasPreview) {
        togglePreview();
    }
    
    setTimeout(() => {

        // --- LOCK CAPTURE AREA to current container box ---
        (function(){
            const el = document.getElementById('exportContainer');
            if (!el) return;
            const rect = el.getBoundingClientRect();
            window.__exportLock = {
                prevHeight: el.style.height,
                prevAspect: el.style.aspectRatio
            };
            el.style.height = rect.height + 'px';
            el.style.aspectRatio = 'unset';
        })();
        // --- END LOCK ---

        // --- PRINT CLONES for multi-line textareas (single functional change) ---
        (function() {
            const ids = ['justifique', 'condicionanteLC'];
            window.__printClones = [];
            ids.forEach((id)=>{
                const ta = document.getElementById(id);
                if(!ta) return;
                // compute width to match layout
                const cs = window.getComputedStyle(ta);
                const clone = document.createElement('div');
                clone.setAttribute('data-print-clone-for', id);
                // copy basic text styles to match rendering
                clone.style.fontFamily = cs.fontFamily;
                clone.style.fontSize = cs.fontSize;
                clone.style.lineHeight = cs.lineHeight;
                clone.style.padding = cs.padding;
                clone.style.border = cs.border;
                clone.style.borderRadius = cs.borderRadius;
                clone.style.boxSizing = cs.boxSizing;
                clone.style.background = cs.backgroundColor;
                clone.style.color = cs.color;
                clone.style.width = ta.offsetWidth + 'px';
                clone.style.minHeight = '0px';
                clone.style.whiteSpace = 'pre-wrap';
                clone.style.wordBreak = 'break-word';
                clone.style.overflow = 'visible';
                clone.style.display = 'block';
                clone.style.margin = cs.margin;
                
                // set text content with line breaks
                clone.textContent = ta.value;
                
                // Insert clone right after textarea and hide original
                ta.style.display = 'none';
                ta.insertAdjacentElement('afterend', clone);
                window.__printClones.push({ id, ta, clone, displayBackup: '' });
            });
        })();
        // --- END PRINT CLONES ---


    // --- Auto-expand textareas to fit content before capture (single change) ---
    (function() {
        const idsToExpand = ['justifique','condicionanteLC'];
        window.__prevHeights = {};
        idsToExpand.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                window.__prevHeights[id] = el.style.height;
                el.style.height = 'auto';
                el.style.overflow = 'visible';
                el.style.whiteSpace = 'pre-wrap';
                el.style.height = el.scrollHeight + 'px';
            }
        });
    })();
    // --- end single change ---
        html2canvas(document.getElementById('exportContainer'), { foreignObjectRendering: true,
            scale: 2,
            backgroundColor: '#e8f7ff',
            logging: false
        }).then(canvas => {
            const link = document.createElement('a');
            const proposta = document.getElementById('proposta').value || 'sem-proposta';
            link.download = `analise-operacao-${proposta}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            if (!wasPreview) {
                togglePreview();
            }
            
            
            // --- RESTORE after capture ---
            (function(){
                if (window.__printClones) {
                    window.__printClones.forEach(({ta, clone})=>{
                        if (clone && clone.parentNode) clone.parentNode.removeChild(clone);
                        if (ta) ta.style.display = '';
                    });
                    window.__printClones = null;
                }
            })();

            
            // restore locked container dimensions
            (function(){
                const el = document.getElementById('exportContainer');
                if (el && window.__exportLock){
                    el.style.height = window.__exportLock.prevHeight || '';
                    el.style.aspectRatio = window.__exportLock.prevAspect || '';
                    window.__exportLock = null;
                }
            })();

            alert('Imagem PNG exportada com sucesso!');
        });
    }, 100);
}

// Gerar ID único
function generateId() {
    return 'op_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}