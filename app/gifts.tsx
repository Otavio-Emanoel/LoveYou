import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Stack, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Animated, Clipboard, Dimensions, Modal, PanResponder, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import presentsData from '../assets/presents.json';

type Present = {
    id: number;
    emoji: string;
    title: string;
    message: string;
    color: string;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

// Função para embaralhar um array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function GiftsScreen() {
        const router = useRouter();

    // Embaralha os presentes apenas uma vez ao montar o componente
    const shuffledPresents = useRef<Present[]>(shuffleArray(presentsData as Present[])).current;
    const [current, setCurrent] = useState(0);

    // Animated value for the X position
    const position = useRef(new Animated.Value(0)).current;
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Modal de formulário para gerar história
    const [storyFormVisible, setStoryFormVisible] = useState(false);
    // Modal de resultado da história
    const [storyResultVisible, setStoryResultVisible] = useState(false);
    const [loadingStory, setLoadingStory] = useState(false);
    const [story, setStory] = useState('');
    const [form, setForm] = useState({
        protagonist: '',
        genre: '',
        setting: '',
        additional: '',
    });

    // Helper para pegar presente pelo índice (circular)
    const getPresent = (idx: number) => shuffledPresents[(idx + shuffledPresents.length) % shuffledPresents.length];

    // PanResponder para swipe
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 10,
            onPanResponderMove: (_, gestureState) => {
                if (!isTransitioning) {
                    position.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (isTransitioning) return;
                if (gestureState.dx < -100) {
                    setIsTransitioning(true);
                    Animated.timing(position, {
                        toValue: -SCREEN_WIDTH,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        position.setValue(SCREEN_WIDTH);
                        setCurrent((prev) => (prev + 1) % shuffledPresents.length);
                        Animated.timing(position, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }).start(() => setIsTransitioning(false));
                    });
                } else if (gestureState.dx > 100) {
                    setIsTransitioning(true);
                    Animated.timing(position, {
                        toValue: SCREEN_WIDTH,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        position.setValue(-SCREEN_WIDTH);
                        setCurrent((prev) => (prev - 1 + shuffledPresents.length) % shuffledPresents.length);
                        Animated.timing(position, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }).start(() => setIsTransitioning(false));
                    });
                } else {
                    Animated.spring(position, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const present = getPresent(current);

    // Função para chamar a API do Gemini e gerar uma história
    async function handleGenerateStory() {
        setLoadingStory(true);
        setStory('');
        try {
            const apiKey = 'SUA_CHAVE_API_KEY_AQUI'; // Substitua pela sua chave de API do Gemini
            if (!apiKey) {
                console.error('Chave de API não configurada');
                setStory('Chave de API não configurada. Verifique as configurações.');
                setStoryResultVisible(true);
                return;
            }
            let prompt = `Crie uma história curta, romântica e criativa`;
            if (form.protagonist.trim()) prompt += ` com a protagonista chamada ${form.protagonist}`;
            if (form.genre.trim()) prompt += `, no gênero ${form.genre}`;
            if (form.setting.trim()) prompt += `, ambientada em ${form.setting}`;
            if (form.additional.trim()) prompt += `. Detalhes adicionais: ${form.additional}`;
            prompt += `. A história deve ser envolvente, fofa e terminar de forma positiva.`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                }
            );
            const data = await response.json();
            const generated =
                data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
                'Não foi possível gerar a história. Tente novamente.';

            setStory(generated);
            setStoryResultVisible(true);
        } catch (e) {
            console.error('Erro ao gerar história:', e);
            setStory('Não foi possível gerar a história. Tente novamente.');
            setStoryResultVisible(true);
        } finally {
            setLoadingStory(false);
        }
    }

    // Função para copiar a história
    function handleCopyStory() {
        if (Platform.OS === 'web') {
            navigator.clipboard.writeText(story);
        } else {
            // @ts-ignore
            Clipboard.setString(story);
        }
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>
                    🎁 Presentes Virtuais
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                    Receba um presente simbólico e divertido!
                </ThemedText>

                <View style={styles.cardContainer}>
                    <Animated.View
                        {...panResponder.panHandlers}
                        style={[
                            styles.card,
                            {
                                backgroundColor: present.color,
                                shadowColor: Colors.light.icon,
                                zIndex: 2,
                                transform: [
                                    { translateX: position },
                                    {
                                        translateY: position.interpolate({
                                            inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                                            outputRange: [-SCREEN_WIDTH * 0.15, 0, SCREEN_WIDTH * 0.15],
                                        }),
                                    },
                                    {
                                        rotate: position.interpolate({
                                            inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                                            outputRange: ['-15deg', '0deg', '15deg'],
                                        }),
                                    },
                                    {
                                        scale: position.interpolate({
                                            inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
                                            outputRange: [0.95, 1, 0.95],
                                        }),
                                    },
                                ],
                            },
                        ]}
                    >
                        <ThemedText style={styles.giftEmoji}>{present.emoji}</ThemedText>
                        <ThemedText style={styles.giftTitle}>{present.title}</ThemedText>
                        <ThemedText style={styles.giftText}>{present.message}</ThemedText>
                    </Animated.View>
                </View>

                <Pressable
                    style={styles.geminiButton}
                    onPress={() => {
                        setStoryFormVisible(true);
                        setForm({ protagonist: '', genre: '', setting: '', additional: '' });
                        setStory('');
                    }}
                >
                    <ThemedText style={styles.geminiButtonText}>Gerar história</ThemedText>
                </Pressable>

                <Pressable style={styles.backButton} onPress={() => router.push('/')}>
                    <ThemedText style={styles.backButtonText}>Voltar à tela inicial</ThemedText>
                </Pressable>

                {/* Modal do formulário para gerar história */}
                <Modal
                    visible={storyFormVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setStoryFormVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <ThemedText style={styles.modalTitle}>Gerar história romântica</ThemedText>
                            <TextInput
                                style={styles.input}
                                placeholder="Nome do(a) protagonista"
                                placeholderTextColor="#aaa"
                                value={form.protagonist}
                                onChangeText={t => setForm(f => ({ ...f, protagonist: t }))}
                                editable={!loadingStory}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Gênero da história (ex: comédia, aventura, fantasia...)"
                                placeholderTextColor="#aaa"
                                value={form.genre}
                                onChangeText={t => setForm(f => ({ ...f, genre: t }))}
                                editable={!loadingStory}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Ambiente (ex: praia, castelo, escola...)"
                                placeholderTextColor="#aaa"
                                value={form.setting}
                                onChangeText={t => setForm(f => ({ ...f, setting: t }))}
                                editable={!loadingStory}
                            />
                            <TextInput
                                style={[styles.input, { minHeight: 60 }]}
                                placeholder="Detalhes adicionais (opcional)"
                                placeholderTextColor="#aaa"
                                value={form.additional}
                                onChangeText={t => setForm(f => ({ ...f, additional: t }))}
                                editable={!loadingStory}
                                multiline
                            />
                            <Pressable
                                style={styles.geminiButton}
                                onPress={handleGenerateStory}
                                disabled={loadingStory}
                            >
                                <ThemedText style={styles.geminiButtonText}>
                                    {loadingStory ? 'Gerando...' : 'Gerar história'}
                                </ThemedText>
                            </Pressable>
                            {loadingStory && <ActivityIndicator size="large" color={Colors.light.icon} style={{ marginTop: 16 }} />}
                            <Pressable
                                style={[styles.backButton, { marginTop: 24 }]}
                                onPress={() => setStoryFormVisible(false)}
                                disabled={loadingStory}
                            >
                                <ThemedText style={styles.backButtonText}>Fechar</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {/* Modal do resultado da história */}
                <Modal
                    visible={storyResultVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setStoryResultVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <ThemedText style={styles.modalTitle}>História Gerada</ThemedText>
                            <View style={{ maxHeight: 300, width: '100%' }}>
                                <ScrollView>
                                    <ThemedText style={styles.storyText}>{story}</ThemedText>
                                </ScrollView>
                            </View>
                            <Pressable
                                style={styles.geminiButton}
                                onPress={handleCopyStory}
                            >
                                <ThemedText style={styles.geminiButtonText}>Copiar história</ThemedText>
                            </Pressable>
                            <Pressable
                                style={[styles.backButton, { marginTop: 24 }]}
                                onPress={() => setStoryResultVisible(false)}
                            >
                                <ThemedText style={styles.backButtonText}>Fechar</ThemedText>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </ThemedView>
        </>
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
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Play-Regular',
        color: Colors.light.text,
        marginBottom: 32,
        textAlign: 'center',
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
    },
    card: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 28,
        paddingVertical: 36,
        paddingHorizontal: 28,
        alignItems: 'center',
        marginBottom: 24,
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        borderWidth: 2,
        borderColor: Colors.light.gold,
        position: 'absolute',
        left: 0,
        right: 0,
    },
    giftEmoji: {
        fontSize: 64,
        marginBottom: 12,
        lineHeight: 80,
        fontFamily: 'Play-Bold',
        textShadowColor: Colors.light.icon,
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    giftTitle: {
        fontSize: 22,
        fontFamily: 'Play-Bold',
        color: Colors.light.icon,
        marginBottom: 8,
        lineHeight: 28,
        textAlign: 'center',
    },
    giftText: {
        fontSize: 18,
        fontFamily: 'Play-Regular',
        color: Colors.light.text,
        textAlign: 'center',
    },
    geminiButton: {
        backgroundColor: Colors.light.icon,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 3,
        shadowColor: Colors.light.icon,
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        alignSelf: 'center',
    },
    geminiButtonText: {
        color: '#fff',
        fontFamily: 'Play-Bold',
        fontSize: 18,
        letterSpacing: 1,
        textAlign: 'center',
    },
    backButton: {
        marginTop: 4,
        marginBottom: 40,
        backgroundColor: Colors.light.cardAlt,
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignSelf: 'center',
        elevation: 2,
    },
    backButtonText: {
        color: Colors.light.icon,
        fontFamily: 'Play-Bold',
        fontSize: 16,
        letterSpacing: 1,
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
        backgroundColor: Colors.light.card,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
        elevation: 8,
        borderWidth: 2,
        borderColor: Colors.light.gold,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: 'Play-Bold',
        color: Colors.light.icon,
        marginBottom: 12,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.light.icon,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Play-Regular',
        marginBottom: 12,
        color: Colors.light.text,
        backgroundColor: Colors.light.background,
    },
    storyText: {
        fontSize: 17,
        fontFamily: 'Play-Regular',
        color: Colors.light.text,
        textAlign: 'center',
        marginBottom: 18,
        maxWidth: 300,
    },
});