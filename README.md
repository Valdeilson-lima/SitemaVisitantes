# Sistema de Gestão de Visitantes

Sistema desenvolvido para gerenciar e acompanhar visitantes em igrejas, facilitando o processo de cadastro, acompanhamento e comunicação.

## 🚀 Funcionalidades

- **Cadastro de Visitantes**: Registro completo de novos visitantes
- **Gestão de Visitantes**: Visualização e gerenciamento de todos os visitantes cadastrados
- **Sistema de Avisos**: Comunicação interna através de avisos importantes
- **Controle de Acesso**: Sistema de login para diferentes níveis de acesso
- **Logs de Atividades**: Registro de todas as ações realizadas no sistema

## 🛠️ Tecnologias Utilizadas

- React.js
- React Router DOM
- Firebase (Autenticação e Banco de Dados)
- React Icons
- CSS3

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no Firebase

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as configurações do Firebase:

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

4. Inicie o projeto:

```bash
npm start
# ou
yarn start
```

## 📱 Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços e configurações
  ├── context/       # Contextos do React
  └── App.jsx        # Componente principal
```

## 🔐 Rotas Protegidas

O sistema possui rotas protegidas que requerem autenticação:

- Menu Principal
- Cadastro de Visitantes
- Lista de Visitantes
- Cadastro de Avisos
- Lista de Avisos
- Cadastro de Usuários
- Logs do Sistema

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Faça o Commit das suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Faça o Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Agradecimentos

- Desenvolvido para fortalecer a comunhão em nossa igreja
- Contribuição de todos os membros da equipe de desenvolvimento
