describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/')
  })
})
describe("Typoical returning user actions on the app", ()=>{
  beforeEach(() => {
    cy.viewport(1600, 900);
  })
  it("Opens app successfully", () => {
    cy.visit("http://localhost:3000/")
  })
  it("Register, Login, Create game", () => {
    cy.visit('http://localhost:3000/')
    cy.wait(1000)
    cy.get('#registerbtn').should('be.visible').click()
    cy.wait(150)
    // USER EXISTS
    cy.get(':nth-child(3) > input').type("testUsername2")
    cy.get(':nth-child(4) > input').type("test12Email@email.com")
    cy.get(':nth-child(5) > input').type("test12Email@email.com")
    cy.get(':nth-child(6) > input').type("testPassword")
    cy.get(':nth-child(7) > input').type("testPassword")
    cy.get('#registerForm > [type="submit"]').click()
    // NEW USER
    let randomNum = Math.floor(Math.random()*1000)
    cy.get(':nth-child(3) > input').clear().type(`testUsername${randomNum}`)
    cy.get(':nth-child(4) > input').clear().type(`test${randomNum}Email@email.com`)
    cy.get(':nth-child(5) > input').clear().type(`test${randomNum}Email@email.com`)
    cy.get(':nth-child(6) > input').type("testPassword")
    cy.get(':nth-child(7) > input').type("testPassword")
    cy.get('#registerForm > [type="submit"]').click()
    cy.wait(4000)
    cy.get('#loginInput').type("testUsername1")
    cy.get('#passwordInput').type("testPassword")
    cy.get('#loginbtn').click()
    cy.wait(500)
    cy.get('#roominput').type("123")
    cy.get('.is-primary').click()
    cy.get('[style="opacity: 1; transform: translateY(0px) translateZ(0px);"] > .loginContainer > button').click()
    cy.get('form > .react-reveal').click()
  })
  it("Register, Login, Create game", () => {
    cy.visit('http://localhost:3000/')
    cy.get('.leaderboardbtn').click()
  })
  it("Forgot Password", () => {
    cy.visit('http://localhost:3000/')
    cy.get('.pwdcontainer > :nth-child(1)').click()
    cy.get(':nth-child(3) > .fpwdinput').type("testUsername2")
    cy.get(':nth-child(4) > .fpwdinput').type("test12Email@email.com")
    cy.get('.fpwdsubmit').click()
  })
  it("Reset Password", () => {
    cy.visit('http://localhost:3000/')
    cy.get('.pwdcontainer > :nth-child(2)').click()
    cy.get('.closebtn').click()
    cy.get('.pwdcontainer > :nth-child(2)').click()
    cy.get(':nth-child(3) > .rpwdinput').type("testUsername2")
    cy.get(':nth-child(4) > .rpwdinput').type("c7f87jH")
    cy.get(':nth-child(5) > .rpwdinput').type("testPassword")
    cy.get('.rpwdsubmit').click()
  })
})
