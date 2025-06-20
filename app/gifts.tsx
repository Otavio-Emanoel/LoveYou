import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useNavigation } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function GiftsScreen() {
  const navigation = useNavigation();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>
        🎁 Presentes Virtuais
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        Receba um presente simbólico e divertido!
      </ThemedText>
      <ScrollView contentContainerStyle={styles.giftsContainer} showsVerticalScrollIndicator={false}>
        {/* Aqui você pode renderizar os presentes futuramente */}
        <View style={styles.placeholderGift}>
          <ThemedText style={styles.giftEmoji}>🐱</ThemedText>
          <ThemedText style={styles.giftText}>
            Um abraço quentinho em forma de gatinho!
          </ThemedText>
        </View>
        <View style={styles.placeholderGift}>
          <ThemedText style={styles.giftEmoji}>☕</ThemedText>
          <ThemedText style={styles.giftText}>
            Um café virtual feito com amor!
          </ThemedText>
        </View>
        <View style={styles.placeholderGift}>
          <ThemedText style={styles.giftEmoji}>🏆</ThemedText>
          <ThemedText style={styles.giftText}>
            Certificado de namorada mais perfeita do universo!
          </ThemedText>
        </View>
      </ScrollView>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <ThemedText style={styles.backButtonText}>Voltar</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Play-Bold',
    color: Colors.light.icon,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Play-Regular',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  giftsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    paddingBottom: 32,
  },
  placeholderGift: {
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    shadowColor: Colors.light.icon,
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1.5,
    borderColor: Colors.light.gold,
  },
  giftEmoji: {
    fontSize: 48,
    marginBottom: 8,
    fontFamily: 'Play-Bold',
  },
  giftText: {
    fontSize: 18,
    fontFamily: 'Play-Regular',
    color: Colors.light.text,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignSelf: 'center',
    elevation: 3,
  },
  backButtonText: {
    color: Colors.light.text,
    fontFamily: 'Play-Bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});