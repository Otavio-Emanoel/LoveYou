import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack, useNavigation } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Dimensions, Linking, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import quizData from '../assets/quiz.json';


type Question = {
    id: number;
    question: string;
    options: string[];
    answer: number;
};

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function QuizScreen() {
    const [answers, setAnswers] = useState<(number | null)[]>(Array(quizData.length).fill(null));
    const [showResult, setShowResult] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();


    // Animations: one Animated.Value for each option of each question
    const optionAnims = useRef(
        quizData.map(q =>
            q.options.map(() => new Animated.Value(0))
        )
    ).current;

    function animateOption(qIdx: number, optIdx: number) {
        // Reset all options for this question
        optionAnims[qIdx].forEach((anim, idx) => {
            Animated.timing(anim, {
                toValue: idx === optIdx ? 1 : 0,
                duration: 350,
                useNativeDriver: false,
            }).start();
        });
    }

    function handleSelect(qIdx: number, optIdx: number) {
        if (showResult) return;
        setAnswers(ans => {
            const copy = [...ans];
            copy[qIdx] = optIdx;
            return copy;
        });
        animateOption(qIdx, optIdx);
    }

    function handleFinish() {
        setShowResult(true);
        setModalVisible(true);
    }

    function getResultText() {
        const correct = answers.filter((ans, idx) => ans === quizData[idx].answer).length;
        return `Você acertou ${correct} de ${quizData.length} perguntas!`;
    }

    function handleShare() {
        const correct = answers.filter((ans, idx) => ans === quizData[idx].answer).length;
        const text = `Quiz do Amor 💖\n${getResultText()}\n\nFaça também!`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        Linking.openURL(url);
    }

    function handleRestart() {
        setAnswers(Array(quizData.length).fill(null));
        setShowResult(false);
        setModalVisible(false);
        // Reset all animations
        optionAnims.forEach(qArr => qArr.forEach(anim => anim.setValue(0)));
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Quiz do Amor</ThemedText>
                <ScrollView contentContainerStyle={styles.quizContainer}>
                    {quizData.map((q: Question, qIdx: number) => (
                        <View key={q.id} style={styles.questionBlock}>
                            <ThemedText style={styles.question}>
                                <ThemedText style={styles.questionNumber}>{qIdx + 1}.</ThemedText> {q.question}
                            </ThemedText>
                            <View style={styles.optionsRow}>
                                {q.options.map((opt, optIdx) => {
                                    const isSelected = answers[qIdx] === optIdx;
                                    const isCorrect = showResult && optIdx === q.answer && answers[qIdx] === optIdx;
                                    const isWrong = showResult && answers[qIdx] === optIdx && optIdx !== q.answer;

                                    // Animation: bar grows from left to right when selected
                                    const anim = optionAnims[qIdx][optIdx];
                                    const backgroundColor = anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['#E8DAEF', '#F3E5AB'],
                                    });
                                    const barWidth = anim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    });

                                    // After result, keep correct/wrong coloring
                                    let finalBg = backgroundColor;
                                    if (showResult) {
                                        if (isCorrect) finalBg = '#E0FFD8';
                                        else if (isWrong) finalBg = '#FFD6D6';
                                        else if (isSelected) finalBg = '#F3E5AB';
                                        else finalBg = '#E8DAEF';
                                    }

                                    return (
                                        <Pressable
                                            key={optIdx}
                                            style={styles.optionPressable}
                                            onPress={() => handleSelect(qIdx, optIdx)}
                                            disabled={showResult}
                                        >
                                            <Animated.View
                                                style={[
                                                    styles.optionAnimated,
                                                    {
                                                        backgroundColor: showResult ? finalBg : backgroundColor,
                                                    },
                                                ]}
                                            >
                                                {/* Animated bar */}
                                                {!showResult && (
                                                    <Animated.View
                                                        style={[
                                                            styles.animatedBar,
                                                            {
                                                                width: barWidth,
                                                                backgroundColor: '#F78FB3',
                                                            },
                                                        ]}
                                                    />
                                                )}
                                                <ThemedText style={[
                                                    styles.optionText,
                                                    isCorrect && styles.optionTextCorrect,
                                                    isWrong && styles.optionTextWrong,
                                                    isSelected && !showResult && styles.optionTextSelected
                                                ]}>
                                                    {String.fromCharCode(65 + optIdx)}. {opt}
                                                    {showResult && isCorrect && ' ✅'}
                                                    {showResult && isWrong && ' ❌'}
                                                </ThemedText>
                                            </Animated.View>
                                        </Pressable>
                                    );
                                })}
                            </View>
                            {showResult && answers[qIdx] !== quizData[qIdx].answer && (
                                <ThemedText style={styles.feedbackWrong}>Você errou! (A resposta certa não será mostrada 😉)</ThemedText>
                            )}
                        </View>
                    ))}
                </ScrollView>
                {!showResult ? (
                    <Pressable style={styles.finishButton} onPress={handleFinish} disabled={answers.includes(null)}>
                        <ThemedText style={styles.finishButtonText}>
                            {answers.includes(null) ? 'Responda tudo' : 'Finalizar'}
                        </ThemedText>
                    </Pressable>
                ) : null}
                <Pressable style={styles.homeButton} onPress={() => navigation.navigate("index")}>
                    <ThemedText style={styles.homeButtonText}>Voltar à tela inicial</ThemedText>
                </Pressable>

                {/* Modal de resultado bonito */}
                <Modal
                    visible={modalVisible}
                    animationType="fade"
                    transparent
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.resultModal}>
                            <ThemedText style={styles.resultEmoji}>🎉</ThemedText>
                            <ThemedText style={styles.resultTitle}>Resultado do Quiz</ThemedText>
                            <ThemedText style={styles.resultTextBig}>{getResultText()}</ThemedText>
                            <ScrollView style={{ maxHeight: SCREEN_WIDTH }}>
                                {quizData.map((q: Question, qIdx: number) => {
                                    const isCorrect = answers[qIdx] === q.answer;
                                    return (
                                        <View key={q.id} style={styles.resultQuestionBlock}>
                                            <ThemedText style={styles.resultQuestion}>
                                                <ThemedText style={styles.questionNumber}>{qIdx + 1}.</ThemedText> {q.question}
                                            </ThemedText>
                                            <ThemedText style={[
                                                styles.resultAnswer,
                                                isCorrect ? styles.resultAnswerCorrect : styles.resultAnswerWrong
                                            ]}>
                                                {q.options[answers[qIdx] ?? 0]}
                                                {isCorrect ? ' ✅' : ' ❌'}
                                            </ThemedText>
                                            {!isCorrect && (
                                                <ThemedText style={styles.resultNoAnswer}>
                                                    Você errou! (A resposta certa não será mostrada 😉)
                                                </ThemedText>
                                            )}
                                        </View>
                                    );
                                })}
                            </ScrollView>
                            <Pressable style={styles.shareButton} onPress={handleShare}>
                                <ThemedText style={styles.shareButtonText}>Compartilhar no WhatsApp</ThemedText>
                            </Pressable>
                            <Pressable style={styles.restartButton} onPress={handleRestart}>
                                <ThemedText style={styles.restartButtonText}>Refazer Quiz</ThemedText>
                            </Pressable>
                            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <ThemedText style={styles.closeButtonText}>Fechar</ThemedText>
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
        backgroundColor: '#F7C8E0',
        paddingTop: 48,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    title: {
        fontSize: 34,
        fontFamily: 'Play-Bold',
        color: '#D86DA4',
        marginBottom: 16,
        textAlign: 'center',
        letterSpacing: 1,
    },
    quizContainer: {
        paddingBottom: 32,
        width: '100%',
        alignItems: 'center',
    },
    questionBlock: {
        backgroundColor: '#FFF5F9',
        borderRadius: 22,
        padding: 22,
        marginBottom: 22,
        width: '100%',
        maxWidth: 420,
        elevation: 3,
        shadowColor: '#D86DA4',
        shadowOpacity: 0.10,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
    },
    question: {
        fontSize: 19,
        fontFamily: 'Play-Bold',
        color: '#D86DA4',
        marginBottom: 14,
        textAlign: 'left',
        lineHeight: 26,
    },
    questionNumber: {
        color: '#F78FB3',
        fontFamily: 'Play-Bold',
        fontSize: 20,
    },
    optionsRow: {
        flexDirection: 'column',
        gap: 10,
        marginBottom: 6,
    },
    optionPressable: {
        marginVertical: 4,
    },
    optionAnimated: {
        overflow: 'hidden',
        borderRadius: 14,
        paddingVertical: 13,
        paddingHorizontal: 18,
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: '#E8DAEF',
        justifyContent: 'center',
        minHeight: 48,
    },
    animatedBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        borderRadius: 14,
        zIndex: 0,
        opacity: 0.18,
    },
    selectedOption: {
        borderColor: '#F78FB3',
        backgroundColor: '#F3E5AB',
    },
    correctOption: {
        borderColor: '#4BB543',
        backgroundColor: '#E0FFD8',
    },
    wrongOption: {
        borderColor: '#FF4C4C',
        backgroundColor: '#FFD6D6',
    },
    optionText: {
        fontSize: 17,
        fontFamily: 'Play-Regular',
        color: '#3B3B3B',
        letterSpacing: 0.2,
        zIndex: 1,
    },
    optionTextSelected: {
        color: '#D86DA4',
        fontFamily: 'Play-Bold',
    },
    optionTextCorrect: {
        color: '#388E3C',
        fontFamily: 'Play-Bold',
    },
    optionTextWrong: {
        color: '#B71C1C',
        fontFamily: 'Play-Bold',
    },
    feedbackWrong: {
        color: '#FF4C4C',
        fontFamily: 'Play-Bold',
        marginTop: 8,
        fontSize: 15,
        textAlign: 'left',
    },
    finishButton: {
        backgroundColor: '#F78FB3',
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 48,
        marginTop: 12,
        marginBottom: 32,
        elevation: 3,
        shadowColor: '#F78FB3',
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    finishButtonText: {
        color: '#fff',
        fontFamily: 'Play-Bold',
        fontSize: 20,
        letterSpacing: 1,
    },
    // Modal de resultado
    modalOverlay: {
        flex: 1,
        backgroundColor: '#0009',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    resultModal: {
        backgroundColor: '#FFF5F9',
        borderRadius: 32,
        padding: 32,
        width: '90%',
        maxWidth: 440,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#D86DA4',
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
    },
    resultEmoji: {
        fontSize: 60,
        marginBottom: 8,
        lineHeight: 70,
        textAlign: 'center',
    },
    resultTitle: {
        fontSize: 28,
        fontFamily: 'Play-Bold',
        color: '#D86DA4',
        marginBottom: 8,
        textAlign: 'center',
    },
    resultTextBig: {
        fontSize: 22,
        fontFamily: 'Play-Bold',
        color: '#F78FB3',
        marginBottom: 18,
        textAlign: 'center',
    },
    resultQuestionBlock: {
        marginBottom: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F3E5AB',
        paddingBottom: 10,
    },
    resultQuestion: {
        fontSize: 17,
        fontFamily: 'Play-Bold',
        color: '#D86DA4',
        marginBottom: 4,
        textAlign: 'left',
    },
    resultAnswer: {
        fontSize: 16,
        fontFamily: 'Play-Regular',
        marginBottom: 2,
        textAlign: 'left',
    },
    resultAnswerCorrect: {
        color: '#388E3C',
        fontFamily: 'Play-Bold',
    },
    resultAnswerWrong: {
        color: '#B71C1C',
        fontFamily: 'Play-Bold',
    },
    resultNoAnswer: {
        color: '#FF4C4C',
        fontFamily: 'Play-Regular',
        fontSize: 14,
        marginBottom: 2,
    },
    shareButton: {
        backgroundColor: '#25D366',
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 40,
        marginTop: 12,
        marginBottom: 8,
        elevation: 2,
    },
    shareButtonText: {
        color: '#fff',
        fontFamily: 'Play-Bold',
        fontSize: 18,
        letterSpacing: 1,
    },
    restartButton: {
        backgroundColor: '#F78FB3',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 8,
        marginBottom: 8,
        elevation: 2,
    },
    restartButtonText: {
        color: '#fff',
        fontFamily: 'Play-Bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    closeButton: {
        backgroundColor: '#E8DAEF',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 32,
        marginTop: 8,
        elevation: 1,
    },
    closeButtonText: {
        color: '#D86DA4',
        fontFamily: 'Play-Bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    homeButton: {
        backgroundColor: '#F3E5AB',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 32,
        marginTop: -15,
        marginBottom: 32,
        elevation: 1,
    },
    homeButtonText: {
        color: '#D86DA4',
        fontFamily: 'Play-Bold',
        fontSize: 16,
        letterSpacing: 1,
        textAlign: 'center',
    },
});