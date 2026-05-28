const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', '270hcm.md');
const outPath = path.join(__dirname, '..', 'public', 'questions.json');

const text = fs.readFileSync(srcPath, 'utf8');

function splitBlocks(text) {
    // split on one or more blank lines (support CRLF)
    return text.split(/\r?\n\s*\r?\n/).map(s => s.trim()).filter(Boolean);
}

function parseBlock(block) {
    const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
    // find answer line
    const ansIdx = lines.findIndex(l => /^Đáp án đúng[:：]/i.test(l));
    if (ansIdx === -1) return null;
    const answerText = lines[ansIdx].replace(/^Đáp án đúng[:：]\s*/i, '').trim();
    const questionLines = lines.slice(0, 1); // prefer first line as prompt
    const optionLines = lines.slice(1, ansIdx);

    // If options are not on separate lines (e.g., merged), try to split by common separators
    let options = optionLines.slice();
    if (options.length <= 1) {
        const merged = optionLines.join(' ');
        // split on patterns like 'A) ', or capitalized options, or multiple two-spaces
        const parts = merged.split(/\s{2,}|\s[A-Z]\.|\s[A-Z]\)|\n/).map(s => s.trim()).filter(Boolean);
        if (parts.length >= 2) options = parts;
    }

    // Ensure at least 2 options
    if (options.length === 0) {
        // try to extract options from the question line after a question mark
        const q = lines[0];
        const after = q.split('?');
        if (after.length > 1) {
            const rest = after.slice(1).join('?').trim();
            const parts = rest.split(/\s{2,}|;|,/).map(s => s.trim()).filter(Boolean);
            if (parts.length >= 2) options = parts;
        }
    }

    // Build options objects with letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const optionObjs = options.map((opt, i) => ({ id: letters[i] || String(i + 1), label: opt }));

    // find correct option by matching answerText to option label
    let correct = null;
    for (const o of optionObjs) {
        if (!o.label) continue;
        if (o.label.includes(answerText) || answerText.includes(o.label)) { correct = o.id; break; }
    }
    // fallback: find option whose normalized text equals normalized answer
    if (!correct) {
        const normAns = answerText.toLowerCase().replace(/[^a-z0-9áàảãạăắằẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/gi, '').trim();
        for (const o of optionObjs) {
            const normO = (o.label || '').toLowerCase().replace(/[^a-z0-9áàảãạăắằẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/gi, '').trim();
            if (normO && normAns && normO === normAns) { correct = o.id; break; }
        }
    }

    const prompt = questionLines.join(' ').trim();
    return { prompt, options: optionObjs, correctOptionId: correct };
}

// More robust block splitting: accumulate lines until an answer line is encountered
const rawLines = text.split(/\r?\n/);
const blocks = [];
let acc = [];
for (const line of rawLines) {
    const t = line.trim();
    if (!t && acc.length === 0) continue; // skip leading empty lines
    if (/^Đáp án đúng[:：]/i.test(t)) {
        acc.push(t);
        blocks.push(acc.join('\n'));
        acc = [];
    } else {
        acc.push(t);
    }
}
// handle leftovers (if any)
if (acc.length > 0) blocks.push(acc.join('\n'));
const questions = [];
let qnum = 1;
for (const b of blocks) {
    const parsed = parseBlock(b);
    if (!parsed) continue;
    const q = {
        id: `q-${String(qnum).padStart(3, '0')}`,
        number: qnum,
        prompt: parsed.prompt,
        options: parsed.options,
        correctOptionId: parsed.correctOptionId,
        tags: []
    };
    questions.push(q);
    qnum++;
}

const out = { version: '1.0.0', source: '270hcm.md', questions };
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
console.log(`Wrote ${questions.length} questions to ${outPath}`);
