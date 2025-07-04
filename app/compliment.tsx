import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Audio, Video } from 'expo-av';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Modal, Pressable, StyleSheet, View } from 'react-native';

const compliments = [
  "Você é incrível!",
  "Seu sorriso ilumina tudo!",
  "Você faz o mundo melhor!",
  "Admiro muito você!",
  "Você é muito especial!",
  "Seu carinho faz toda diferença!",
  "Você é inspiração!",
  "Seu jeito é único!",
  "Você merece tudo de bom!",
  "Você é a melhor namorada do mundo!",
  "Sua presença é mágica!",
  "Você é uma pessoa maravilhosa!",
  "Você é a razão do meu sorriso!",
  "Você é a luz da minha vida!",
  "Você é tão 🫦",
  "Seloco voce é linda demais 😍😍😍",
  "Se perfeição fosse pessoa, seria você 😍",
  "Eu te amo mais que tudo nesse mundo ❤️",
  "Obrigado por ser tão legal comigo 🥺"
];

const SCREEN_WIDTH = Dimensions.get('window').width;

const musicList = [
  require('../assets/music/bailando.mp3'),
  require('../assets/music/Cults - Always Forever.mp3'),
  require('../assets/music/Discord.mp3'),
  require('../assets/music/Electro-Light - Symbolism.mp3'),
  require('../assets/music/Galantis - Runaway.mp3'),
  require('../assets/music/Hey Lover.mp3'),
  require('../assets/music/I Am King - Impossible.mp3'),
  require('../assets/music/Running in The 90s.mp3'),
];

type Heart = {
  id: number;
  left: number;
  size: number;
  anim: Animated.Value;
  opacity: Animated.Value;
  rotate: Animated.Value;
  color: string;
};

export default function ComplimentScreen() {
  const [compliment, setCompliment] = useState(compliments[0]);
  const router = useRouter();

  const BAR_COUNT = 5;
  const barAnims = useRef(Array.from({ length: BAR_COUNT }, () => new Animated.Value(16))).current;

  // Música
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Corações animados
  const [hearts, setHearts] = useState<Heart[]>([]);
  const heartId = useRef(0);
  const heartInterval = useRef<NodeJS.Timeout | null>(null);

  // Modal de confirmação de saída
  const [showExitModal, setShowExitModal] = useState(false);

  // Animação barra de música
  const anim = useRef(new Animated.Value(0)).current;

  // Função para criar um coração animado
  function spawnHeartAtRandom() {
    const id = heartId.current++;
    const left = Math.random() * (SCREEN_WIDTH * 0.6) + SCREEN_WIDTH * 0.2;
    const size = 24 + Math.random() * 24;
    const anim = new Animated.Value(0);
    const opacity = new Animated.Value(1);
    const rotate = new Animated.Value(Math.random() * 2 - 1);
    const colors = ['#D86DA4', '#F78FB3', '#F7C8E0', '#FF69B4', '#FFB6C1'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    setHearts(prev => [
      ...prev,
      { id, left, size, anim, opacity, rotate, color }
    ]);
    Animated.parallel([
      Animated.timing(anim, {
        toValue: 1,
        duration: 2200 + Math.random() * 800,
        useNativeDriver: false,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1800 + Math.random() * 800,
        useNativeDriver: false,
        easing: Easing.linear,
      }),
    ]).start(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    });
  }

  // Animação das barras de música
  useEffect(() => {
    let running = true;

    function animateBars() {
      if (!isPlaying) return;
      const animations = barAnims.map(anim =>
        Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random() * 44 + 16,
            duration: 250 + Math.random() * 200,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 16,
            duration: 250 + Math.random() * 200,
            useNativeDriver: false,
          }),
        ])
      );
      Animated.parallel(animations).start(() => {
        if (running && isPlaying) animateBars();
      });
    }

    if (isPlaying) {
      animateBars();
    }
    return () => {
      running = false;
      barAnims.forEach(anim => anim.setValue(16));
    };
  }, [isPlaying, barAnims]);

  // Efeito para criar corações enquanto a música toca
  useEffect(() => {
    if (isPlaying) {
      // @ts-ignore
      heartInterval.current = setInterval(() => {
        spawnHeartAtRandom();
      }, 200);
    }
    return () => {
      if (heartInterval.current) clearInterval(heartInterval.current);
    };
  }, [isPlaying]);

  // Limpa os corações só quando a música para
  useEffect(() => {
    if (!isPlaying) {
      setHearts([]);
    }
  }, [isPlaying]);

  function handleCompliment() {
    let newCompliment = compliment;
    while (newCompliment === compliment && compliments.length > 1) {
      newCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    }
    setCompliment(newCompliment);
  }

  async function handleMusicButton() {
    if (isPlaying) {
      setIsPlaying(false);
      Animated.timing(anim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
        easing: Easing.out(Easing.exp),
      }).start();
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
    } else {
      setIsPlaying(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: false,
        easing: Easing.out(Easing.exp),
      }).start();
      const randomMusic = musicList[Math.floor(Math.random() * musicList.length)];
      const { sound: newSound } = await Audio.Sound.createAsync(randomMusic, { shouldPlay: true });
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate(async status => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: false,
            easing: Easing.out(Easing.exp),
          }).start();
        }
      });
    }
  }

  // Botão voltar com modal
  function handleBackPress() {
    if (isPlaying) {
      setShowExitModal(true);
    } else {
      router.push('/');
    }
  }

  async function handleConfirmExit() {
    setShowExitModal(false);
    setIsPlaying(false);
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    router.push('/');
  }

  function handleCancelExit() {
    setShowExitModal(false);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>JUNIMOS DANCE ✨</ThemedText>
        <Pressable style={styles.junimoBox} onPress={spawnHeartAtRandom}>
          <Video
            source={require('../assets/images/junimo.mp4')}
            style={styles.junimoGif}
            // @ts-ignore
            resizeMode="cover"
            isLooping
            shouldPlay
            isMuted={false}
            useNativeControls={false}
          />
        </Pressable>
        <View style={styles.complimentBox}>
          <ThemedText style={styles.complimentText}>{compliment}</ThemedText>
        </View>
        <Pressable style={styles.complimentButton} onPress={handleCompliment}>
          <ThemedText style={styles.complimentButtonText}>Novo Elogio</ThemedText>
        </Pressable>
        <Pressable style={styles.musicButton} onPress={handleMusicButton}>
          {!isPlaying ? (
            <ThemedText style={styles.musicButtonText}>Tocar Música 🎵</ThemedText>
          ) : (
            <View style={styles.musicBarsContainer}>
              {barAnims.map((anim, idx) => (
                <Animated.View
                  key={idx}
                  style={[
                    styles.musicBar,
                    {
                      height: anim,
                      backgroundColor: idx % 2 === 0 ? '#D86DA4' : '#F78FB3',
                    },
                  ]}
                />
              ))}
            </View>
          )}
          {hearts.map(heart => (
            <Animated.Text
              key={heart.id}
              style={{
                position: 'absolute',
                left: heart.left - heart.size / 2 - SCREEN_WIDTH * 0.2,
                bottom: 0,
                fontSize: heart.size,
                opacity: heart.opacity,
                color: heart.color,
                transform: [
                  {
                    translateY: heart.anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -SCREEN_WIDTH * 0.7],
                    }),
                  },
                  {
                    rotate: heart.rotate.interpolate({
                      inputRange: [-1, 1],
                      outputRange: ['-20deg', '20deg'],
                    }),
                  },
                  {
                    scale: heart.anim.interpolate({
                      inputRange: [0, 0.2, 1],
                      outputRange: [0.7, 1.1, 1],
                    }),
                  },
                ],
                zIndex: 100,
                textShadowColor: '#fff',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 6,
              }}
            >
              ❤️
            </Animated.Text>
          ))}
        </Pressable>

        <Pressable onPress={handleBackPress} style={styles.exitButton}>
          <ThemedText type="link" style={styles.exitButtonText}>
            Voltar
          </ThemedText>
        </Pressable>

        {/* Modal de confirmação para sair com música tocando */}
        <Modal
          visible={showExitModal}
          transparent
          animationType="fade"
          onRequestClose={handleCancelExit}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText style={styles.modalTitle}>
                A música está tocando! Deseja parar a música e voltar?
              </ThemedText>
              <View style={styles.modalButtonsRow}>
                <Pressable
                  style={[styles.exitButton, { backgroundColor: '#F78FB3', marginRight: 8 }]}
                  onPress={handleConfirmExit}
                >
                  <ThemedText style={styles.exitButtonText}>Parar e Voltar</ThemedText>
                </Pressable>
                <Pressable
                  style={[styles.exitButton, { backgroundColor: '#DDD' }]}
                  onPress={handleCancelExit}
                >
                  <ThemedText style={[styles.exitButtonText, { color: '#D86DA4' }]}>Cancelar</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Pressable style={styles.chickenDance} onPress={spawnHeartAtRandom}>
          <Video
            source={require('../assets/images/galinhaDancando.mp4')}
            style={styles.chickenDanceGif}
            // @ts-ignore
            resizeMode="cover"
            isLooping
            shouldPlay
            isMuted={false}
            useNativeControls={false}
          />
        </Pressable>

        <Pressable style={styles.junimoOrange} onPress={spawnHeartAtRandom}>
          <Video
            source={require('../assets/images/junimoLaranja.mp4')}
            style={styles.junimoOrangeGif}
            // @ts-ignore
            resizeMode="cover"
            isLooping
            shouldPlay
            isMuted={false}
            useNativeControls={false}
          />
        </Pressable>

        <Pressable style={styles.junimoGreen} onPress={spawnHeartAtRandom}>
          <Video
            source={require('../assets/images/junimoVerde.mp4')}
            style={styles.junimoGreenGif}
            // @ts-ignore
            resizeMode="cover"
            isLooping
            shouldPlay
            isMuted={false}
            useNativeControls={false}
          />
        </Pressable>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7C8E0',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Play-Bold',
    color: '#D86DA4',
    marginBottom: 24,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 16,
    lineHeight: 40,
    shadowColor: '#010101',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
  },
  junimoBox: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    backgroundColor: '#FFF',
    borderRadius: SCREEN_WIDTH * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 4,
    overflow: 'hidden',
  },
  junimoGif: {
    width: '90%',
    height: '90%',
  },
  complimentBox: {
    backgroundColor: '#FFF5F9',
    borderRadius: 18,
    paddingVertical: 24,
    paddingHorizontal: 32,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#D86DA4',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
    minWidth: 220,
  },
  complimentText: {
    color: '#D86DA4',
    fontFamily: 'Play-Bold',
    fontSize: 22,
    textAlign: 'center',
  },
  complimentButton: {
    backgroundColor: '#F78FB3',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    elevation: 2,
    alignSelf: 'center',
    marginTop: 16,
  },
  complimentButtonText: {
    color: '#fff',
    fontFamily: 'Play-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  musicButton: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#F78FB3',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 40,
    elevation: 2,
    alignSelf: 'center',
    minWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  musicButtonText: {
    color: '#fff',
    fontFamily: 'Play-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  musicBarsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 60,
    gap: 4,
  },
  musicBar: {
    width: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  exitButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    backgroundColor: '#D86DA4',
    alignSelf: 'center',
  },
  exitButtonText: {
    color: '#fff',
    fontFamily: 'Play-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFF5F9',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '90%',
    maxWidth: 340,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: '#D86DA4',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Play-Bold',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
    paddingHorizontal: 10,
  },
  chickenDance: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.25,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    elevation: 4,
    shadowColor: '#010101',
    shadowOpacity: 0.5,
    shadowRadius: 15,
    position: 'absolute',
    bottom: -20,
    transform: [{ translateY: '-50%' }],
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#D86DA4',
    padding: 10,
  },
  chickenDanceGif: {
    width: '100%',
    height: '100%',
  },
  junimoOrange: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.25,
    backgroundColor: '#FFF',
    borderRadius: SCREEN_WIDTH * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 4,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 16,
    left: 16,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#D86DA4',
    padding: 4,
  },
  junimoOrangeGif: {
    width: '100%',
    height: '100%',
  },
  junimoGreen: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.25,
    backgroundColor: '#DBEAC7',
    borderRadius: SCREEN_WIDTH * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 4,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 16,
    right: 16,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#D86DA4',
    padding: 4,
  },
  junimoGreenGif: {
    width: '100%',
    height: '100%',
  },
});