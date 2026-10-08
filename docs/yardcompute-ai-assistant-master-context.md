# YardCompute AI Assistant — Master Project Context

## Purpose
This file is the long-term operating memory/brief for an AI assistant that helps maintain YardCompute across conversations. It must preserve project history, completed work, mistakes, constraints, pending work, and the current roadmap so work does not restart from zero.

## Project
- Brand/domain: YardCompute / https://yardcompute.com
- Audience: US homeowners, DIYers, and contractors.
- Language: US English.
- Primary units: Imperial; metric conversion is supported.
- Main product: practical home/yard project calculators plus guides.
- Repository: Shafi1435/yardcompute
- Branch: main
- Hosting/deployment: Cloudflare with Git/GitHub deployment.
- Analytics: GA4.
- Search performance: Google Search Console.

## User working style
- User is a complete beginner at website development.
- Assistant should handle planning/technical work wherever possible.
- User should only be asked to do account/permission/browser actions that the assistant cannot safely do.
- User wants simple step-by-step instructions for user-side actions.
- Avoid repeatedly asking “next?”; assume user is ready to continue unless a real decision is required.
- Keep a clear roadmap and explicitly mark items DONE, PENDING, BLOCKED, or NOT STARTED.
- Do not abandon unfinished roadmap items because a new issue appears.
- Avoid unnecessary edits to a stable site.
- User does not want to edit code manually when avoidable because mistakes are likely.
- Main goal: build a professional, useful, trustworthy site that can rank and later monetize without creating avoidable Google/policy problems.

## Original build direction
Initial blueprint:
- Next.js/TypeScript/Tailwind concept, Cloudflare Pages/Workers, Cloudflare DNS/CDN.
- No database initially; calculators are client-side.
- Launch small, then expand.
- Standard calculator pages should have accurate formulas, examples, assumptions, FAQs, related tools, internal links, sitemap, robots, canonicals, GSC and GA4.

## Major history / mistakes to remember
1. Early Cloudflare/GitHub setup had permission/confusion. GitHub Cloudflare app was eventually installed correctly. Do not uninstall/suspend/reconfigure working integration casually.
2. Cloudflare UI caused confusion around country/state fields, WAF/security settings, www/root domain, and deployment processing. Do not make DNS/security changes without verifying current state.
3. User initially had issues with calculator Reset behavior and inconsistent default/autofill values. These must be regression-tested when calculator code changes.
4. A wall-framing calculator had an unused “Opening width” input/formula mismatch. It was fixed in commit 962baf77... .
5. A large calculator expansion created/merged 50 calculators. Sitemap reached 78 URLs. Internal-link audit found 50/50 calculators category-linked; 3 broken guide→calculator links were fixed. Avoid duplicating calculators or creating orphan pages.
6. Search Console had quota/indexing-processing confusion. User has submitted indexing requests and sitemap. Do not repeatedly resubmit unnecessarily; inspect current status first.
7. User was worried about duplicate options/footer/deployment issues. Always verify live output after bulk changes.
8. User does not want fake owner identity/contact details. Do not invent names, emails, credentials, or business claims.
9. User wants monetization/policy safety from the beginning: no deceptive content, fake expertise, copied competitor content, keyword stuffing, or mass low-value pages.
10. Competitor similarity: YardCompass is a real, active site with a similar home/yard calculator concept. Do not copy its wording, structure, branding, or content. YardCompute must remain independently branded and useful.
11. Logo implementation was deliberately postponed. Do NOT change the current logo unless the user explicitly asks or supplies the final package and asks to implement it.

## Current site scale
- About 50 calculators.
- 7 categories.
- 19 guides.
- Key routes include home, about, contact, privacy-policy, terms, disclaimer, calculator category hubs, calculator pages, and guides.
- Technical SEO has generally been audited as good: canonicals, titles/descriptions, schema, sitemap/robots, and noindex issues were checked.
- Site-wide OG/social image injection exists in src/worker.js.
- www.yardcompute.com redirects 301 to yardcompute.com.

## Completed SEO/content work
- Homepage “Most Popular Calculators” section added.
- Homepage trust/explanation section added.
- Grass Seed Calculator optimized.
- Driveway Gravel Calculator optimized.
- Deck Board Calculator optimized.
- Wall Framing Calculator optimized.
- Fence Post Concrete Calculator optimized for “how much concrete do I need to set a fence post?”
- Post Hole Concrete Calculator optimized for “concrete calculator for post holes”.
- Deck Board Spacing Calculator optimized for “distance between deck boards”.
- Fence Post Spacing Calculator optimized for “fence post distance”.
- French Drain Gravel Calculator optimized.
- Fence-post concrete guide optimized for “how much concrete to set a fence post”.
- Driveway gravel guide optimized for driveway gravel query cluster.
- Category hub internal links added for important calculators.
- About page strengthened with honest methodology/trust language and AI-assisted drafting disclosure.
- OG image created at public/assets/og-image.svg.
- Metric conversions are supported in app.js.

## Known important SEO signals
Recent settled GSC data (2026-09-07 to 2026-10-04) showed:
- grass seed calculator: about position 4, 1 impression in latest query/page slice.
- deck board calculator had previously reached around position 10.
- wall framing calculator had previously reached around position 11.
- driveway gravel terms were mostly positions 50–90s.
- concrete post-hole terms appeared around positions 34–80s.
- French drain gravel around position 62.
- fence post distance around position 73.
- deck board distance around position 93.
These are opportunity signals, not guarantees. New edits need time before judging.

## Sitemap/indexing history
- Sitemap previously reached 78 URLs after calculator expansion.
- GSC showed most sitemap URLs indexed, with some discovered/not-indexed or processing.
- Do not assume “processing” means broken.
- Check GSC before taking indexing actions.
- Avoid wasting quota with repeated requests.

## Branding/logo status
- User has a preferred newer V3 logo concept: leaf-shaped calculator icon, green Yard, navy Compute, clean horizontal layout.
- User has a package intended to contain SVG/PNG logo, transparent logo, icon, favicon sizes, social share image, and metadata cleanup.
- The package was not yet implemented because the user had not uploaded the actual ZIP/package in the usable project context.
- A Claude Artifact URL was supplied previously but could not be directly downloaded/used as a ZIP.
- Treat logo implementation as PENDING until the actual package is available and user asks to implement.
- Do not replace the logo based only on a remembered image.

## Technical assets already changed
- src/worker.js: www→apex 301 redirect and OG/social image tags.
- public/assets/og-image.svg created.
- public/assets/app.js: calculator framework + metric conversion support.
- Multiple calculator and guide HTML files have been updated for SEO and internal linking.
- Do not overwrite calculator pages wholesale without first fetching the current file and preserving existing functionality.

## Calculator QA rules
Every calculator change should be checked for:
- Inputs and labels match formula variables.
- Defaults are useful, not blank unless blank is intentional.
- Reset returns to expected defaults.
- Units and metric conversion work.
- Results are numerically correct.
- Edge cases do not produce NaN/Infinity.
- Example on page matches calculator result.
- Related links are valid.
- No duplicate UI blocks.
- Mobile layout remains usable.
- No orphan calculator.
- Live deployment is verified after significant changes.

## SEO operating rules
- Prefer improving existing pages with real GSC demand before creating unnecessary new pages.
- Use search-intent language naturally; do not keyword-stuff.
- Keep one clear primary intent per page.
- Build topic clusters: category → calculator → guide → related calculator.
- Avoid cannibalization; scan before creating overlapping pages.
- Keep titles/meta concise and descriptive.
- Preserve canonicals and schema.
- Do not create thin AI mass content.
- Do not copy competitor wording.
- Content should be useful even without ads.
- Never make fake expertise, fake reviews, fake testimonials, fake authors, fake business claims, or fabricated citations.
- Never promise rankings or indexing.

## Safety / approval policy for future AI agent
LOW-RISK actions can be automated:
- read repo/GSC data
- audit links/metadata/sitemap
- generate reports
- identify SEO opportunities
- run tests
- prepare proposed edits
- monitor deployments

HIGH-RISK actions should require explicit user approval unless a future trusted automation policy is deliberately enabled:
- DNS changes
- Cloudflare security changes
- deleting files/pages
- major site-wide rewrites
- publishing large batches of content
- production deployment when tests fail
- account/credential changes
- external submissions that could consume quotas or create irreversible effects.

## Current roadmap state
DONE:
- Core site launched.
- Calculator expansion to about 50 calculators.
- Category structure.
- Guides collection.
- Technical SEO foundations.
- GA4.
- Sitemap/robots/canonical/schema foundation.
- Internal linking audit/fixes.
- Major GSC opportunity optimizations.
- Homepage trust/popular calculator improvements.
- OG image and www redirect.
- Basic technical/security review.

PENDING / CONTINUE:
1. Let recent SEO edits crawl and accumulate enough GSC data.
2. Continue targeted GSC-based optimization, not random edits.
3. Audit sitemap vs actual public pages when useful.
4. Audit orphan/internal-link opportunities when useful.
5. Continue calculator regression testing after meaningful code changes.
6. Implement final logo package only after actual files are available and user asks.
7. Build the YardCompute AI Assistant/Agent around this master context.
8. Later expand SEO/content based on measured demand.
9. Later monetization readiness review; do not rush ads before site quality/trust is solid.

## Agent behavior
The future YardCompute AI Assistant must:
1. Load this file before planning work.
2. Treat this file as project memory, not as a license to make risky changes.
3. Before editing, inspect current repository state; never rely only on old assumptions.
4. Maintain a change log with DONE/PENDING/BLOCKED.
5. Preserve previous functionality.
6. Verify after changes.
7. Report exactly what changed, why, tests performed, and what remains.
8. Prefer one safe batch over many repetitive edits.
9. Ask the user only for actions requiring their account/approval.
10. Never silently change DNS, security, credentials, or destructive settings.


## Future strategic roadmap
### Phase A — Foundation (DONE)
- Site architecture, calculators, categories, guides, legal/trust pages.
- Technical SEO, sitemap, robots, canonicals, schema, GA4.
- Cloudflare/Git deployment.
- Internal-link and calculator QA foundation.

### Phase B — Early SEO traction (IN PROGRESS)
- Let Google crawl recent changes before judging them.
- Monitor impressions, clicks, queries, positions, and indexing status.
- Strengthen pages already showing real search demand.
- Build topic clusters around calculator families that begin gaining traction.
- Fix indexing/orphan/technical issues only when evidence shows a problem.

### Phase C — Topic authority (NEXT)
- Expand only into calculator topics supported by search demand, SERP gaps, and a sensible cluster.
- Build high-quality guides answering real pre-calculation questions.
- Add useful calculator features only when they solve real user problems: package counts, waste, truckloads, multiple sections, supplier density/yield assumptions.
- Improve trust and source/assumption transparency.
- Strengthen category hubs and related-tool pathways.

### Phase D — Product differentiation
Potential differentiators to evaluate from actual user demand:
- Better project-specific calculators instead of generic copies.
- Clear assumptions and worked examples.
- Multi-section project inputs where useful.
- Material-ordering outputs such as bags, cubic yards, tons, and loads where appropriate.
- Practical “what to buy” guidance.
- Better internal project journeys: measure → calculate → order → read guide.
- Optional cost inputs only where they add real value.
- Saved/project features only if they justify their complexity.

### Phase E — Monetization readiness
Before ads/monetization:
- Strong trust pages and transparent methodology.
- No thin or duplicate AI content.
- Good UX/mobile performance.
- Useful original content.
- No deceptive ad placement or misleading claims.
- Recheck current Google monetization policies at implementation time.

### Phase F — Scale
- Expand into adjacent high-value home/yard calculator clusters.
- Consider tools, comparisons, downloadable project summaries, or other product features only after demand is demonstrated.
- Prune or merge pages that do not add distinct value.

## Competitor intelligence and market watch
Primary competitor watchlist:
1. YardCompass — https://yard-compass.com/
2. BackyardCalc — https://backyardcalc.com/
3. YardTally — https://yardtally.net/
4. ProjectCalc — https://projectcalc.app/

Secondary discovery list:
- YardFigure
- CalcurHome
- ProjectMeter
- ProjectMetrica
- Yard & Board
- BackyardCalcs
- Handy Tool Lab
- Other relevant SERP competitors discovered during research.

Track competitors for:
- calculator count and new categories
- new or updated guides
- high-level page-intent/title patterns
- UX features
- Imperial/metric support
- material/package outputs
- cost/pricing features
- source/assumption transparency
- internal linking and category architecture
- SERP/content patterns
- meaningful differentiation.

Competitor sites are intelligence sources, never templates. Never copy their wording, content, branding, layout, or distinctive feature implementation.

## Market-driven decision rule
When a competitor adds or changes a feature/topic:
1. Detect the change.
2. Check whether search demand and SERP evidence support it.
3. Check YardCompute GSC/GA4/site data for related demand or gaps.
4. Check for overlap/cannibalization with existing YardCompute pages.
5. Estimate whether YardCompute can offer a genuinely useful differentiated version.
6. Recommend a priority: NOW / SOON / LATER / IGNORE.
7. Only then propose implementation, with normal QA and approval gates.

A competitor change alone is never sufficient reason to build something.

## Weekly strategic cycle
A future scheduled YardCompute agent/report should cover:
1. GSC performance changes.
2. New query opportunities.
3. Pages gaining or losing impressions/clicks.
4. Indexing and technical warnings.
5. Calculator QA results.
6. Internal-link opportunities.
7. Competitor changes.
8. New market/search trends.
9. Prioritized next actions: NOW / SOON / LATER / IGNORE.
10. A short explanation of why each recommendation matters.

## Future agent decision model
Before major SEO/content/product work, the agent should combine:
- YardCompute GSC and GA4 evidence.
- Current site/repository state.
- Search demand and SERP evidence.
- Fresh competitor intelligence when practical.
- Existing topic coverage and cannibalization risk.
- Expected user value and implementation cost.

The agent should prefer evidence-backed improvements to pages already showing traction over speculative mass expansion.

## Professional change gate — required before ANY new feature, content, SEO change, or site-wide change
The YardCompute AI Assistant must not evaluate a proposed change only by market opportunity. Before recommending or implementing anything new, it must run a professional multi-gate review:

1. **Google Search and monetization policy safety**
   - Check current official Google policies relevant to the proposed change, especially Search Essentials/spam policies and AdSense/Publisher policies when monetization could be affected.
   - Never assume an old policy or remembered rule is still current; verify current official documentation when the task materially touches policy, ads, content quality, structured data, links, or search manipulation.
   - Avoid scaled low-value content, duplicate/near-duplicate pages, keyword stuffing, misleading claims, doorway-style pages, deceptive UX, fake expertise/reviews/testimonials, copied competitor content, hidden text, manipulative links, or content created primarily to manipulate rankings.
   - Do not add anything merely to “look SEO optimized” if it reduces user value.
   - Monetization approval must never be promised; the goal is to keep the site professionally prepared and avoid preventable policy problems.

2. **User value and UX**
   - Ask whether the change genuinely helps a homeowner/DIYer/contractor.
   - Check mobile usability, accessibility, clarity, navigation, page speed/performance impact, and whether the feature adds unnecessary complexity.
   - Prefer simple, useful interfaces over feature bloat.

3. **Technical quality**
   - Check architecture, maintainability, security, performance, responsive behavior, browser compatibility, error handling, and regression risk.
   - Preserve existing formulas, calculator defaults, reset behavior, units, schema, canonicals, sitemap, robots, analytics, and internal links unless there is a justified reason to change them.

4. **SEO and information architecture**
   - Check search intent, existing GSC demand, indexing status, cannibalization risk, internal-link placement, canonical/indexation implications, and whether a new URL is actually necessary.
   - Prefer improving an existing page when it can satisfy the intent well.
   - Do not create pages solely because a keyword exists.

5. **Trust, legal, and transparency**
   - Do not invent authors, credentials, sources, reviews, business details, pricing, or claims.
   - Clearly label assumptions, estimates, formulas, material densities/yields, and limitations where relevant.
   - Check privacy, disclosures, copyright/trademark risk, and any user-data implications for new features.
   - Recheck relevant legal/platform requirements when a change introduces data collection, accounts, payments, advertising, downloads, or third-party integrations.

6. **Market and competitor intelligence**
   - Compare against relevant competitors and current SERP patterns when useful, but treat competitors as signals, never templates.
   - A competitor feature alone is not a reason to build the same feature.

7. **Monetization readiness**
   - Consider whether the change helps or harms future AdSense/display-ad readiness.
   - Avoid intrusive layouts, misleading ad-like UI, thin pages, excessive boilerplate, or content that provides little independent value.
   - Recheck current Google monetization policies at implementation time.

### Required decision format
For significant changes, the agent should record:
- **Opportunity:** what problem/demand justifies the change.
- **Policy check:** relevant current Google policy guidance and risk level.
- **User value:** why users benefit.
- **Technical impact:** complexity/performance/security/regression risk.
- **SEO impact:** demand, intent, indexation, cannibalization, internal linking.
- **Trust/legal impact:** transparency, privacy, copyright/trademark, claims.
- **Market signal:** what competitors/SERP are doing and why it does or does not matter.
- **Decision:** NOW / SOON / LATER / IGNORE.
- **Verification:** tests/checks required before and after release.

### Priority rule
If market opportunity conflicts with Google policy, user value, trust, or technical quality, **do not ship the change just for growth**. Prefer the safer, more useful option or defer it.

### Professional baseline for a growing site
For any meaningful new site capability, also consider as applicable:
- accessibility and keyboard usability
- mobile/responsive layout
- Core Web Vitals/performance
- security and abuse prevention
- privacy/data minimization
- analytics measurement without unnecessary tracking
- structured data correctness
- canonical/indexing behavior
- sitemap/robots implications
- internal linking/navigation
- error/empty states
- browser compatibility
- backup/rollback path
- content freshness/maintenance burden
- copyright/trademark considerations
- cookie/consent requirements where legally or technically relevant
- future monetization/ad placement implications
- operational monitoring and QA.

The assistant should behave like a professional product + SEO + technical reviewer, not like a keyword generator or competitor copier.
