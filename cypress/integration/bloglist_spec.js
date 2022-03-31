describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Tatu Nordström',
      username: 'tatuno',
      password: 'salasana'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('Login').click()
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('tatuno')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('Tatu Nordström logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('tatuno')
      cy.get('#password').type('väärä')
      cy.get('#login-button').click()

      cy.contains('invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Tatu Nordström logged in')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'tatuno', password: 'salasana' })
      })

      it('A blog can be created', function() {
        cy.contains('new post').click()
        cy.get('#author').type('kirjoittaja')
        cy.get('#title').type('otsikko')
        cy.get('#url').type('www.url.com')

        cy.get('#createblog').click()
        cy.contains('a new blog otsikko by kirjoittaja added')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
      })

      describe('when a blog exists', function () {
        beforeEach(function () {
          cy.createBlog({ author: 'kirjoittaja', title:'otsikko', url: 'www.url.com' })
          cy.createBlog({ author: 'liirum', title:'laarum', url: 'www.jees.com' })
          cy.createBlog({ author: 'lorem', title:'ipsum', url: 'www.dolor.com' })
        })

        it('A blog can be liked', function() {
          cy.contains('otsikko kirjoittaja')
            .contains('view').click()

          cy.contains('like').click()
          cy.contains('likes 1')
        })

        it('A blog can be deleted by user who added a blog', function () {
          cy.contains('otsikko kirjoittaja')
            .contains('view').click()

          cy.contains('remove').click()
          cy.contains('a blog otsikko by kirjoittaja removed')
            .and('have.css', 'color', 'rgb(0, 128, 0)')
          cy.get('html').should('not.contain', 'otsikko kirjoittaja')
        })

        it('blogs are in orded by likes, most likes on top', function () {
          cy.contains('ipsum lorem')
            .contains('view').click()
          cy.contains('like').click()
          cy.contains('like').click()
          cy.contains('hide').click()

          cy.contains('laarum liirum')
            .contains('view').click()
          cy.contains('like').click()
          cy.contains('hide').click()

          cy.get('#blogdiv').children().then( blogs => {
            cy.wrap(blogs[0])
              .should('contain', 'ipsum lorem')

            //cy.wrap(blogs[1])
              //.should('contain', 'laarum liirum')

            cy.wrap(blogs[2])
              .should('contain', 'otsikko kirjoittaja')
          })
        })
      })
    })
  })
})
