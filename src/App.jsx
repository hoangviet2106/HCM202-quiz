import { useEffect, useMemo, useState } from 'react';
import { QuestionDetail } from './components/QuestionDetail';
import { QuestionList } from './components/QuestionList';
import { loadQuestionBank } from './lib/questionBank';
import { clearStudyState, loadStudyState, saveStudyState } from './lib/storage';

function buildEmptyBankState() {
    return {
        status: 'loading',
        bank: null,
        error: null,
        usingFallback: false,
    };
}

export default function App() {
    const [bankState, setBankState] = useState(() => buildEmptyBankState());
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [answerRecords, setAnswerRecords] = useState({});
    const [reviewOnly, setReviewOnly] = useState(false);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            try {
                const bankResult = await loadQuestionBank();
                if (cancelled) {
                    return;
                }

                const savedState = loadStudyState();
                const questions = bankResult.bank?.questions ?? [];
                const savedActiveId = savedState?.activeQuestionId;
                const nextActiveId =
                    savedActiveId && questions.some((question) => question.id === savedActiveId)
                        ? savedActiveId
                        : questions[0]?.id ?? null;

                setBankState({
                    status: 'ready',
                    bank: bankResult.bank,
                    error: bankResult.error ?? null,
                    usingFallback: bankResult.usingFallback,
                });
                setAnswerRecords(savedState?.answerRecords ?? {});
                setActiveQuestionId(nextActiveId);
                setHydrated(true);
            } catch (error) {
                if (cancelled) {
                    return;
                }

                setBankState({
                    status: 'error',
                    bank: null,
                    error,
                    usingFallback: false,
                });
                setHydrated(true);
            }
        }

        bootstrap();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!hydrated || bankState.status !== 'ready') {
            return;
        }

        saveStudyState({
            activeQuestionId,
            answerRecords,
        });
    }, [activeQuestionId, answerRecords, bankState.status, hydrated]);

    const questions = bankState.bank?.questions ?? [];
    const filteredQuestions = useMemo(() => {
        if (!reviewOnly) {
            return questions;
        }

        return questions.filter((question) => answerRecords[question.id]?.isCorrect === false);
    }, [answerRecords, questions, reviewOnly]);

    useEffect(() => {
        if (bankState.status !== 'ready') {
            return;
        }

        if (filteredQuestions.length === 0) {
            if (reviewOnly && activeQuestionId !== null) {
                setActiveQuestionId(null);
            }
            return;
        }

        const activeStillVisible = filteredQuestions.some((question) => question.id === activeQuestionId);
        if (!activeStillVisible) {
            setActiveQuestionId(filteredQuestions[0].id);
        }
    }, [activeQuestionId, bankState.status, filteredQuestions, reviewOnly]);

    const activeQuestion = questions.find((question) => question.id === activeQuestionId) ?? null;
    const activeRecord = activeQuestion ? answerRecords[activeQuestion.id] ?? null : null;

    const totalQuestions = questions.length;
    const answeredCount = questions.filter((question) => answerRecords[question.id]).length;
    const correctCount = questions.filter((question) => answerRecords[question.id]?.isCorrect).length;
    const wrongCount = questions.filter((question) => answerRecords[question.id]?.isCorrect === false).length;
    const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

    const handleSelectQuestion = (questionId) => {
        setActiveQuestionId(questionId);
    };

    const handleChooseOption = (question, optionId) => {
        const isCorrect = question.correctOptionId === optionId;

        setAnswerRecords((currentRecords) => ({
            ...currentRecords,
            [question.id]: {
                selectedOptionId: optionId,
                isCorrect,
                answeredAt: new Date().toISOString(),
            },
        }));
    };

    const handleResetAll = () => {
        clearStudyState();
        setAnswerRecords({});
        setReviewOnly(false);
        setActiveQuestionId(questions[0]?.id ?? null);
    };

    // Navigation: next / previous question within current filteredQuestions
    function handleNextQuestion() {
        if (!filteredQuestions || filteredQuestions.length === 0) return;
        const idx = filteredQuestions.findIndex((q) => q.id === activeQuestionId);
        const nextIndex = idx === -1 ? 0 : Math.min(filteredQuestions.length - 1, idx + 1);
        setActiveQuestionId(filteredQuestions[nextIndex].id);
    }

    function handlePrevQuestion() {
        if (!filteredQuestions || filteredQuestions.length === 0) return;
        const idx = filteredQuestions.findIndex((q) => q.id === activeQuestionId);
        const prevIndex = idx === -1 ? 0 : Math.max(0, idx - 1);
        setActiveQuestionId(filteredQuestions[prevIndex].id);
    }

    // YouTube help video state
    const [youtubeUrl, setYoutubeUrl] = useState(() => {
        try {
            return window.localStorage.getItem('hcm-help-video') || '';
        } catch {
            return '';
        }
    });
    const [videoInput, setVideoInput] = useState(youtubeUrl ?? '');
    const [showVideoPanel, setShowVideoPanel] = useState(false);

    useEffect(() => {
        try {
            if (youtubeUrl) {
                window.localStorage.setItem('hcm-help-video', youtubeUrl);
            } else {
                window.localStorage.removeItem('hcm-help-video');
            }
        } catch { }
    }, [youtubeUrl]);

    function toYouTubeEmbed(url) {
        if (!url) return '';
        try {
            const u = new URL(url.trim());
            // youtu.be short link
            if (u.hostname.includes('youtu.be')) {
                const id = u.pathname.slice(1);
                return `https://www.youtube.com/embed/${id}`;
            }
            // youtube.com watch?v=ID
            if (u.searchParams.get('v')) {
                return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
            }
            // embed or other forms
            if (u.pathname.includes('/embed/')) {
                return url;
            }
        } catch {
            return '';
        }
        return '';
    }

    return (
        <div className="app-shell">
            <header className="hero">
                <div>
                    <p className="eyebrow">HCM Quiz Review</p>
                    <h1>HCM 202 - Ôn tập</h1>

                </div>

                <div className="hero-controls">
                    <button
                        type="button"
                        className={`control-pill ${reviewOnly ? 'active' : ''}`}
                        onClick={() => setReviewOnly((currentValue) => !currentValue)}
                    >
                        {reviewOnly ? 'Đang xem câu sai' : 'Xem câu sai'}
                    </button>
                    <button type="button" className="control-pill destructive" onClick={handleResetAll}>
                        Reset all answers
                    </button>
                    <button type="button" className="control-pill" onClick={handlePrevQuestion} disabled={filteredQuestions.length === 0 || filteredQuestions.findIndex(q => q.id === activeQuestionId) <= 0}>
                        Câu trước 
                    </button>

                    <button type="button" className="control-pill" onClick={handleNextQuestion} disabled={filteredQuestions.length === 0 || filteredQuestions.findIndex(q => q.id === activeQuestionId) === filteredQuestions.length - 1}>
                        Câu tiếp
                    </button>

                    <button
                        type="button"
                        className={`control-pill ${showVideoPanel ? 'active' : ''}`}
                        onClick={() => setShowVideoPanel((v) => !v)}
                    >
                        Video Link
                    </button>
                </div>
            </header>

            {showVideoPanel && (
                <div style={{ margin: '14px 0' }}>
                    {youtubeUrl ? (
                        <div className="video-wrapper">
                            <iframe
                                title="Help video"
                                src={toYouTubeEmbed(youtubeUrl)}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                            <div style={{ marginTop: 10, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                <button type="button" className="control-pill" onClick={() => setYoutubeUrl('')}>Xoá video</button>
                                <button type="button" className="control-pill" onClick={() => setShowVideoPanel(false)}>Đóng</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                                aria-label="YouTube link"
                                placeholder="Dán link YouTube hướng dẫn (tùy chọn)"
                                value={videoInput}
                                onChange={(e) => setVideoInput(e.target.value)}
                                style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)' }}
                            />
                            <button
                                type="button"
                                className="control-pill"
                                onClick={() => {
                                    const embed = toYouTubeEmbed(videoInput);
                                    if (embed) setYoutubeUrl(videoInput.trim());
                                }}
                            >
                                Hiển thị video
                            </button>
                            <button type="button" className="control-pill" onClick={() => setShowVideoPanel(false)}>Đóng</button>
                        </div>
                    )}
                </div>
            )}

            <section className="stats-grid" aria-label="Tổng quan tiến độ học">
                <article className="stat-card">
                    <span className="stat-label">Tổng câu</span>
                    <strong>{totalQuestions}</strong>
                </article>
                <article className="stat-card">
                    <span className="stat-label">Đã làm</span>
                    <strong>{answeredCount}</strong>
                </article>
                <article className="stat-card">
                    <span className="stat-label">Đúng</span>
                    <strong>{correctCount}</strong>
                </article>
                <article className="stat-card">
                    <span className="stat-label">Sai</span>
                    <strong>{wrongCount}</strong>
                </article>
                <article className="stat-card progress-card">
                    <span className="stat-label">Hoàn thành</span>
                    <strong>{progressPercent}%</strong>
                    <div className="progress-track" aria-hidden="true">
                        <span className="progress-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                </article>
            </section>

            {bankState.status === 'loading' && <div className="status-panel">Đang tải bộ câu hỏi...</div>}

            {bankState.status === 'error' && (
                <div className="status-panel error-panel">
                    Không thể tải bộ câu hỏi. Hãy kiểm tra file `public/questions.json` hoặc chạy script trích xuất.
                </div>
            )}

            {bankState.status === 'ready' && bankState.usingFallback && (
                <div className="status-panel warning-panel">
                    Đang dùng bộ câu hỏi mẫu vì chưa tìm thấy `public/questions.json` hợp lệ.
                </div>
            )}

            {/* Validation warnings intentionally hidden */}

            <main className="quiz-layout">
                <QuestionList
                    questions={filteredQuestions}
                    activeQuestionId={activeQuestionId}
                    answerRecords={answerRecords}
                    reviewOnly={reviewOnly}
                    onSelectQuestion={handleSelectQuestion}
                />

                <QuestionDetail
                    question={activeQuestion}
                    answerRecord={activeRecord}
                    onChooseOption={handleChooseOption}
                    totalQuestions={totalQuestions}
                    answeredCount={answeredCount}
                    reviewOnly={reviewOnly}
                    emptyState={filteredQuestions.length === 0}
                />
            </main>
        </div>
    );
}