@ignore
Feature: Login helper

  Scenario:
    * url baseUrl
    * path '/auth/login'
    * request { username: 'testuser', password: 'password' }
    * method POST
    * status 200
    * def token = response.token
