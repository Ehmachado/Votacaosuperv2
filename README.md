# SUPER BARREIRAS - Análise de Operações

## Deploy no GitHub Pages

### Passo 1: Configurar o Repositório

1. Crie um novo repositório no GitHub
2. Faça commit e push da pasta `/docs` para o repositório:

```bash
git init
git add docs/
git commit -m "Deploy SUPER BARREIRAS para GitHub Pages"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

### Passo 2: Habilitar GitHub Pages

1. Acesse as **Settings** do repositório
2. No menu lateral, clique em **Pages**
3. Em **Source**, selecione:
   - Branch: `main`
   - Folder: `/docs`
4. Clique em **Save**

### Passo 3: Acessar o App

Após alguns minutos, seu app estará disponível em:
```
https://SEU-USUARIO.github.io/SEU-REPO/
```

## Características

- ✅ Layout 3x3.5 otimizado para exportação PNG
- ✅ 4 cards coloridos (Amarelo BB, Azul BB, Cinza, Verde)
- ✅ Todos os campos solicitados implementados
- ✅ Cálculo automático do Share BB
- ✅ Formatação BRL para campos monetários
- ✅ Persistência de dados com localStorage
- ✅ Exportação PNG em alta qualidade
- ✅ 100% estático - funciona sem backend

## Funcionalidades

1. **Salvar Operação**: Dados salvos no navegador (localStorage)
2. **Listar Operações**: Ver todas as operações salvas
3. **Carregar Operação**: Editar operações existentes
4. **Nova Operação**: Limpar formulário
5. **Preview**: Visualizar sem edição
6. **Exportar PNG**: Download da análise em imagem

## Tecnologias

- HTML5
- CSS3
- JavaScript (Vanilla)
- html2canvas (para exportação PNG)
- localStorage (persistência de dados)

## Observações

- Os dados são salvos apenas no navegador local (localStorage)
- Não requer backend ou banco de dados
- Funciona offline após o primeiro carregamento
- Compatível com todos os navegadores modernos