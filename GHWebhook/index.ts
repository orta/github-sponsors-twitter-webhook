import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Octokit } from "@octokit/rest";
import { EventPayloads } from "@octokit/webhooks";
import Twitter from "twitter";

type SponsorActions =
  | "created"
  | "cancelled"
  | "edited"
  | "tier_changed"
  | "pending_cancellation"
  | "pending_tier_change";

const githubAccessToken = process.env.GITHUB_AUTH_TOKEN;
if (!githubAccessToken) throw new Error("GH Auth Token not set up");

const twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const twitterTokenKey = process.env.TWITTER_TOKEN_KEY;
const twitterTokenSecret = process.env.TWITTER_TOKEN_SECRET;

if (!twitterConsumerKey || !twitterConsumerSecret || !twitterTokenKey || !twitterTokenSecret)
  throw new Error("Twitter not set up");

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const webhook = req.body as EventPayloads.WebhookPayloadSponsorship;
  const action = webhook.action as SponsorActions;

  if (action === "created") {
    const api = new Octokit({ auth: githubAccessToken });
    const fullUserProfile = await api.users.getByUsername({ username: webhook.sender.login });
    const twitter = fullUserProfile.data.twitter_username;
    
    if (twitter) {
      const twitterAPI = new Twitter({
        consumer_key: twitterConsumerKey,
        consumer_secret: twitterConsumerSecret,
        access_token_key: twitterTokenKey,
        access_token_secret: twitterTokenSecret,
      });

      const result = await twitterAPI.post("/friendships/create", { screen_name: twitter });
      context.res = {
        status: 200,
        body: JSON.stringify({ text: "Added", user: result }),
      };
    }
  }

  context.res = {
    status: 200,
    body: "NOOP",
  };
};

export default httpTrigger;
