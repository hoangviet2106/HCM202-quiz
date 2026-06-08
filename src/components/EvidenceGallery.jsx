import { useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'hcm-evidence-gallery-state';

const evidenceCards = [
    {
        id: '01',
        title: 'Bảo tàng / di tích',
        note: 'Thay ảnh vào đây để mở đầu bộ minh chứng.',
        tone: 'sand',
        tilt: '-12deg',
    },
    {
        id: '02',
        title: 'Tư liệu văn kiện',
        note: 'Ảnh chụp trang tài liệu, quyết định, văn bản.',
        tone: 'olive',
        tilt: '8deg',
    },
    {
        id: '03',
        title: 'Sự kiện lịch sử',
        note: 'Mỗi khung là một mốc thời gian quan trọng.',
        tone: 'blue',
        tilt: '-7deg',
    },
    {
        id: '04',
        title: 'Chân dung nhân vật',
        note: 'Ảnh lãnh đạo, nhân chứng, người tham gia.',
        tone: 'rose',
        tilt: '11deg',
    },
    {
        id: '05',
        title: 'Khung trưng bày',
        note: 'Có thể thay bằng ảnh triển lãm hoặc pano.',
        tone: 'charcoal',
        tilt: '-10deg',
    },
    {
        id: '06',
        title: 'Ảnh lưu niệm',
        note: 'Thêm các ảnh bạn muốn gom thành bộ collage.',
        tone: 'mint',
        tilt: '6deg',
    },
    {
        id: '07',
        title: 'Tài liệu số hóa',
        note: 'Ảnh scan hoặc ảnh chụp từ bản gốc.',
        tone: 'sand',
        tilt: '-14deg',
    },
    {
        id: '08',
        title: 'Trang nhấn mạnh',
        note: 'Dùng cho ảnh tiêu đề hoặc ảnh đặc biệt.',
        tone: 'blue',
        tilt: '9deg',
    },
    {
        id: '09',
        title: 'Ảnh tư liệu phụ',
        note: 'Lấp đầy các khoảng trống trong bố cục.',
        tone: 'rose',
        tilt: '-8deg',
    },
    {
        id: '10',
        title: 'Bộ sưu tập',
        note: 'Đổi thành ảnh minh chứng lịch sử của bạn.',
        tone: 'olive',
        tilt: '12deg',
    },
];

function createInitialCards() {
    return evidenceCards.map((card) => ({
        ...card,
        kind: 'template',
        src: null,
        fileName: null,
    }));
}

function readGalleryState() {
    try {
        const serialized = window.localStorage.getItem(STORAGE_KEY);
        if (!serialized) {
            return createInitialCards();
        }

        const parsed = JSON.parse(serialized);
        if (!Array.isArray(parsed)) {
            return createInitialCards();
        }

        return parsed.filter(Boolean).map((item, index) => ({
            id: typeof item.id === 'string' ? item.id : `item-${index}`,
            title: typeof item.title === 'string' ? item.title : `Ảnh ${index + 1}`,
            note: typeof item.note === 'string' ? item.note : 'Kéo thả để sắp xếp lại.',
            tone: typeof item.tone === 'string' ? item.tone : 'sand',
            tilt: typeof item.tilt === 'string' ? item.tilt : '0deg',
            kind: item.kind === 'upload' ? 'upload' : 'template',
            src: typeof item.src === 'string' ? item.src : null,
            fileName: typeof item.fileName === 'string' ? item.fileName : null,
        }));
    } catch {

        return createInitialCards();
    }
}

function persistGalleryState(cards) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch {
        // Ignore storage failures.
    }
}

function makeFileId(file) {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

export function EvidenceGallery() {
    const [cards, setCards] = useState(() => createInitialCards());
    const [draggedCardId, setDraggedCardId] = useState(null);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [draftTitle, setDraftTitle] = useState('');
    const [draftNote, setDraftNote] = useState('');
    const [draftTone, setDraftTone] = useState('sand');
    const [draftTilt, setDraftTilt] = useState('0deg');
    const [draftPreviewSrc, setDraftPreviewSrc] = useState(null);
    const [draftFileName, setDraftFileName] = useState(null);
    const fileInputRef = useRef(null);
    const replaceFileInputRef = useRef(null);

    const selectedCard = useMemo(
        () => cards.find((card) => card.id === selectedCardId) ?? null,
        [cards, selectedCardId],
    );

    useEffect(() => {
        setCards(readGalleryState());
    }, []);

    useEffect(() => {
        persistGalleryState(cards);
    }, [cards]);

    useEffect(() => {
        if (!selectedCard) {
            return;
        }

        setDraftTitle(selectedCard.title);
        setDraftNote(selectedCard.note);
        setDraftTone(selectedCard.tone);
        setDraftTilt(selectedCard.tilt);
        setDraftPreviewSrc(selectedCard.src);
        setDraftFileName(selectedCard.fileName);
    }, [selectedCard]);

    const uploadedCount = useMemo(() => cards.filter((card) => card.kind === 'upload').length, [cards]);

    const readImageFile = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve({
                    src: String(reader.result ?? ''),
                    fileName: file.name,
                });
            };
            reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
            reader.readAsDataURL(file);
        });

    const openCardEditor = (cardId) => {
        setSelectedCardId(cardId);
    };

    const closeCardEditor = () => {
        setSelectedCardId(null);
        setDraftPreviewSrc(null);
        setDraftFileName(null);
    };

    const saveSelectedCard = () => {
        if (!selectedCardId) {
            return;
        }

        setCards((currentCards) =>
            currentCards.map((card) =>
                card.id === selectedCardId
                    ? {
                        ...card,
                        title: draftTitle.trim() || 'Không có tiêu đề',
                        note: draftNote.trim() || 'Không có chú thích.',
                        tone: draftTone,
                        tilt: draftTilt,
                        kind: draftPreviewSrc ? 'upload' : 'template',
                        src: draftPreviewSrc,
                        fileName: draftFileName,
                    }
                    : card,
            ),
        );

        closeCardEditor();
    };

    const handleReplaceSelectedImage = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const image = await readImageFile(file);
        setDraftPreviewSrc(image.src);
        setDraftFileName(image.fileName);
        event.target.value = '';
    };

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        if (!selectedFiles.length) {
            return;
        }

        setIsLoadingFiles(true);

        const loadedCards = await Promise.all(
            selectedFiles.map(
                (file, index) =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            resolve({
                                id: `upload-${makeFileId(file)}-${Date.now()}-${index}`,
                                title: file.name.replace(/\.[^.]+$/, '') || `Ảnh tải lên ${index + 1}`,
                                note: 'Ảnh tải lên từ máy. Kéo thả để đổi vị trí.',
                                tone: 'charcoal',
                                tilt: `${Math.max(-8, Math.min(8, (index % 5) * 2 - 4))}deg`,
                                kind: 'upload',
                                src: String(reader.result ?? ''),
                                fileName: file.name,
                            });
                        };
                        reader.onerror = () => reject(new Error('Không thể đọc file ảnh'));
                        reader.readAsDataURL(file);
                    }),
            ),
        );

        setCards((currentCards) => [...currentCards, ...loadedCards]);
        setIsLoadingFiles(false);
        event.target.value = '';
    };

    const moveCard = (cardId, direction) => {
        setCards((currentCards) => {
            const currentIndex = currentCards.findIndex((card) => card.id === cardId);
            if (currentIndex === -1) {
                return currentCards;
            }

            const nextIndex = currentIndex + direction;
            if (nextIndex < 0 || nextIndex >= currentCards.length) {
                return currentCards;
            }

            const nextCards = [...currentCards];
            const [movedCard] = nextCards.splice(currentIndex, 1);
            nextCards.splice(nextIndex, 0, movedCard);
            return nextCards;
        });
    };

    const moveDraggedCard = (targetId) => {
        if (!draggedCardId || draggedCardId === targetId) {
            return;
        }

        setCards((currentCards) => {
            const fromIndex = currentCards.findIndex((card) => card.id === draggedCardId);
            const toIndex = currentCards.findIndex((card) => card.id === targetId);

            if (fromIndex === -1 || toIndex === -1) {
                return currentCards;
            }

            const nextCards = [...currentCards];
            const [movedCard] = nextCards.splice(fromIndex, 1);
            nextCards.splice(toIndex, 0, movedCard);
            return nextCards;
        });
    };

    return (
        <section className="panel image-gallery-panel">
            <div className="panel-header gallery-header">
                <div>
                    <p className="panel-kicker">Tab ảnh</p>
                    <h2>Bảng ảnh minh chứng lịch sử</h2>
                </div>
                <span className="panel-count">{cards.length}</span>
            </div>

            <p className="gallery-copy">
                Tải ảnh từ máy lên, kéo thả để đổi thứ tự, hoặc dùng nút Lên/Xuống ngay trên từng thẻ.
            </p>

            <div className="gallery-tools">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="gallery-file-input"
                    onChange={handleFileChange}
                />
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoadingFiles}
                >
                    {isLoadingFiles ? 'Đang tải ảnh...' : 'Chọn ảnh từ máy'}
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setCards(createInitialCards())}
                >
                    Khôi phục mẫu
                </button>
                <span className="gallery-counter">{uploadedCount} ảnh đã tải lên</span>
            </div>

            <div className="evidence-wall" aria-label="Bảng ảnh minh chứng">
                {cards.map((card, index) => (
                    <article
                        key={card.id}
                        className={`evidence-card tone-${card.tone} ${draggedCardId === card.id ? 'dragging' : ''}`}
                        onClick={() => openCardEditor(card.id)}
                        draggable
                        onDragStart={() => setDraggedCardId(card.id)}
                        onDragEnd={() => setDraggedCardId(null)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => moveDraggedCard(card.id)}
                        style={{
                            '--tilt': card.tilt,
                            '--stack-offset': `${index % 3 === 0 ? -10 : index % 3 === 1 ? 10 : 0}px`,
                        }}
                    >
                        <div className="evidence-card-photo" aria-hidden="true">
                            {card.src ? (
                                <img className="evidence-card-image" src={card.src} alt={card.title} />
                            ) : null}
                            <span className="evidence-card-edit-hint">Bấm để sửa</span>
                            <span className="evidence-card-mark">{card.kind === 'upload' ? 'UP' : card.id}</span>
                        </div>
                        <div className="evidence-card-copy">
                            <div className="evidence-card-copy-head">
                                <h3>{card.title}</h3>
                                <div className="evidence-card-actions">
                                    <button
                                        type="button"
                                        className="mini-action-btn"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            moveCard(card.id, -1);
                                        }}
                                    >
                                        Lên
                                    </button>
                                    <button
                                        type="button"
                                        className="mini-action-btn"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            moveCard(card.id, 1);
                                        }}
                                    >
                                        Xuống
                                    </button>
                                    <button
                                        type="button"
                                        className="mini-action-btn"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            openCardEditor(card.id);
                                        }}
                                    >
                                        Sửa
                                    </button>
                                </div>
                            </div>
                            <p>{card.note}</p>
                            {card.fileName ? <span className="evidence-file-name">{card.fileName}</span> : null}
                        </div>
                    </article>
                ))}
            </div>

            {selectedCard ? (
                <div className="gallery-modal-backdrop" role="presentation" onClick={closeCardEditor}>
                    <div
                        className="gallery-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="gallery-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="gallery-modal-header">
                            <div>
                                <p className="panel-kicker">Chỉnh sửa ảnh</p>
                                <h3 id="gallery-modal-title">{draftTitle || selectedCard.title}</h3>
                            </div>
                            <button type="button" className="btn-secondary" onClick={closeCardEditor}>
                                Đóng
                            </button>
                        </div>

                        <div className="gallery-modal-preview">
                            {draftPreviewSrc ? (
                                <img className="gallery-modal-image" src={draftPreviewSrc} alt={draftTitle || selectedCard.title} />
                            ) : (
                                <div className="gallery-modal-empty">Chưa có ảnh. Hãy chọn ảnh từ máy.</div>
                            )}
                        </div>

                        <div className="gallery-modal-form">
                            <label className="editor-field">
                                <span className="field-label">Tiêu đề</span>
                                <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} />
                            </label>

                            <label className="editor-field">
                                <span className="field-label">Chú thích</span>
                                <textarea
                                    rows={3}
                                    value={draftNote}
                                    onChange={(event) => setDraftNote(event.target.value)}
                                />
                            </label>

                            <div className="editor-grid">
                                <label className="editor-field">
                                    <span className="field-label">Tone</span>
                                    <select value={draftTone} onChange={(event) => setDraftTone(event.target.value)}>
                                        <option value="sand">Sand</option>
                                        <option value="olive">Olive</option>
                                        <option value="blue">Blue</option>
                                        <option value="rose">Rose</option>
                                        <option value="charcoal">Charcoal</option>
                                        <option value="mint">Mint</option>
                                    </select>
                                </label>

                                <label className="editor-field">
                                    <span className="field-label">Độ nghiêng</span>
                                    <input
                                        value={draftTilt}
                                        onChange={(event) => setDraftTilt(event.target.value)}
                                        placeholder="-8deg"
                                    />
                                </label>
                            </div>

                            <div className="gallery-modal-actions">
                                <input
                                    ref={replaceFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="gallery-file-input"
                                    onChange={handleReplaceSelectedImage}
                                />
                                <button type="button" className="btn-secondary" onClick={() => replaceFileInputRef.current?.click()}>
                                    Đổi ảnh
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary destructive"
                                    onClick={() => {
                                        setDraftPreviewSrc(null);
                                        setDraftFileName(null);
                                    }}
                                >
                                    Gỡ ảnh
                                </button>
                                <button type="button" className="btn-primary" onClick={saveSelectedCard}>
                                    Lưu thay đổi
                                </button>
                            </div>

                            {draftFileName ? <p className="editor-file-name">File: {draftFileName}</p> : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}