# Guia de Testes - Sistema de Notificações

Este guia foca na configuração das credenciais do Google e no passo a passo para testar a API usando Postman.

## 1. Configuração Google Cloud (Obrigatório)
Para testar o login, você precisa de um `Client ID` do Google.

1.  Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2.  Crie um novo projeto.
3.  Vá em **APIs e Serviços** > **Credenciais**.
4.  Clique em **Criar Credenciais** > **ID do cliente OAuth**.
5.  Tipo de aplicativo: **Aplicação da Web**.
6.  Em **Origens JavaScript autorizadas**, adicione: `http://localhost:5001`.
7.  Em **URIs de redirecionamento autorizados**, adicione: `https://developers.google.com/oauthplayground` (para facilitar o teste manual).
8.  Clique em **Criar**.
9.  Copie o **ID do cliente** e atualize seu arquivo `.env`:
    ```env
    GOOGLE_CLIENT_ID="SEU_CLIENT_ID_AQUI"
    ```

## 2. Guia de Testes Passo a Passo (Postman)

### Passo 1: Obter Token do Google (Manual)
Como não temos frontend ainda, usaremos o **Google OAuth 2.0 Playground** para gerar um token válido.

1.  Acesse [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2.  No canto superior direito (ícone de engrenagem), marque **Use your own OAuth credentials**.
3.  Cole seu **OAuth Client ID** e **OAuth Client Secret** (criados no passo anterior).
4.  Na lista de APIs à esquerda, digite/selecione: `openid email profile`.
5.  Clique em **Authorize APIs**.
6.  Faça login com sua conta Google.
7.  Na etapa 2, clique em **Exchange authorization code for tokens**.
8.  Copie o valor de **id_token** (é um JWT longo).

### Passo 2: Login na API
1.  Abra o Postman (ou Insomnia).
2.  Crie uma requisição `POST http://localhost:5001/auth/google`.
3.  No **Body** (JSON), cole o token:
    ```json
    {
      "idToken": "COLE_SEU_ID_TOKEN_AQUI"
    }
    ```
4.  Envie.
5.  A resposta conterá:
    ```json
    {
      "accessToken": "JWT_DA_SUA_API...",
      "user": { ... }
    }
    ```
6.  **Copie este `accessToken`.** Ele é sua chave para o resto do sistema.

### Passo 3: Conectar no WebSocket (Socket.IO)
1.  No Postman, clique em **New** > **Socket.IO**.
2.  URL: `ws://localhost:5001`.
3.  **Autenticação (Obrigatória):**
    *   Vá na aba **Headers** da requisição Socket.IO.
    *   Adicione o header:
        ```
        Authorization: Bearer SEU_ACCESS_TOKEN
        ```
    *   Substitua `SEU_ACCESS_TOKEN` pelo token recebido no Passo 2.
4.  **Configurar Listener (Importante):**
    *   Vá na aba **Events**.
    *   Clique em **Add Event** ou no botão para adicionar um novo evento.
    *   No campo do nome do evento, digite: `notification`
    *   **Ative o botão Listen** para começar a ouvir o evento em tempo real.
5.  Clique em **Connect**.
6.  Você deve ver a mensagem "Connected" e no log do servidor: `Client connected: ... (User: ...)`

### Passo 4: Enviar Notificação (REST)
Com o WebSocket conectado, vamos disparar uma notificação.

1.  Crie uma nova requisição REST `POST http://localhost:5001/notifications`.
2.  Vá na aba **Auth**, selecione **Bearer Token** e cole o `accessToken`.
3.  Body (JSON):
    ```json
    {
      "userId": "ID_DO_USUARIO_QUE_ESTA_LOGADO",
      "title": "Teste Postman",
      "message": "Funciona em tempo real!"
    }
    ```
    *(Dica: Pegue o `userId` na resposta do login ou no log do servidor)*.
4.  Envie.

### Passo 5: Verificar Recebimento
1.  Volte na aba do **Socket.IO** no Postman.
2.  Na aba **Events**, você verá o evento `notification` que você configurou para escutar.
3.  Quando a notificação for enviada, aparecerá uma nova mensagem abaixo do evento `notification`.
4.  Clique na mensagem para expandir e ver o JSON completo com os dados da notificação.

**Dica:** Deixe a aba do Socket.IO aberta e visível enquanto envia a notificação pelo REST. Assim você vê a mensagem chegando em tempo real.
