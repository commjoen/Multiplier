const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..', '..');
const translations = JSON.parse(fs.readFileSync(path.join(root, 'translations.json'), 'utf8'));

const context = vm.createContext({
    console,
    document: { addEventListener() {} },
    window: { addEventListener() {} },
    navigator: {},
    localStorage: { getItem: () => null, setItem() {} },
    setTimeout,
    fetch: () => Promise.reject(new Error('fetch disabled'))
});
vm.runInContext(fs.readFileSync(path.join(root, 'script.js'), 'utf8'), context);
const MultiplicationApp = vm.runInContext('MultiplicationApp', context);

function review(exercise, lang = 'en') {
    const app = Object.create(MultiplicationApp.prototype);
    app.currentLanguage = lang;
    app.translations = translations;
    return app.getReviewInfo(exercise);
}

const strip = html => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

test('multiplication review', () => {
    const r = review({ operation: 'multiplication', num1: 6, num2: 7, answer: 42, userAnswer: 40 });
    assert.equal(r.questionText, '6 × 7 = 42');
    assert.equal(r.answerText, 'Your answer: 40');
});

test('division review', () => {
    const r = review({ operation: 'division', num1: 42, num2: 6, answer: 7, userAnswer: 7 });
    assert.equal(r.questionText, '42 ÷ 6 = 7');
});

test('addition review', () => {
    assert.equal(review({ operation: 'addition', num1: 3, num2: 4, answer: 7, userAnswer: 7 }).questionText, '3 + 4 = 7');
});

test('subtraction review', () => {
    assert.equal(review({ operation: 'subtraction', num1: 9, num2: 4, answer: 5, userAnswer: 5 }).questionText, '9 − 4 = 5');
});

test('a user answer of 0 is shown instead of "No answer"', () => {
    const r = review({ operation: 'subtraction', num1: 5, num2: 5, answer: 0, userAnswer: 0 });
    assert.equal(r.answerText, 'Your answer: 0');
});

test('unanswered exercises show "No answer" in each language', () => {
    for (const lang of ['en', 'nl', 'de']) {
        const r = review({ operation: 'multiplication', num1: 2, num2: 3, answer: 6, userAnswer: null }, lang);
        assert.equal(r.answerText, `${translations[lang].yourAnswer} ${translations[lang].noAnswer}`);
    }
});

test('cijferen review', () => {
    const r = review({ operation: 'cijferenPlus', num1: 12, num2: 30, operator: '+', answer: 42, userAnswer: 42 });
    assert.equal(r.questionText, '12 + 30 = 42');
    assert.equal(r.answerText, 'Your answer: 42');
    assert.equal(review({ operation: 'cijferenMultiply', num1: 12, num2: 3, operator: '×', answer: 36, userAnswer: null }).answerText,
        'Your answer: No answer');
});

test('fractionSimplify review', () => {
    const r = review({ operation: 'fractionSimplify', startNum: 6, startDen: 8, targetDen: 4, answer: 3, userAnswer: 2 });
    assert.equal(strip(r.questionText), '6 8 = 3 4');
    assert.equal(r.answerText, 'Your answer: 2');
});

test('fractionAddSub review', () => {
    const r = review({ operation: 'fractionAddSub', isAddition: true, num1: 1, den1: 2, num2: 1, den2: 3, answer: '5/6', userAnswer: '5/6' });
    assert.equal(strip(r.questionText), '1 2 + 1 3 = 5/6');
    const s = review({ operation: 'fractionAddSub', isAddition: false, num1: 1, den1: 2, num2: 1, den2: 3, answer: '1/6', userAnswer: null });
    assert.equal(strip(s.questionText), '1 2 - 1 3 = 1/6');
    assert.equal(s.answerText, 'Your answer: No answer');
});

test('fractionMultiply review', () => {
    const r = review({ operation: 'fractionMultiply', num1: 1, den1: 2, num2: 2, den2: 3, answer: '1/3', userAnswer: '1/3' });
    assert.equal(strip(r.questionText), '1 2 × 2 3 = 1/3');
});

test('fractionVisual review', () => {
    const r = review({ operation: 'fractionVisual', numerator: 3, denominator: 5, answer: '3/5', userAnswer: '3/5' });
    assert.equal(r.questionText, 'Visual fraction: 3/5');
    assert.equal(r.answerText, 'Your answer: 3/5');
});

const geometryCases = [
    ['triangle', 'perimeter', { a: 3, b: 4, c: 5 }, 12, '3 + 4 + 5 = 12 cm', 'Triangle'],
    ['triangle', 'area', { base: 6, height: 7 }, 21, '(6 × 7) ÷ 2 = 21 cm²', 'Triangle'],
    ['square', 'perimeter', { side: 5 }, 20, '4 × 5 = 20 cm', 'Square'],
    ['square', 'area', { side: 5 }, 25, '5 × 5 = 25 cm²', 'Square'],
    ['trapezoid', 'perimeter', { a: 2, b: 3, c: 4, d: 5 }, 14, '2 + 3 + 4 + 5 = 14 cm', 'Trapezoid'],
    ['trapezoid', 'area', { a: 2, b: 4, height: 5 }, 15, '((2 + 4) × 5) ÷ 2 = 15 cm²', 'Trapezoid'],
    ['parallelogram', 'perimeter', { base: 6, side: 4 }, 20, '2 × (6 + 4) = 20 cm', 'Parallelogram'],
    ['parallelogram', 'area', { base: 6, side: 4, height: 3 }, 18, '6 × 3 = 18 cm²', 'Parallelogram'],
    ['circle', 'perimeter', { radius: 5 }, 31.42, '2 × π × 5 ≈ 31.42 cm', 'Circle'],
    ['circle', 'area', { radius: 5 }, 78.54, 'π × 5 × 5 ≈ 78.54 cm²', 'Circle']
];

for (const [shape, kind, dimensions, answer, formula, name] of geometryCases) {
    test(`geometry review: ${shape} ${kind}`, () => {
        const r = review({ operation: 'geometry', shape, kind, dimensions, answer, userAnswer: answer + 1 });
        const text = strip(r.questionText.replace('<br>', ' | '));
        assert.ok(text.startsWith(name), text);
        assert.ok(text.endsWith(formula), `${text} should end with ${formula}`);
        const unit = kind === 'area' ? 'cm²' : 'cm';
        assert.equal(r.answerText, `Your answer: ${answer + 1} ${unit}`);
        assert.ok(!/undefined|NaN/.test(r.questionText + r.answerText));
    });
}

test('geometry review: unanswered and translated', () => {
    const ex = { operation: 'geometry', shape: 'square', kind: 'area', dimensions: { side: 4 }, answer: 16, userAnswer: null };
    assert.equal(review(ex).answerText, 'Your answer: No answer');
    const nl = review(ex, 'nl');
    assert.match(nl.questionText, /Vierkant/);
    assert.match(nl.questionText, /oppervlakte/);
    assert.equal(nl.answerText, 'Jouw antwoord: Geen antwoord');
    const de = review({ ...ex, userAnswer: 16 }, 'de');
    assert.match(de.questionText, /Quadrat/);
    assert.match(de.questionText, /Fläche/);
});

test('generated geometry exercises always produce a complete review', () => {
    const app = Object.create(MultiplicationApp.prototype);
    app.currentLanguage = 'en';
    app.translations = translations;
    app.minMultiplier = 2;
    app.maxMultiplier = 9;
    for (let i = 0; i < 300; i++) {
        const ex = app.generateGeometryExercise(i);
        ex.userAnswer = ex.answer;
        const { questionText } = app.getReviewInfo(ex);
        assert.ok(questionText.includes(`${ex.answer} ${ex.kind === 'area' ? 'cm²' : 'cm'}`));
        assert.ok(!/undefined|NaN/.test(questionText));
    }
});
