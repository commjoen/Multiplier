const start = (operation, extra = {}) => {
  cy.visit('/');
  cy.get('#operation-type').select(operation);
  cy.get('#timer-minutes').clear().type(extra.timer ?? '0');
  if (extra.min) cy.get('#min-multiplier').clear().type(extra.min);
  if (extra.max) cy.get('#max-multiplier').clear().type(extra.max);
  cy.get('#start-button').click();
};

describe('Settings screen', () => {
  beforeEach(() => cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.removeItem('multiplicationSettings');
    }
  }));

  it('loads with default values', () => {
    cy.get('#min-multiplier').should('have.value', '1');
    cy.get('#max-multiplier').should('have.value', '10');
    cy.get('#timer-minutes').should('have.value', '0');
    cy.get('#total-exercises').should('have.value', '20');
  });

  it('switches language', () => {
    cy.get('#language-select').select('nl');
    cy.title().should('eq', 'Rekenen Oefening');
    cy.get('#language-select').select('de');
    cy.title().should('eq', 'Mathematik Übung');
  });

  it('persists settings across reloads', () => {
    cy.get('#min-multiplier').clear().type('2');
    cy.get('#max-multiplier').clear().type('8');
    cy.get('#start-button').click();
    cy.get('#back-to-settings').click();
    cy.reload();
    cy.get('#min-multiplier').should('have.value', '2');
    cy.get('#max-multiplier').should('have.value', '8');
  });
});

describe('Multiplication practice', () => {
  it('shows 20 exercises, accepts an answer and shows results', () => {
    start('multiplication');
    cy.get('.exercise-item').should('have.length', 20);
    cy.get('#timer-display').should('contain', '∞');
    cy.get('.exercise-input').first().type('1');
    cy.get('#progress').should('contain', '1/20');
    cy.get('#finish-button').click();
    cy.get('#results-screen').should('have.class', 'active');
    cy.get('#final-score').should('contain', '/20');
    cy.get('#restart-button').click();
    cy.get('#settings-screen').should('have.class', 'active');
  });
});

describe('Geometry practice', () => {
  it('trains only selected shapes and remembers the selection', () => {
    cy.visit('/');
    cy.get('#operation-type').select('geometry');
    cy.get('#triangle, #trapezoid, #parallelogram, #circle').uncheck({ multiple: true });
    cy.get('#square').should('be.checked');
    cy.get('#timer-minutes').clear().type('0');
    cy.get('#start-button').click();
    cy.get('.geometry-figure').should('have.length', 20);
    cy.get('.geometry-figure').each($figure => {
      expect($figure.attr('aria-label')).to.contain('Square');
    });

    cy.get('#back-to-settings').click();
    cy.reload();
    cy.get('#geometry-settings').should('be.visible');
    cy.get('#square').should('be.checked');
    cy.get('#triangle, #trapezoid, #parallelogram, #circle').should('not.be.checked');
  });

  it('requires at least one selected shape', () => {
    cy.visit('/');
    cy.get('#operation-type').select('geometry');
    cy.get('#triangle, #square, #trapezoid, #parallelogram, #circle').uncheck({ multiple: true });
    cy.get('#start-button').click();
    cy.get('#geometry-selection-error').should('be.visible');
    cy.get('#settings-screen').should('have.class', 'active');
  });

  it('renders a labelled figure and cm²/cm units for every exercise', () => {
    start('geometry', { min: '2', max: '9' });
    cy.get('.geometry-mode').should('have.length', 20);
    cy.get('.geometry-figure').should('have.length', 20);
    cy.get('.geometry-figure').each($svg => {
      expect($svg.find('text').length).to.be.greaterThan(0);
      $svg.find('text').each((_, t) => expect(t.textContent).to.match(/^\d+ cm$/));
    });
    cy.get('.geometry-unit').each($u => {
      expect($u.text().trim()).to.match(/^\((cm|cm²)\)$/);
    });
    cy.get('body').should('not.contain', 'Â²');
  });

  it('translates figure descriptions', () => {
    cy.visit('/');
    cy.get('#language-select').select('nl');
    cy.get('#operation-type').select('geometry');
    cy.get('#timer-minutes').clear().type('0');
    cy.get('#start-button').click();
    cy.get('.geometry-figure').first().should('have.attr', 'aria-label').and('contain', 'afmetingen');
  });
});

describe('Percentage conversions', () => {
  it('lets you adjust and saves the minimum number and fraction values', () => {
    cy.visit('/');
    cy.get('#operation-type').select('percentage');
    cy.get('#percentage-settings').should('be.visible');
    cy.get('#minimum-number-value').clear().type('0.4');
    cy.get('#minimum-fraction-value').clear().type('1/8');
    cy.get('#start-button').click();
    cy.get('.exercise-item').should('have.length', 20);
    cy.get('.percentage-question').each($question => {
      const $fraction = $question.find('.fraction');
      const source = $question.find('strong').text();
      const value = $fraction.length
        ? Number($fraction.find('sup').text()) / Number($fraction.find('sub').text())
        : Number(source.replace('%', '')) / (source.includes('%') ? 100 : 1);
      const minimum = $question.text().includes('number') ? 0.4 : 0.125;
      expect(value).to.be.at.least(minimum);
      if ($fraction.length) {
        expect(Number($fraction.find('sub').text())).to.be.at.most(8);
      }
    });
    cy.get('#back-to-settings').click();
    cy.reload();
    cy.get('#percentage-settings').should('be.visible');
    cy.get('#minimum-number-value').should('have.value', '0.4');
    cy.get('#minimum-fraction-value').should('have.value', '1/8');
  });

  it('presents all conversion directions and accepts a fraction answer', () => {
    start('percentage');
    cy.get('.exercise-item').should('have.length', 20);
    cy.get('.percentage-input').should('have.length', 20);
    cy.get('.exercise-question').then($questions => {
      const prompts = [...$questions].map(question => question.textContent.toLowerCase());
      for (const [from, to] of [
        ['percentage', 'fraction'],
        ['fraction', 'percentage'],
        ['number', 'fraction'],
        ['fraction', 'number'],
        ['percentage', 'number'],
        ['number', 'percentage']
      ]) {
        expect(prompts.some(prompt => prompt.includes(from) && prompt.includes(to))).to.equal(true);
      }
    });

    cy.get('.exercise-item').first().within(() => {
      cy.get('.exercise-question strong').invoke('text').then(source => {
        const scaledValue = Math.round(Number(source.replace('%', '')) * 100);
        const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
        const divisor = gcd(scaledValue, 10000);
        const expected = `${scaledValue / divisor}/${10000 / divisor}`;
        cy.get('.percentage-input').type(expected);
      });
      cy.get('.exercise-status').should('have.class', 'correct');
    });
    cy.get('#progress').should('contain', '1/20');
  });
});

describe('Answer review screen', () => {
  const finish = () => {
    cy.get('#finish-button').click();
    cy.get('#results-screen').should('have.class', 'active');
  };

  it('shows operands, operator and answer for multiplication', () => {
    start('multiplication', { min: '2', max: '9' });
    finish();
    cy.get('.result-item').should('have.length', 20);
    cy.get('.result-question').each($q => {
      expect($q.text().trim()).to.match(/^\d+ × \d+ = \d+$/);
    });
    cy.get('.result-answer').first().should('contain', 'No answer');
  });

  it('shows the formula, result and unit for geometry', () => {
    start('geometry', { min: '2', max: '9' });
    finish();
    cy.get('.result-item').should('have.length', 20);
    cy.get('.result-question').each($q => {
      const text = $q.text();
      expect(text).to.not.match(/undefined|NaN/);
      expect(text).to.match(/(Triangle|Square|Trapezoid|Parallelogram|Circle)/);
      expect(text).to.match(/[=≈] [\d.]+ (cm|cm²)$/);
    });
    cy.get('.result-answer').first().should('contain', 'No answer');
  });

  it('shows the entered geometry answer with its unit', () => {
    start('geometry', { min: '2', max: '9' });
    cy.get('.exercise-input').first().type('1');
    finish();
    cy.get('.result-answer').first().invoke('text').should('match', /^Your answer: 1 (cm|cm²)$/);
  });

  it('shows translated geometry review text', () => {
    cy.visit('/');
    cy.get('#language-select').select('nl');
    cy.get('#operation-type').select('geometry');
    cy.get('#timer-minutes').clear().type('0');
    cy.get('#start-button').click();
    finish();
    cy.get('.result-answer').first().should('contain', 'Geen antwoord');
    cy.get('.result-question').first().invoke('text')
      .should('match', /(Driehoek|Vierkant|Trapezium|Parallellogram|Cirkel)/);
  });
});
