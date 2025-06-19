import { useNavigation } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

const BUTTONS = [
  {
    label: 'Presentes Virtuais',
    emoji: '🎁',
    color: Colors.light.tint,
    route: '/gifts',
  },
  {
    label: 'Quiz do Amor',
    emoji: '❓',
    color: Colors.light.icon,
    route: '/quiz',
  },
  {
    label: 'Botão do Elogio',
    emoji: '💖',
    color: Colors.light.gold,
    route: '/compliment',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  const anims = [
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
    useRef(new Animated.Value(0)),
  ];

  useEffect(() => {
    Animated.stagger(
      150,
      anims.map(anim =>
        Animated.spring(anim.current, {
          toValue: 1,
          useNativeDriver: true,
        })
      )
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Animated.Text style={styles.title}>
        💌 Love You
      </Animated.Text>
      <ThemedText type="subtitle" style={styles.subtitle}>
        Um app feito com carinho só pra você!
      </ThemedText>
      <View style={styles.buttonsContainer}>
        {BUTTONS.map((btn, idx) => (
          <Animated.View
            key={btn.label}
            style={{
              opacity: anims[idx].current,
              transform: [
                {
                  translateY: anims[idx].current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [60, 0],
                  }),
                },
              ],
            }}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: btn.color,
                  shadowColor: Colors.light.icon,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              android_ripple={{ color: Colors.light.cardAlt }}
              onPress={() => navigation.navigate(btn.route as never)}
            >
              <ThemedText style={styles.buttonEmoji}>{btn.emoji}</ThemedText>
              <ThemedText type="subtitle" style={styles.buttonLabel}>
                {btn.label}
              </ThemedText>
            </Pressable>
          </Animated.View>
        ))}
      </View>
      <Animated.View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Feito com <ThemedText style={{ color: Colors.light.icon, fontFamily: 'Play-Bold' }}>♥</ThemedText> por Otavio para Ágata!
        </ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 38,
    fontFamily: 'Play-Bold',
    color: Colors.light.icon,
    marginBottom: 8,
    textShadowColor: Colors.light.cardAlt,
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.light.text,
    marginBottom: 32,
    textAlign: 'center',
    fontFamily: 'Play-Regular',
    fontSize: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 24,
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 24,
    marginVertical: 4,
    elevation: 4,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    justifyContent: 'center',
  },
  buttonEmoji: {
    fontSize: 40,
    marginRight: 16,
    lineHeight: 44,
  },
  buttonLabel: {
    fontSize: 22,
    color: Colors.light.text,
    fontFamily: 'Play-Bold',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.light.icon,
    fontSize: 16,
    backgroundColor: Colors.light.card,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: Colors.light.icon,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    fontFamily: 'Play-Regular',
    letterSpacing: 1,
    elevation: 6,
    borderWidth: 1.5,
    borderColor: Colors.light.gold,
    textAlign: 'center',
  },
});