---
id: "INT-OPENSPEC-ADAPTER-001"
status: "approved"
userGoal: "Put product judgment before an OpenSpec proposal"
objective: "Help OpenSpec users confirm who a change serves and what observable result matters before writing implementation artifacts"
evidence:
  - type: "observation"
    source: "pathmode-intent experimental pilot"
    excerpt: "Assumption: requiring product-intent before proposal will help OpenSpec users expose unsupported decisions; external pilot validation is still pending."
    anchors: ["objective", "outcome:0"]
outcomes:
  - "100% of changes created with the pathmode-intent schema require product-intent before proposal"
  - "A completed generated intent.md passes 6 of 6 readiness gates before proposal authoring starts"
  - "OpenSpec's specs, design, and tasks instructions have zero byte differences from the pinned upstream guidance, while proposal differs only by the documented dependency and intent pointer"
constraints:
  - "The adapter must remain experimental and pinned to the OpenSpec version it was tested against"
  - "The generated intent.md must prohibit raw customer quotes, names, transcripts, confidential metrics, and secrets"
  - "The adapter must not replace or weaken OpenSpec's proposal, specs, design, or tasks workflow"
edgeCases:
  - scenario: "The installed OpenSpec built-in instructions drift from the pinned snapshot"
    expectedBehavior: "The compatibility test fails until the adapter is reviewed and regenerated"
  - scenario: "The generated intent.md is left blank"
    expectedBehavior: "Preflight reports missing product judgment instead of borrowing text from proposal.md"
verification:
  - "Run the schema compatibility suite and confirm all tests pass against the pinned OpenSpec version"
  - "Create a clean change with this schema and confirm proposal is blocked by product-intent"
  - "Complete the generated intent.md, run preflight, and confirm all six gates pass"
healthMetrics:
  - "Standard OpenSpec changes without this schema keep their existing behavior"
  - "The adapter adds no hosted-service or Pathmode-account requirement"
---
