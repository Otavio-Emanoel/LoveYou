# Love-You App — Guia de Desenvolvimento

Este guia vai te ajudar a criar o app "Love-You" do zero, com todas as funcionalidades e personalizações desejadas.

---

## 1. Configuração Inicial

- Instale as dependências:
  ```bash
  npm install
  ```

- Inicie o projeto:
  ```bash
  npx expo start
  ```

---

## 2. Personalização Visual

### 2.1. Ícone do App

- Substitua o arquivo `assets/images/icon.png` pelo seu novo ícone (PNG, 1024x1024px).
- Se quiser, troque também o `adaptive-icon.png` para Android.
- O caminho do ícone está configurado no [`app.json`](app.json).

### 2.2. Cores e Tema

- Edite [`constants/Colors.ts`](constants/Colors.ts) para definir a paleta do app (ex: tons de rosa, vermelho, roxo).
- Ajuste o tema das abas em [`app/(tabs)/_layout.tsx`](app/(tabs)/_layout.tsx).

---

## 3. Estrutura de Telas

### 3.1. Simulador de Presentes Virtuais

- Crie uma tela `/gifts` ou use uma das abas.
- Exiba presentes virtuais com animações, frases e sons divertidos.
- Sugestão: use um array de objetos com nome, emoji, frase e (opcional) som.

### 3.2. Quiz “O quanto você me conhece?”

- Crie uma tela `/quiz`.
- Implemente perguntas e respostas personalizadas.
- Mostre um resultado divertido ao final.

### 3.3. Botão do Elogio

- Crie uma tela `/compliment`.
- Adicione um botão que exibe elogios aleatórios de um array.

---

## 4. Navegação

- Use o sistema de abas já configurado em [`app/(tabs)/_layout.tsx`](app/(tabs)/_layout.tsx).
- Renomeie as abas para: Presentes, Quiz, Elogios.
- Troque os ícones das abas para algo temático (ex: `card-giftcard`, `quiz`, `favorite`).

---

## 5. Recursos Extras

- Adicione animações com [react-native-reanimated](https://docs.expo.dev/versions/latest/sdk/reanimated/).
- Use sons com [expo-av](https://docs.expo.dev/versions/latest/sdk/av/).
- Personalize fontes em [`app/_layout.tsx`](app/_layout.tsx).

---

## 6. Testes e Publicação

- Teste no Android, iOS e Web.
- Ajuste splash screen e favicon em [`app.json`](app.json).
- Para publicar, siga a [documentação do Expo](https://docs.expo.dev/classic/building-standalone-apps/).

---

## 7. Dicas

- Use componentes reutilizáveis para presentes e elogios.
- Deixe os textos e arrays em arquivos separados para facilitar a personalização.
- Use o arquivo [`README.md`](README.md) principal para instruções rápidas e este guia para detalhes do projeto.

---

## 8. Referências

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

---

**Divirta-se criando e personalizando seu app!**