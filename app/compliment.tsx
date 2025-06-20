import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Video } from 'expo-av';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

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
  "Você é uma ótima namorada!"
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function ComplimentScreen() {
  const [compliment, setCompliment] = useState(compliments[0]);
  const router = useRouter();

  function handleCompliment() {
    let newCompliment = compliment;
    while (newCompliment === compliment && compliments.length > 1) {
      newCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    }
    setCompliment(newCompliment);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>JUNIMOS DANCE ✨</ThemedText>
        <View style={styles.junimoBox}>
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
        </View>
        <View style={styles.complimentBox}>
          <ThemedText style={styles.complimentText}>{compliment}</ThemedText>
        </View>
        <Pressable style={styles.complimentButton} onPress={handleCompliment}>
          <ThemedText style={styles.complimentButtonText}>Novo Elogio</ThemedText>
        </Pressable>
        <Pressable onPress={() => router.push('/')} style={styles.exitButton}>
          <ThemedText type="link" style={styles.exitButtonText}>
            Voltar
          </ThemedText>
        </Pressable>

        <View style={styles.chickenDance}>
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
        </View>

        <View style={styles.junimoOrange}>
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
        </View>

        <View style={styles.junimoGreen}>
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
        </View>
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
    marginBottom: 32,
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
  },
  complimentButtonText: {
    color: '#fff',
    fontFamily: 'Play-Bold',
    fontSize: 18,
    textAlign: 'center',
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
    bottom: 16,
    right: 16,
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#D86DA4',
    padding: 4,
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
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    backgroundColor: '#DBEAC7',
    borderRadius: SCREEN_WIDTH * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    elevation: 4,
    overflow: 'hidden',

    position: 'absolute',
    bottom: 20,
    transform: [{ translateY: '-50%' }],
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#D86DA4',
    padding: 10,

  },
  junimoGreenGif: {
    width: '100%',
    height: '100%',
  },

});