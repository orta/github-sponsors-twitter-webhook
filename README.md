This repo is an Azure Function which will automatically Twitter follow anyone who sponsors an account.

You need a Sponsor webhook:
 - https://github.com/sponsors/orta/dashboard/webhooks/

Then a GitHub auth token for `process.env.GITHUB_AUTH_TOKEN`

Then you need a twitter application, see:
- https://developer.twitter.com/en/apps

If you have something, use the client key and secret with [this gist](https://gist.github.com/tanepiper/575303) to create these four env vars:

- `process.env.TWITTER_CONSUMER_KEY`
- `process.env.TWITTER_CONSUMER_SECRET`
- `process.env.TWITTER_TOKEN_KEY`
- `process.env.TWITTER_TOKEN_SECRET`

Then push your function to Azure, set all those env vars and you should be good to go.

You can upload via the vscode extension.
