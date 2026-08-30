---
# id and status have no section form, so a sectioned intent.md still needs these to be a valid
# IntentSpec document (SPEC.md section 3). Replace `id` with something stable for this change.
id: change-id
status: draft
---

# Untitled Intent

<!--
Replace the title above with one line naming the change. It is left as "Untitled Intent"
deliberately: an angle-bracket placeholder reads as a real title to the gate, so an untouched
scaffold would report a passing title it has not earned.
-->

<!--
This file is intent.md, the same shape Pathmode's tooling reads. The headings below are the
contract: keep them exactly as they are, and put your own words underneath. Renaming a heading
does not just change the look, it makes the section invisible to every reader of this format.
-->

## Objective

<!--
WHO is affected and WHAT goes wrong for them today. A role, a team, an operator, an agent.
Not "the system" and not "we". One or two sentences of plain prose.

Example: Support engineers on the integrations rota lose the first twenty minutes of every shift
reconciling overnight sync failures by hand, because a failed run leaves no retry and no alert.
-->

## Outcomes

<!--
What someone outside the codebase could see or measure after this ships. A number, a step
removed, an error they stop hitting. One per line, keep the checkbox.

If this change genuinely has no user-visible outcome (a pure refactor, tooling, docs), say so in
one line here and set `skip_specs: true` in the change's .openspec.yaml. Do not invent an outcome.
-->

- [ ]

## Constraints

<!--
What must never happen. A real boundary someone could violate, not a preference.

Example: Permanent failures must never retry silently forever.
-->

-

## Edge Cases

<!--
The failure modes, each with the behavior you expect. Keep the `**scenario**: expected behavior`
shape; it is what makes an edge case readable as a pair rather than a sentence.

Example: - **Connector credentials expired**: retry stops after one attempt and the run is marked
needs-attention.
-->

- ****:

## Evidence References

<!--
What makes you believe the problem is real: a ticket, an interview, a metric, an incident.

PRIVACY: reference it, never paste it. This file is committed to your repository, and git keeps
it after you delete the line. No raw customer quotes, no names, no transcripts, no internal
metrics, no secrets. A ticket id carries the same weight with none of the exposure.

If a claim has no evidence behind it yet, label it: "Assumption: ...".
-->

-

## Verification

<!--
At least one check someone can run, with a stated expected result. "Run npm test, all green" is a
check. "Add tests" is not.

Keep the bold labels: they are how each check is read. Use the ones that apply and delete the
rest. **Fastest check**, **Automated test**, **Manual check**, **Shipped signal**,
**Regression guard**.
-->

**Fastest check**:
- [ ]

**Manual check**:
- [ ]
