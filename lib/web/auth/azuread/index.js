'use strict'

const Router = require('express').Router
const passport = require('passport')
const AzureAdStrategy = require('passport-azure-ad').OIDCStrategy
const config = require('../../../config')
const response = require('../../../response')
const {setReturnToFromReferer, passportGeneralCallback} = require('../utils')

let githubAuth = module.exports = Router()

passport.use(new AzureAdStrategy({
  clientID: config.azuread.clientID,
  responseType: 'id_token',
  responseMode: 'form_post',
  redirectUrl: config.serverURL + '/auth/azuread/callback',
  passReqToCallback: false
  //clientSecret: 'seems to be optional for id_token'
}, passportGeneralCallback))

githubAuth.get('/auth/azuread', function (req, res, next) {
  setReturnToFromReferer(req)
  passport.authenticate('github')(req, res, next)
})

// github auth callback
githubAuth.get('/auth/azuread/callback',
  passport.authenticate('github', {
    successReturnToOrRedirect: config.serverURL + '/',
    failureRedirect: config.serverURL + '/'
  })
)

// github callback actions
githubAuth.get('/auth/azuread/callback/:noteId/:action', response.githubActions)
