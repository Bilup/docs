---
title: Deploying
---

# How do I put my mod online?

This guide focuses on deploying **MistWarp** using **Cloudflare Pages**. Support for other providers may be added in the future.


## Prerequisites

Before you begin, ensure the following:

* You have forked MistWarp’s `scratch-gui` repository on GitHub.
* You have a Cloudflare account.
* You have a domain connected to your Cloudflare account.

---

## Deploying with Cloudflare Pages

### Step 1: Set up your project on Cloudflare

Start by [creating a new Pages project from your GitHub repository](https://dash.cloudflare.com/?to=/:account/pages/new/provider/github).

Look for your fork of the `scratch-gui` repository. If you renamed it, it may appear under a different name. Make sure you're viewing the correct GitHub account or organization—Cloudflare needs access to the one where the repository was forked. If it doesn’t appear, you may need to authorize that account or organization in Cloudflare.

Once you select the repository, Cloudflare will begin setting up your project automatically. Just wait for the setup process to complete.

### Step 2: Configure deployment settings

After setup, go to the **Settings** tab of your Pages project and locate the **Branch Control** section.

Adjust the following settings:

* Set the **Production branch** to `gh-pages`.
* Enable **Automatic production branch deployments**.
* Set **Preview branch** to `None`.

---

## Step 3: Deploying from MistWarp

In your terminal, navigate to your local copy of the `scratch-gui` repository and run:

```bash
npm run deploy
```

MistWarp includes a modified deploy script designed for compatibility with Cloudflare Pages. This command will push your latest build to the `gh-pages` branch on your main repository, which Cloudflare will then automatically detect and deploy.

---

## 🎉 Done!

That’s it! Your mod should now be live.

Keep in mind: simply committing changes to your repository will **not** trigger a deployment. You must run `npm run deploy` each time you want to publish updates.