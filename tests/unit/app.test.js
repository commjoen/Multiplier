const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..', '..');
const translations = JSON.parse(fs.readFileSync(path.join(root, 'translations.json'), 'utf8'));

function loadApp() {
    const context = vm.createContext({
        console,
        document: { addEventListener() {} },
        window: { addEventListener() {} },
        navigator: {},
        localStorage: { getItem: () => null, setItem() {} },
        setTimeout,
        fetch: () => Promise.reject(new Error('fetch disabled in unit tests'))
    });
    vm.runInContext(fs.readFileSync(path.join(root, 'script.js'), 'utf8'), context);
    return vm.runInContext('MultiplicationApp', context);
}

const MultiplicationApp = loadApp();

function createApp(overrides = {}) {
    const app = Object.create(MultiplicationApp.prototype);
    app.currentLanguage = 'en';
    app.translations = translations;
    app.minMultiplier = 1;
    app.maxMultiplier = 10;
    return Object.assign(app, overrides);
}

test('getRandomNumber stays within bounds', () => {
    const app = createApp();
    for (let i = 0; i < 200; i++) {
        const n = app.getRandomNumber(3, 7);
        assert.ok(Number.isInteger(n) && n >= 3 && n <= 7);
    }
});

test('validateRanges raises max to match min', () => {
    const app = createApp({
        minMultiplierInput: { value: '8' },
        maxMultiplierInput: { value: '3' }
    });
    app.validateRanges();
    assert.equal(app.maxMultiplierInput.value, 8);
});

test('t() translates and falls back to the key', () => {
    const app = createApp({ currentLanguage: 'nl' });
    assert.equal(app.t('square'), translations.nl.square);
    assert.equal(app.t('unknown-key'), 'unknown-key');
});

test('every language defines the geometry translation keys', () => {
    const keys = ['geometry', 'measurements', 'perimeter', 'area', 'calculate',
        'triangle', 'square', 'trapezoid', 'parallelogram', 'circle', 'circumference'];
    for (const lang of ['en', 'nl', 'de']) {
        for (const key of keys) {
            assert.ok(translations[lang][key], `${lang} is missing "${key}"`);
        }
    }
});

test('generateGeometryExercise produces correct answers', () => {
    const app = createApp({ minMultiplier: 2, maxMultiplier: 9 });
    const seen = new Set();
    for (let i = 0; i < 500; i++) {
        const ex = app.generateGeometryExercise(i);
        const d = ex.dimensions;
        seen.add(`${ex.shape}-${ex.kind}`);

        let expected;
        switch (`${ex.shape}-${ex.kind}`) {
            case 'triangle-perimeter':
                expected = d.a + d.b + d.c;
                assert.ok(d.a + d.b > d.c && d.a + d.c > d.b && d.b + d.c > d.a, 'valid triangle');
                break;
            case 'triangle-area': expected = d.base * d.height / 2; break;
            case 'square-perimeter': expected = 4 * d.side; break;
            case 'square-area': expected = d.side * d.side; break;
            case 'trapezoid-perimeter': expected = d.a + d.b + d.c + d.d; break;
            case 'trapezoid-area': expected = (d.a + d.b) * d.height / 2; break;
            case 'parallelogram-perimeter': expected = 2 * (d.base + d.side); break;
            case 'parallelogram-area': expected = d.base * d.height; break;
            case 'circle-perimeter': expected = 2 * Math.PI * d.radius; break;
            case 'circle-area': expected = Math.PI * d.radius * d.radius; break;
            default: assert.fail(`unexpected ${ex.shape}-${ex.kind}`);
        }
        assert.equal(ex.answer, Number(expected.toFixed(2)));
        assert.equal(ex.operation, 'geometry');
    }
    assert.equal(seen.size, 10, 'all shape/kind combinations are generated');
});

test('renderGeometryFigure labels every measurement in cm', () => {
    const app = createApp();
    const cases = [
        { shape: 'triangle', kind: 'perimeter', dimensions: { a: 3, b: 4, c: 5 } },
        { shape: 'triangle', kind: 'area', dimensions: { base: 6, height: 7 } },
        { shape: 'square', kind: 'area', dimensions: { side: 8 } },
        { shape: 'trapezoid', kind: 'perimeter', dimensions: { a: 2, b: 3, c: 4, d: 5 } },
        { shape: 'trapezoid', kind: 'area', dimensions: { a: 2, b: 3, height: 9 } },
        { shape: 'parallelogram', kind: 'perimeter', dimensions: { base: 6, side: 4 } },
        { shape: 'parallelogram', kind: 'area', dimensions: { base: 6, side: 4, height: 3 } },
        { shape: 'circle', kind: 'area', dimensions: { radius: 5 } }
    ];
    for (const ex of cases) {
        const svg = app.renderGeometryFigure(ex);
        assert.match(svg, /<svg class="geometry-figure"/);
        const labels = [...svg.matchAll(/>(\d+) cm<\/text>/g)].map(m => Number(m[1])).sort((a, b) => a - b);
        const expected = Object.values(ex.dimensions).sort((a, b) => a - b);
        assert.deepEqual(labels, expected, `${ex.shape}/${ex.kind} labels`);
    }
});

test('area unit is written as cm² (no mojibake)', () => {
    const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
    assert.ok(source.includes("'cm²'"));
    assert.ok(!source.includes('cmÂ²'));
});

test('updateProgress counts answered exercises', () => {
    const app = createApp({
        exercises: [{ userAnswer: 1 }, { userAnswer: null }, { userAnswer: 2 }],
        totalExercises: 3,
        progressDisplay: { textContent: '' }
    });
    app.updateProgress();
    assert.equal(app.progressDisplay.textContent, '2/3');
});
