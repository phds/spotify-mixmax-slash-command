# Spotify Slash Command for Mixmax

This is an open source Spotify Slash Command for Mixmax. This addon works by using the spotify search API, and then generating the html that will go into the email.

### Running on Mixmax

To enable this addon on your Mixmax account (assuming you already have it set up), go to your [Mixmax Dashboard](http://sdk.mixmax.com/docs/the-mixmax-dashboard) and lick Settings -> Integrations -> Add Enhancement. Then on the slash commands section, click add integration, and then enter the following inputs:

 - Name: Spotify Search
 - Command: spotifysearch
 - Parameter placeholder: [Search]
 - Typeahead API URL: https://spotify-mixmax-slash-command.herokuapp.com/api/suggestions
 - Resolver API URL: https://spotify-mixmax-slash-command.herokuapp.com/api/resolver

Finally restart Gmail with Mixmax installed. Click compose and then type in ```/spotifysearch``` followed by a song title or artist name and select a song to send in your email!
### Running locally
To run this project locally, first of follow the [tutorial](http://sdk.mixmax.com/docs/chrome-insecure-content-https-request-blocked-when-developing-locally) to run chrome in "insecure" mode. Then install using ```npm install``` and then ```npm start``` to run. Optionally, you can run ```npm test``` to run the tests.
