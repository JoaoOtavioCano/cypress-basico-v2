/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = 'Ciência da computação é a ciência que estuda as técnicas, metodologias, instrumentos computacionais e aplicações tecnológicas, que informatizem os processos e desenvolvam soluções de processamento de dados de entrada e saída pautados no computador. Não se restringindo apenas ao estudo dos algoritmos, suas aplicações e implementação na forma de software. Assim, a Ciência da Computação também abrange as técnicas de modelagem de dados e gerenciamento de banco de dados, envolvendo também a telecomunicação e os protocolos de comunicação, além de princípios que abrangem outras especializações da área.'

        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Cano')
        cy.get('#email').type('joao@exemplo.com')
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('Enviar').click()

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Cano')
        cy.get('#email').type('joao')
        cy.get('#open-text-area').type('Teste')
        cy.contains('Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('campo de telefone só aceita números', function() {
        cy.get('#phone')
        .type('abcdef')
        .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Cano')
        cy.get('#email').type('joao@exemplo.com')
        cy.get('#open-text-area').type('Teste')
        cy.get('#phone-checkbox').check()
        cy.contains('Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName').type('João').should('have.value', 'João')
        cy.get('#lastName').type('Cano').should('have.value', 'Cano')
        cy.get('#email').type('joao@exemplo.com').should('have.value', 'joao@exemplo.com')
        cy.get('#phone').type('991352419').should('have.value', '991352419')
        cy.get('#firstName').clear().should('have.value', '')
        cy.get('#lastName').clear().should('have.value', '')
        cy.get('#email').clear().should('have.value', '')
        cy.get('#phone').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.contains('Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[value=feedback]')
        .check()
        .should('be.checked')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type=radio]')
        .should('have.length', 3)
        .each(($radio) => {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    it(' marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('#check input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last()
        .uncheck()
        .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
        .selectFile('cypress/fixtures/example.json')
        .should(function(input) {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('#file-upload')
        .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
        .should((input) => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload')
        .selectFile('@sampleFile')
        .should((input) => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()

        cy.contains('CAC TAT - Política de privacidade')
        .should('be.visible', 'CAC TAT - Política de privacidade')
    })

    it('testa a página da política de privacidade de forma independente', function() {
        cy.visit('./src/privacy.html')
        .title()
        .should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
    })
})
  