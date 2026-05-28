#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let pdfParse;
try {
    pdfParse = require('pdf-parse');
} catch (error) {
    console.error('Missing dependency pdf-parse. Run npm install before extracting questions.');
    process.exit(1);
}

function parseArgs(argv) {
    const args = {};

    for (let index = 0; index < argv.length; index += 1) {
        const current = argv[index];
        const next = argv[index + 1];

        if (current === '--input' || current === '-i') {
            args.input = next;
            index += 1;
        } else if (current === '--output' || current === '-o') {
            args.output = next;
            index += 1;
        }
    }

    return args;
}

function normalizeText(text) {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\u00a0/g, ' ')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

function createQuestionFromBlock(blockLines) {
    const questionHeader = blockLines.shift();
    const headerMatch = questionHeader.match(/^(\d+)\s*[).:-]?\s*(.*)$/);

    if (!headerMatch) {
        return null;
    }

    const number = Number(headerMatch[1]);
    const promptParts = [headerMatch[2].trim()].filter(Boolean);
    const options = [];
    let correctOptionId = null;
    let explanationParts = [];
    let activeOption = null;

    for (const rawLine of blockLines) {
        const optionMatch = rawLine.match(/^([A-D])\s*[).:-]?\s*(.*)$/i);
        const answerMatch = rawLine.match(/^(?:đáp án|dap an|correct|answer)\s*[:=-]\s*([A-D])$/i);
        const explanationMatch = rawLine.match(/^(?:giải thích|giai thich|explanation)\s*[:=-]\s*(.*)$/i);

        if (answerMatch) {
            correctOptionId = answerMatch[1].toUpperCase();
            activeOption = null;
            continue;
        }

        if (explanationMatch) {
            explanationParts.push(explanationMatch[1].trim());
            activeOption = null;
            continue;
        }

        if (optionMatch) {
            activeOption = {
                id: optionMatch[1].toUpperCase(),
                label: optionMatch[2].trim(),
            };
            options.push(activeOption);
            continue;
        }

        if (options.length > 0 && activeOption) {
            activeOption.label = `${activeOption.label} ${rawLine}`.trim();
        } else if (rawLine) {
            promptParts.push(rawLine);
        }
    }

    return {
        id: `question-${String(number).padStart(3, '0')}`,
        number,
        prompt: promptParts.join(' ').replace(/\s+/g, ' ').trim(),
        options,
        correctOptionId,
        explanation: explanationParts.join(' ').replace(/\s+/g, ' ').trim() || undefined,
        tags: [],
    };
}

function splitIntoBlocks(lines) {
    const blocks = [];
    let currentBlock = [];

    for (const line of lines) {
        if (/^\d+\s*[).:-]/.test(line) && currentBlock.length > 0) {
            blocks.push(currentBlock);
            currentBlock = [line];
        } else {
            currentBlock.push(line);
        }
    }

    if (currentBlock.length > 0) {
        blocks.push(currentBlock);
    }

    return blocks;
}

function validateBank(bank) {
    const errors = [];

    if (!bank || typeof bank !== 'object') {
        return ['Output bank must be an object.'];
    }

    if (!Array.isArray(bank.questions)) {
        errors.push('Output bank.questions must be an array.');
        return errors;
    }

    const ids = new Set();
    for (const question of bank.questions) {
        if (!question.id) {
            errors.push('A question is missing id.');
        }

        if (ids.has(question.id)) {
            errors.push(`Duplicate question id found: ${question.id}`);
        }

        ids.add(question.id);

        if (!question.correctOptionId) {
            errors.push(`Question ${question.id} is missing correctOptionId.`);
        }

        if (!Array.isArray(question.options) || question.options.length < 2) {
            errors.push(`Question ${question.id} must have at least two options.`);
        }

        if (!question.options.some((option) => option.id === question.correctOptionId)) {
            errors.push(`Question ${question.id} has an invalid correctOptionId.`);
        }
    }

    return errors;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));

    if (!args.input || !args.output) {
        console.error('Usage: node scripts/extract-questions-from-pdf.js --input <source.pdf> --output <questions.json>');
        process.exit(1);
    }

    const inputPath = path.resolve(process.cwd(), args.input);
    const outputPath = path.resolve(process.cwd(), args.output);

    if (!fs.existsSync(inputPath)) {
        console.error(`Input PDF not found: ${inputPath}`);
        process.exit(1);
    }

    const pdfBuffer = fs.readFileSync(inputPath);
    const parsedPdf = await pdfParse(pdfBuffer);
    const lines = normalizeText(parsedPdf.text);
    const blocks = splitIntoBlocks(lines);
    const questions = blocks
        .map((blockLines) => createQuestionFromBlock([...blockLines]))
        .filter(Boolean);

    const bank = {
        version: '1.0.0',
        source: path.basename(inputPath),
        questions,
    };

    const validationErrors = validateBank(bank);
    if (validationErrors.length > 0) {
        console.error('Validation failed:');
        for (const error of validationErrors) {
            console.error(`- ${error}`);
        }
        process.exit(1);
    }

    if (questions.length !== 270) {
        console.error(`Expected 270 questions, but extracted ${questions.length}.`);
        process.exit(1);
    }

    fs.writeFileSync(outputPath, `${JSON.stringify(bank, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${questions.length} questions to ${outputPath}`);
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
});