# Operation First Signal

A standalone H4H Command Center module for Radio Meltdown's station launch and first artist campaign.

## Files
- `FIRST-SIGNAL/index.html` - standalone dashboard
- `api/first-signal.js` - Vercel serverless AI endpoint
- `NAV-LINK-SNIPPET.html` - link to add to the existing H4H home navigation

## Add to the existing repository
1. Download and unzip this package.
2. In your existing `h4h-CommandCenter` GitHub repository, upload the `FIRST-SIGNAL` folder and the `api/first-signal.js` file. Preserve the folders.
3. Open the existing H4H home page and add the snippet from `NAV-LINK-SNIPPET.html` in its navigation area.
4. Commit the changes to the main branch. Do not replace your existing home page or other files.
5. In Vercel, open the project connected to this repository, then Settings -> Environment Variables. Add:
   - `OPENAI_API_KEY` = your OpenAI API key
   - `FIRST_SIGNAL_ACCESS_CODE` = a long, unique access code
   - Optional `OPENAI_MODEL` = `gpt-4.1-mini`
6. Redeploy the project after adding the variables.

## Important limitations
- The dashboard stores assignments, approvals and brief details in the current browser's localStorage. It does not sync across staff devices or users. Use Export backup regularly.
- The access code is a shared gate, not individual authentication. Do not use this as a public-facing product or store sensitive personal information in it.
- The AI endpoint does not perform external actions. It drafts and advises only.
- The AI API requires a separately billed OpenAI API account. A ChatGPT subscription does not include API credits.
- No live repository files are changed by this package. Upload these files manually after reviewing them.
