# Submission checklist

## Capture integrity

- [ ] Two independent canary sessions passed
- [ ] `CAPTURE-TEST.md` contains raw canary entries
- [ ] `.agent-logs/` is tracked and contains no secrets
- [ ] Logs were committed throughout the build, not dumped at the end

## Product

- [ ] Seeded meeting library is visible immediately
- [ ] Two-minute meeting flow works end to end
- [ ] One-hour/eight-person case is credible and performant
- [ ] Playback and transcript timestamps stay synchronized
- [ ] Summary templates switch correctly
- [ ] Action items and highlights work
- [ ] Search returns meaningful matches
- [ ] Shared clip opens without authentication
- [ ] Responsive layout and keyboard focus have been checked

## Quality gates

- [ ] Lint passes
- [ ] Typecheck passes
- [ ] Tests pass
- [ ] Production build passes
- [ ] Console has no unexplained errors
- [ ] Major routes have loading, empty, error, and not-found handling

## Delivery

- [ ] Live deployment opens in an incognito/private window
- [ ] Public repository opens while signed out of GitHub
- [ ] Repository includes `.agent-logs/`
- [ ] README explains scope and intentional stubs
- [ ] Camera-on walkthrough is under five minutes
- [ ] Walkthrough covers product judgement and omitted scope
- [ ] Submission links are labeled `Live:` and `Repository:`
