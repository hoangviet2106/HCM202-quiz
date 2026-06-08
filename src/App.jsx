import { useEffect, useMemo, useState } from 'react';
import { QuestionDetail } from './components/QuestionDetail';
import { EvidenceGallery } from './components/EvidenceGallery';
import { loadQuestionBank } from './lib/questionBank';
import { clearStudyState, loadStudyState, saveStudyState } from './lib/storage';

const PAGE_SIZE = 18;

function normalizeText(value) {
    return String(value ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '');
}

function buildSearchIndex(question) {
    return [
        question.number,
        question.prompt,
        question.tags?.join(' '),
        question.options?.map((option) => `${option.id} ${option.label}`).join(' '),
    ]
        .filter(Boolean)
        .map(normalizeText)
        .join(' ');
}

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
    const [activeTab, setActiveTab] = useState('quiz');
    const [answerRecords, setAnswerRecords] = useState({});
    const [filterMode, setFilterMode] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hydrated, setHydrated] = useState(false);
    const [theme, setTheme] = useState(() => {
        try {
            return window.localStorage.getItem('theme') || 'light';
        } catch {
            return 'light';
        }
    });

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
        try {
            document.documentElement.setAttribute('data-theme', theme);
            window.localStorage.setItem('theme', theme);
        } catch (e) {
            // ignore
        }
    }, [theme]);

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

    const searchableQuestions = useMemo(() => {
        return questions.map((question) => ({
            question,
            index: buildSearchIndex(question),
            record: answerRecords[question.id] ?? null,
        }));
    }, [answerRecords, questions]);

    const visibleQuestions = useMemo(() => {
        const normalizedQuery = normalizeText(searchQuery).trim();

        return searchableQuestions
            .filter(({ question, index, record }) => {
                const matchesSearch = normalizedQuery === '' || index.includes(normalizedQuery);

                if (!matchesSearch) {
                    return false;
                }

                switch (filterMode) {
                    case 'answered':
                        return Boolean(record);
                    case 'unanswered':
                        return !record;
                    case 'correct':
                        return record?.isCorrect === true;
                    case 'wrong':
                    case 'review':
                        return record?.isCorrect === false;
                    default:
                        return Boolean(question);
                }
            })
            .map(({ question }) => question);
    }, [filterMode, searchableQuestions, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(visibleQuestions.length / PAGE_SIZE));
    const clampedPage = Math.min(currentPage, totalPages);
    const pageQuestions = useMemo(() => {
        const startIndex = (clampedPage - 1) * PAGE_SIZE;
        return visibleQuestions.slice(startIndex, startIndex + PAGE_SIZE);
    }, [clampedPage, visibleQuestions]);

    useEffect(() => {
        if (bankState.status !== 'ready') {
            return;
        }

        if (visibleQuestions.length === 0) {
            if (activeQuestionId !== null) {
                setActiveQuestionId(null);
            }
            if (currentPage !== 1) {
                setCurrentPage(1);
            }
            return;
        }

        const activeIndex = visibleQuestions.findIndex((question) => question.id === activeQuestionId);
        if (activeIndex === -1) {
            setActiveQuestionId(visibleQuestions[0].id);
            if (clampedPage !== 1) {
                setCurrentPage(1);
            }
            return;
        }

        const nextPage = Math.floor(activeIndex / PAGE_SIZE) + 1;
        if (nextPage !== clampedPage) {
            setCurrentPage(nextPage);
        }
    }, [activeQuestionId, bankState.status, clampedPage, currentPage, visibleQuestions]);

    const activeQuestion = questions.find((question) => question.id === activeQuestionId) ?? null;
    const activeRecord = activeQuestion ? answerRecords[activeQuestion.id] ?? null : null;

    const totalQuestions = questions.length;
    const answeredCount = questions.filter((question) => answerRecords[question.id]).length;
    const correctCount = questions.filter((question) => answerRecords[question.id]?.isCorrect).length;
    const wrongCount = questions.filter((question) => answerRecords[question.id]?.isCorrect === false).length;
    const unansweredCount = Math.max(totalQuestions - answeredCount, 0);
    const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

    const visibleAnsweredCount = visibleQuestions.filter((question) => answerRecords[question.id]).length;
    const visibleCorrectCount = visibleQuestions.filter((question) => answerRecords[question.id]?.isCorrect).length;
    const visibleWrongCount = visibleQuestions.filter((question) => answerRecords[question.id]?.isCorrect === false).length;
    const tabs = [
        { id: 'quiz', label: 'Quiz' },
        { id: 'images', label: 'Ảnh' },
    ];

    const handleSelectQuestion = (questionId) => {
        setActiveQuestionId(questionId);
        const visibleIndex = visibleQuestions.findIndex((question) => question.id === questionId);
        if (visibleIndex >= 0) {
            setCurrentPage(Math.floor(visibleIndex / PAGE_SIZE) + 1);
        }
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
        setFilterMode('all');
        setSearchQuery('');
        setCurrentPage(1);
        setActiveQuestionId(questions[0]?.id ?? null);
    };

    function handleNextQuestion() {
        if (!visibleQuestions.length) return;
        const index = visibleQuestions.findIndex((question) => question.id === activeQuestionId);
        const nextIndex = index === -1 ? 0 : Math.min(visibleQuestions.length - 1, index + 1);
        setActiveQuestionId(visibleQuestions[nextIndex].id);
        setCurrentPage(Math.floor(nextIndex / PAGE_SIZE) + 1);
    }

    function handlePrevQuestion() {
        if (!visibleQuestions.length) return;
        const index = visibleQuestions.findIndex((question) => question.id === activeQuestionId);
        const prevIndex = index === -1 ? 0 : Math.max(0, index - 1);
        setActiveQuestionId(visibleQuestions[prevIndex].id);
        setCurrentPage(Math.floor(prevIndex / PAGE_SIZE) + 1);
    }

    return (
        <div className="app-shell">
            <header className="hero">
                <div className="hero-copy-block">
                    <p className="eyebrow">HCM Quiz Review</p>
                    <h1>Ôn tập Tư tưởng Hồ Chí Minh.</h1>
                    <p className="hero-copy">
                        Ôn tập câu hỏi theo nhịp, trả lời trực tiếp và nhận phản hồi ngay lập tức. Tiến độ của bạn
                        được lưu lại để có thể tiếp tục bất kỳ lúc nào.
                    </p>
                </div>

                <div className="hero-actions">
                    <button
                        type="button"
                        className={`btn-secondary ${filterMode === 'review' ? 'active' : ''}`}
                        onClick={() => {
                            setFilterMode((currentValue) => (currentValue === 'review' ? 'all' : 'review'));
                            setCurrentPage(1);
                        }}
                    >
                        Ôn câu sai
                    </button>
                    <button type="button" className="btn-secondary theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                        {theme === 'light' ? '🌙 Giao diện tối' : '☀️ Giao diện sáng'}
                    </button>

                    <button type="button" className="btn-secondary destructive" onClick={handleResetAll}>
                        Xóa toàn bộ
                    </button>
                </div>
            </header>

            <section className="toolbar-panel" aria-label="Thanh công cụ nội dung">
                <div className="tab-strip" role="tablist" aria-label="Chọn chế độ xem">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-label">{tab.label}</span>
                            <span className="tab-hint">{tab.id === 'quiz' ? 'Làm bài và ôn tập' : 'Kho ảnh minh chứng'}</span>
                        </button>
                    ))}
                </div>
                <p className="toolbar-note">
                    Tab Ảnh là khung collage để bạn thay bằng các minh chứng lịch sử Đảng Việt Nam theo bộ ảnh của riêng bạn.
                </p>
            </section>

            {activeTab === 'quiz' ? (
                <>
                    <section className="stats-grid" aria-label="Tổng quan tiến độ học">
                        <article className="stat-card accent-card">
                            <span className="stat-label">Tổng câu</span>
                            <strong>{totalQuestions}</strong>
                            <span className="stat-caption">Bộ câu hỏi đầy đủ</span>
                        </article>
                        <article className="stat-card">
                            <span className="stat-label">Đã làm</span>
                            <strong>{answeredCount}</strong>
                            <span className="stat-caption">{unansweredCount} câu chưa chạm</span>
                        </article>
                        <article className="stat-card success-card">
                            <span className="stat-label">Đúng</span>
                            <strong>{correctCount}</strong>
                            <span className="stat-caption">Câu đã chinh phục</span>
                        </article>
                        <article className="stat-card danger-card">
                            <span className="stat-label">Sai</span>
                            <strong>{wrongCount}</strong>
                            <span className="stat-caption">Câu cần ôn lại</span>
                        </article>
                        <article className="stat-card progress-card">
                            <span className="stat-label">Tiến độ</span>
                            <strong>{progressPercent}%</strong>
                            <div className="progress-track" aria-hidden="true">
                                <span className="progress-fill" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <span className="stat-caption">{answeredCount}/{totalQuestions} đã làm</span>
                        </article>
                    </section>

                    {bankState.status === 'loading' && <div className="status-panel">Đang tải bộ câu hỏi...</div>}

                    {bankState.status === 'error' && (
                        <div className="status-panel error-panel">
                            Không thể tải bộ câu hỏi. Hãy kiểm tra file public/questions.json hoặc chạy script trích xuất.
                        </div>
                    )}

                    {bankState.status === 'ready' && bankState.usingFallback && (
                        <div className="status-panel warning-panel">
                            Đang dùng bộ câu hỏi mẫu vì chưa tìm thấy public/questions.json hợp lệ.
                        </div>
                    )}

                    <main className="quiz-layout single-column">
                        <QuestionDetail
                            question={activeQuestion}
                            answerRecord={activeRecord}
                            onChooseOption={handleChooseOption}
                            totalQuestions={totalQuestions}
                            answeredCount={answeredCount}
                            visibleAnsweredCount={visibleAnsweredCount}
                            visibleCorrectCount={visibleCorrectCount}
                            visibleWrongCount={visibleWrongCount}
                            filterMode={filterMode}
                            emptyState={visibleQuestions.length === 0}
                            onNext={handleNextQuestion}
                            onPrev={handlePrevQuestion}
                        />
                    </main>
                </>
            ) : (
                <EvidenceGallery />
            )}
        </div>
    );
}
