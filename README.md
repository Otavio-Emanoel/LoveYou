# Love-You App 💖

Um app React Native feito com Expo para surpreender, divertir e encantar quem você ama!  
Inclui elogios animados, música, presentes virtuais, quiz personalizado, histórias românticas e muito mais.

---

## ✨ Funcionalidades

- **Elogios Aleatórios:** Receba frases fofas e motivacionais com animações de corações.
- **Música Animada:** Toque músicas divertidas enquanto vê os elogios, com animação visual.
- **Presentes Virtuais:** Envie presentes digitais com frases e sons especiais.
- **Quiz Personalizado:** Teste o quanto você conhece a pessoa amada.
- **Histórias Românticas:** Gere histórias criativas usando IA (Gemini API).
- **Animações Temáticas:** Junimos e galinha dançando, corações voando e muito mais.
- **Modal de Confirmação:** Ao sair da tela de elogios com música tocando, aparece um modal para confirmar a parada da música.
- **Toque nos Junimos/Galinha:** Clique nos personagens para soltar corações animados.

---

## 🚀 Como rodar o projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```
2. **Inicie o app:**
   ```bash
   npx expo start
   ```
   Use o QR Code no Expo Go ou rode em emulador Android/iOS.

---

## 📱 Como gerar o APK/AAB

### 1. Instale o EAS CLI:
```bash
npm install -g eas-cli
```

### 2. Configure e faça login:
```bash
eas login
eas build:configure
```

### 3. Build para Android (AAB):
```bash
eas build -p android
```
O arquivo `.aab` é para Play Store.

### 4. Build para Android (APK para teste):

Edite o arquivo `eas.json`:
```json
{
  "build": {
    "preview-apk": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Rode:
```bash
eas build -p android --profile preview-apk
```
O link do APK será exibido ao final.

### 5. Build para iOS:
```bash
eas build -p ios
```
Necessário conta Apple Developer.

---

## 🛠️ Estrutura do Projeto

- `/app`: Telas do app (elogios, presentes, quiz, etc).
- `/components`: Componentes reutilizáveis (ThemedText, ThemedView, etc).
- `/assets`: Imagens, vídeos e músicas.
- `/constants`: Cores e temas.
- `/scripts`: Scripts utilitários.
- `HowToDo.md`: Guia detalhado de desenvolvimento e personalização.

---

## 🖌️ Personalização

- **Cores e Tema:** Edite `constants/Colors.ts`.
- **Ícone do App:** Troque `assets/images/icon.png` e `adaptive-icon.png`.
- **Frases e Elogios:** Edite os arrays nas telas ou mova para arquivos separados.
- **Músicas:** Adicione/remova arquivos em `assets/music/`.

---

## 💡 Dicas de Uso

- Toque nos Junimos ou na galinha para soltar corações animados.
- Ao sair da tela de elogios com música tocando, confirme no modal para evitar bugs.
- Use o quiz e presentes para criar momentos divertidos e personalizados.
- Gere histórias românticas usando a tela de presentes (API Gemini).

---

## 🧑‍💻 Desenvolvimento

- Projeto criado com [Expo](https://expo.dev/) e [Expo Router](https://docs.expo.dev/router/introduction/).
- Animações com `Animated` do React Native.
- Sons com `expo-av`.
- API Gemini para geração de histórias (configure sua chave na tela de presentes).

---

## 📦 Publicação

- Teste em Android, iOS e Web.
- Ajuste splash screen e favicon em `app.json`.
- Para publicar, siga a [documentação do Expo](https://docs.expo.dev/classic/building-standalone-apps/).

---

## 📚 Referências e Guias

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Guia de Desenvolvimento do Projeto](HowToDo.md)

---

## 🤝 Contribua

Sinta-se à vontade para abrir issues, sugerir melhorias ou enviar PRs!

---

**Divirta-se criando e compartilhando amor com o Love-You App! 💖**
