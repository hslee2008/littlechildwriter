describe('Posting New Testing Content', () => {
  it('Login', () => {
    cy.visit('http://localhost:3000/account/login')
    cy.get('.email').type('asdf@asdf.com')
    cy.get('.password').type('asdfasdf')
    cy.get('.login-button').click()
  })

  it('Create New Post', () => {
    cy.visit('http://localhost:3000/book/post')
    cy.get('.title').type('Test Title')
    cy.get('.author').type('Test Author')
    cy.get('.page').type('314')
    cy.get('.content').type('Test Content')
    cy.get('.upload').click()
  })

  it('passes', () => {})
})
