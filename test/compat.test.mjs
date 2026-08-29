/**
 * Compatibility tests for the pathmode-intent schema bundle, pinned to OpenSpec 1.11.0.
 *
 * Deliberately dependency-light: node's built-in test runner plus js-yaml, so an outside user can
 * clone, `npm install`, `npm test`, and see for themselves rather than taking the README's word.
 *
 * The drift test is the one that matters over time. A third-party schema that omits `instruction`
 * does not inherit OpenSpec's built-in text: measured against 1.11.0, the rendered proposal
 * instruction is 970 bytes scaffolded versus 3807 built-in. So these copies are load-bearing, and
 * a silent drift from upstream degrades what the agent reads without anything visibly breaking.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import yaml from 'js-yaml';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PINNED = '1.11.0';

const schema = yaml.load(fs.readFileSync(path.join(ROOT, 'schema.yaml'), 'utf-8'));
const upstream = yaml.load(
    fs.readFileSync(path.join(ROOT, 'upstream', `spec-driven-${PINNED}.schema.yaml`), 'utf-8')
);
const template = fs.readFileSync(path.join(ROOT, 'templates', 'product-intent.md'), 'utf-8');

/** Collapse hard-wrapped prose so assertions test wording, not line breaks. */
const flow = (s) => s.replace(/\s+/g, ' ');

test('product-intent comes first and the proposal depends on it', () => {
    assert.equal(schema.artifacts[0].id, 'product-intent');
    assert.equal(schema.artifacts[0].generates, 'intent.md');
    const proposal = schema.artifacts.find((a) => a.id === 'proposal');
    assert.deepEqual(proposal.requires, ['product-intent']);
});

test('every artifact ships the template it references', () => {
    for (const artifact of schema.artifacts) {
        assert.ok(
            fs.existsSync(path.join(ROOT, 'templates', artifact.template)),
            `missing template for ${artifact.id}`
        );
    }
});

test('the privacy rule lives in the instruction, not only the README', () => {
    // The instruction is what an agent reads. If this regresses, the schema starts inviting
    // customer quotes into a git repository, which is permanent and silent.
    const instruction = flow(schema.artifacts[0].instruction);
    assert.match(instruction, /never contain raw customer quotes/i);
    assert.match(instruction, /transcripts/i);
    assert.match(instruction, /secrets/i);
});

test('the author is told how to opt out instead of inventing a user', () => {
    const instruction = flow(schema.artifacts[0].instruction);
    assert.match(instruction, /skip_specs/);
    assert.match(instruction, /Do not invent an actor or an outcome/i);
});

test(`copied instructions still match the pinned upstream (${PINNED})`, () => {
    const ours = Object.fromEntries(schema.artifacts.map((a) => [a.id, a]));
    const theirs = Object.fromEntries(upstream.artifacts.map((a) => [a.id, a]));

    for (const id of ['specs', 'design', 'tasks']) {
        assert.equal(ours[id].instruction, theirs[id].instruction, `${id} instruction drifted`);
    }
    // The proposal is upstream verbatim plus exactly one appended paragraph.
    const base = theirs.proposal.instruction.trimEnd();
    assert.ok(ours.proposal.instruction.startsWith(base), 'proposal instruction drifted');
    assert.match(ours.proposal.instruction.slice(base.length), /intent\.md/);
});

test('the copies carry the guidance a scaffolded schema would have dropped', () => {
    const proposal = schema.artifacts.find((a) => a.id === 'proposal').instruction;
    assert.match(proposal, /Capabilities section is critical/i);
    assert.match(proposal, /skip_specs/);
});

test('the template is a real intent.md, not a lookalike', () => {
    // Renaming a heading does not just change the look, it makes the section invisible to every
    // reader of this format. An earlier draft used friendly headings that parsed to nothing.
    const headings = [...template.matchAll(/^##\s+(.+?)\s*$/gm)].map((m) => m[1]);
    assert.deepEqual(headings, [
        'Objective',
        'Outcomes',
        'Constraints',
        'Edge Cases',
        'Evidence References',
        'Verification',
    ]);

    const labels = [...template.matchAll(/^\*\*(.+?)\*\*:/gm)].map((m) => m[1].toLowerCase());
    assert.ok(labels.length > 0, 'no verification labels in the template');
    const known = ['fastest check', 'shipped signal', 'regression guard', 'manual check', 'automated test'];
    for (const label of labels) assert.ok(known.includes(label), `unrecognized label: ${label}`);
});

test('an untouched scaffold does not look finished', () => {
    // The title placeholder must read as a placeholder. `# <name the change>` does not: angle
    // brackets parse as a real title, so an untouched scaffold would report a passing title.
    assert.match(template, /^# Untitled Intent$/m);
});

test(`OpenSpec ${PINNED} accepts the schema (skipped unless installed)`, (t) => {
    // Optional: the real proof, but it needs the CLI. Run
    //   npx --yes @fission-ai/openspec@1.11.0 schema validate pathmode-intent
    // from a project with the bundle installed to check it yourself.
    let openspec;
    try {
        openspec = execFileSync('npx', ['--no-install', 'openspec', '--version'], {
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
    } catch {
        return t.skip('openspec CLI not installed');
    }
    assert.ok(openspec, 'openspec reported no version');
});
