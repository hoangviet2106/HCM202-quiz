import { useState } from 'react';
import { QuestionOption } from './QuestionOption';

function toYouTubeEmbed(url) {
    if (!url) return null;
    // Try to extract video id from common YouTube URL formats
    const idMatch = url.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{6,})/);
    const id = idMatch ? idMatch[1] : null;
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
}

function renderFeedback(answerRecord, question) {
    if (!answerRecord) {
        return <p className="feedback neutral">Chọn một đáp án để nhận phản hồi ngay lập tức.</p>;
    }

    if (answerRecord.isCorrect) {
        const selectedOption = question.options.find((option) => option.id === answerRecord.selectedOptionId);

        return (
            <div className="feedback correct">
                <p>
                    Đúng rồi. {selectedOption ? `Bạn đã chọn ${selectedOption.id} - ${selectedOption.label}.` : 'Lựa chọn của bạn khớp với đáp án chuẩn.'}
                </p>
            </div>
        );
    }

    const correctOption = question.options.find((option) => option.id === question.correctOptionId);
    const selectedOption = question.options.find((option) => option.id === answerRecord.selectedOptionId);

    return (
        <div className="feedback wrong">
            <p>
                Sai rồi. Bạn đã chọn {selectedOption ? `${selectedOption.id} - ${selectedOption.label}` : 'không rõ'}, đáp án đúng là {correctOption ? `${correctOption.id} - ${correctOption.label}` : question.correctOptionId}.
            </p>
            {question.explanation ? <p className="feedback-note">{question.explanation}</p> : null}
        </div>
    );
}

export function QuestionDetail({
    question,
    answerRecord,
    onChooseOption,
    totalQuestions,
    answeredCount,
    visibleAnsweredCount,
    visibleCorrectCount,
    visibleWrongCount,
    filterMode,
    emptyState,
    onNext,
    onPrev,
}) {
    const [musicInput, setMusicInput] = useState('');
    const [embedUrl, setEmbedUrl] = useState(null);
    if (!question) {
        return (
            <section className="panel detail-panel">
                <div className="empty-state detail-empty">
                    {emptyState
                        ? 'Không còn câu nào trong chế độ xem này. Hãy đổi bộ lọc, xóa từ khóa tìm kiếm, hoặc reset để quay về toàn bộ bộ câu hỏi.'
                        : 'Chọn một câu ở cột trái để bắt đầu ôn tập.'}
                </div>
            </section>
        );
    }

    return (
        <section className="panel detail-panel">
            <div className="panel-header detail-header">
                <div>
                    <p className="panel-kicker">Câu {question.number}</p>
                    <h2>{question.prompt}</h2>
                </div>
                <div className="detail-stats">
                    <span>{answeredCount}/{totalQuestions} đã làm</span>
                    <span>{visibleAnsweredCount} câu trong bộ lọc hiện tại</span>
                    {filterMode === 'review' ? <span className="detail-chip">Chế độ ôn câu sai</span> : null}
                </div>
            </div>

            <div className="detail-metrics" aria-label="Tóm tắt trạng thái bộ lọc">
                <span className="detail-metric success">{visibleCorrectCount} đúng</span>
                <span className="detail-metric danger">{visibleWrongCount} sai</span>
            </div>

            <div className="option-grid" role="list" aria-label={`Các lựa chọn cho câu ${question.number}`}>
                {question.options.map((option) => (
                    <QuestionOption
                        key={option.id}
                        option={option}
                        isSelected={answerRecord?.selectedOptionId === option.id}
                        isCorrectAnswer={answerRecord ? question.correctOptionId === option.id : false}
                        isWrongSelection={answerRecord ? answerRecord.selectedOptionId === option.id && !answerRecord.isCorrect : false}
                        onClick={() => onChooseOption(question, option.id)}
                    />
                ))}
            </div>

            <div className="feedback-panel">{renderFeedback(answerRecord, question)}</div>

            <div className="detail-actions">
                <div className="nav-buttons">
                    <button type="button" className="btn-secondary" onClick={onPrev} disabled={!onPrev}>
                        Câu trước
                    </button>
                    <button type="button" className="btn-secondary" onClick={onNext} disabled={!onNext}>
                        Câu tiếp
                    </button>
                </div>

                <div className="music-control">
                    <label className="field-label">Phát nhạc (YouTube link)</label>
                    <div className="music-row">
                        <input
                            type="text"
                            className="music-input"
                            placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                            value={musicInput}
                            onChange={(e) => setMusicInput(e.target.value)}
                        />
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setEmbedUrl(toYouTubeEmbed(musicInput))}
                        >
                            Play
                        </button>
                        <button
                            type="button"
                            className="btn-secondary destructive"
                            onClick={() => {
                                setMusicInput('');
                                setEmbedUrl(null);
                            }}
                        >
                            Clear
                        </button>
                    </div>
                    {embedUrl ? (
                        <div className="music-player">
                            <iframe
                                title="background-music"
                                src={embedUrl}
                                width="100%"
                                height="120"
                                allow="autoplay; encrypted-media"
                            />
                        </div>
                    ) : null}
                </div>
            </div>

            {question.explanation ? (
                <section className="explanation-box">
                    <p className="panel-kicker">Ghi chú ôn tập</p>
                    <p>{question.explanation}</p>
                </section>
            ) : null}

            {question.tags?.length ? (
                <div className="tag-row" aria-label="Từ khóa liên quan">
                    {question.tags.map((tag) => (
                        <span key={tag} className="tag-pill">
                            {tag}
                        </span>
                    ))}
                </div>
            ) : null}
        </section>
    );
}
