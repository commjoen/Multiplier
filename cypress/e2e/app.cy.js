const start = (operation, extra = {}) => {
  cy.visit('/');
  cy.get('#operation-type').select(operation);
  cy.get('#timer-minutes').clear().type(extra.timer ?? '0');
  if (extra.min) cy.get('#min-multiplier').clear().type(extra.min);
  if (extra.max) cy.get('#max-multiplier').clear().type(extra.max);
  cy.get('#start-button').click();
};

describe('Settings screen', () => {
  beforeEach(() => cy.visit('/'));

  it('loads with default values', () => {
    cy.get('#min-multiplier').should('have.value', '1');
    cy.get('#max-multiplier').should('have.value', '10');
    cy.get('#timer-minutes').should('have.value', '5');
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
