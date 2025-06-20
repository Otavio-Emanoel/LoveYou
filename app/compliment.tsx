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
        <ThemedText style={styles.title}>Elogios</ThemedText>
        <View style={styles.junimoBox}>
          <Video
            source={require('../assets/images/junimo.mp4')}
            style={styles.junimoGif}
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
});