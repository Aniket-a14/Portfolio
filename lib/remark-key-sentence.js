/**
 * Gives every chapter of a case study its own skim path, drawn as highlighter marks (<mark>): a reader who only
 * follows the highlights still gets the argument. Per `##` chapter it marks
 *   1. the opening sentence of the first paragraph (the claim), and
 *   2. the closing sentence of the last paragraph (the so-what), when that is a different sentence.
 * Bold phrases in the MDX are highlighted too (see components/mdx/components.jsx). It only acts on plain text runs
 * holding a whole sentence, so it never splits inline markup such as code or links.
 */
const MAX = 220; // longer than this is a paragraph, not a sentence worth marking
const BOUNDARY = /[.?!](?=\s)/g;

const mark = (value) => ({ type: "mark", data: { hName: "mark" }, children: [{ type: "text", value }] });
const text = (value) => ({ type: "text", value });

function markOpening(paragraph) {
  const first = paragraph.children?.[0];
  if (first?.type !== "text") return;
  const match = /^[\s\S]+?[.?!](?=\s|$)/.exec(first.value);
  if (!match || match[0].length > MAX || match[0].length >= first.value.length) return;
  paragraph.children.splice(0, 1, mark(match[0]), text(first.value.slice(match[0].length)));
}

function markClosing(paragraph) {
  const kids = paragraph.children ?? [];
  const last = kids[kids.length - 1];
  if (last?.type !== "text") return;
  const trimmed = last.value.trimEnd();
  if (!/[.?!]$/.test(trimmed)) return;

  // Start of the final sentence: just after the last sentence boundary before the closing full stop.
  let cut = -1;
  for (const m of trimmed.slice(0, -1).matchAll(BOUNDARY)) cut = m.index + 1;
  if (cut < 0) return; // a single sentence, or it began in an earlier node: leave it to the opener
  const sentence = trimmed.slice(cut).trimStart();
  if (sentence.length < 24 || sentence.length > MAX) return;

  const head = trimmed.slice(0, trimmed.length - sentence.length);
  const parts = [text(head), mark(sentence)];
  const tail = last.value.slice(trimmed.length);
  if (tail) parts.push(text(tail));
  kids.splice(kids.length - 1, 1, ...parts);
}

export default function remarkKeySentence() {
  return (tree) => {
    const nodes = tree.children;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].type !== "heading" || nodes[i].depth !== 2) continue;

      // The chapter runs to the next heading; only its plain paragraphs are candidates (JSX blocks are skipped).
      let end = i + 1;
      while (end < nodes.length && !(nodes[end].type === "heading" && nodes[end].depth <= 2)) end++;
      const paragraphs = nodes.slice(i + 1, end).filter((n) => n.type === "paragraph");
      if (!paragraphs.length) continue;

      // Only the paragraph right after the heading counts as the opener (a Callout first means no opener).
      if (nodes[i + 1].type === "paragraph") markOpening(nodes[i + 1]);
      markClosing(paragraphs[paragraphs.length - 1]);
    }
  };
}
