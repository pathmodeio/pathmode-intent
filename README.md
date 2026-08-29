# pathmode-intent

An experimental [OpenSpec](https://github.com/Fission-AI/OpenSpec) schema that adds one artifact
in front of the proposal: **`intent.md`**, the product judgment behind the change.

Who is affected and what problem they face, what observable outcome should change, what evidence
or assumption supports it, and the boundaries, edge cases and checks that make it verifiable.

```
product-intent (intent.md)  ->  proposal  ->  specs  ->  design  ->  tasks
```

Everything after `intent.md` is OpenSpec's own workflow. The bundle preserves OpenSpec's built-in
templates and guidance, adding only the product-intent dependency and a pointer from the proposal
to `intent.md`. This adds a question in front; it does not change how the rest behaves.

## Status: experimental

Tested against **OpenSpec 1.11.0**. OpenSpec's own schema commands print
`Schema commands are experimental and may change`, and this bundle inherits that. It has been
used on real changes by its authors and is now looking for outside users, which is the entire
reason it is public this early.

If it gets in your way, that is the most useful thing you can tell us.

## Install

```bash
git clone --depth 1 https://github.com/pathmodeio/pathmode-intent /tmp/pathmode-intent
mkdir -p openspec/schemas/pathmode-intent
cp -R /tmp/pathmode-intent/schema.yaml /tmp/pathmode-intent/templates openspec/schemas/pathmode-intent/
```

Then use it for one change:

```bash
openspec new change my-change --schema pathmode-intent
openspec status --change my-change     # proposal shows "blocked by: product-intent"
```

Or set it for the project in `openspec/config.yaml`:

```yaml
schema: pathmode-intent
```

Verify the install:

```bash
openspec schema validate pathmode-intent
```

## Checking an intent

`intent.md` here is a real interchange format, not a free-form note, so a free tool can read it
and tell you what is missing:

```bash
npx -y @pathmode/cli preflight openspec/changes/<change-id>
```

The preflight is read-only, local, and needs no account: it writes nothing anywhere. (The schema
is the part that writes, and only the one file it exists to create.) It grades six dimensions and,
where it cannot confirm something, quotes your own text back and asks rather than declaring it
absent. Requires `@pathmode/cli` 2.1.3 or newer.

This is optional. The schema is useful without it.

## Privacy: what must never go in `intent.md`

`intent.md` is committed to your repository. Everyone who clones it can read it, and git keeps it
after you delete the line.

**Never:** raw customer quotes, customer or user names, support transcripts, confidential
context, internal metrics, credentials.

**Instead:** a one-line summary and a reference. A ticket id, a dashboard name, a link. "Three
duplicates on INT-4471" carries the same weight with none of the exposure. If a claim has no
evidence behind it yet, label it `Assumption: ...` rather than dressing it up.

This rule is in the artifact's own instruction text, not just here, because the failure is silent
and permanent.

## Why the upstream instructions are copied, not referenced

A schema created with `openspec schema init` carries no `instruction` text, and OpenSpec does not
fall back to the built-in wording when it is missing. Measured against 1.11.0: a scaffolded schema
renders 970 bytes of instruction for the proposal artifact where the built-in `spec-driven`
renders 3807. The Capabilities contract that makes spec deltas work, and the `skip_specs` guidance
that stops an author inventing a requirement, are both simply absent.

So this bundle carries upstream's specs, design and tasks instructions verbatim, and the
proposal's instruction verbatim plus one appended paragraph pointing at `intent.md`. The only
other change is the dependency: the proposal now requires `product-intent`. `upstream/` holds the pinned
snapshot those copies were made from, with OpenSpec's MIT license beside it, and the test below
fails if they drift apart.

## Test

```bash
npm install
npm test
```

Checks the bundle's shape, that the copied instructions still match the pinned upstream snapshot,
and that the template is a real `intent.md` rather than a lookalike. If `@fission-ai/openspec` is
installed it additionally runs `openspec schema validate`.

## What this is not

It does not replace anything in OpenSpec, and it is not affiliated with or endorsed by the
OpenSpec maintainers. Proposals, spec deltas, design notes and tasks work exactly as upstream.

It also does not carry evidence provenance, attributed confirmations, or staleness. Those are
properties of a judgment record rather than of a file in a repo, and a file cannot vouch for
itself. If you want them they live in [Pathmode](https://pathmode.io). If you do not, this schema
is still useful on its own.

Related neighbours in OpenSpec's community schema catalog (this schema is not listed there):
[`nanopm`](https://github.com/Fission-AI/OpenSpec/blob/main/docs/customization.md) and
`intent-driven`, both of which work upstream of implementation in their own way.

## Feedback

Issues and PRs welcome. The most useful report is one real change: what the intent artifact
changed about your decision, or where it got in the way.

## License

MIT.
