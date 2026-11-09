/**
 * Marks the opening sentence of the first paragraph under every `##` heading so the
 * essay carries its own skim path: a reader who only follows the highlights still
 * gets the argument. Renders as <mark>. Only acts when that paragraph begins with a
 * plain run of text containing a full sentence, so it never splits inline markup.
 */
export default function remarkKeySentence() {
  return (tree) => {
    const nodes = tree.children;
    for (let i = 0; i < nodes.length - 1; i++) {
      if (nodes[i].type !== "heading" || nodes[i].depth !== 2) continue;
      const paragraph = nodes[i + 1];
      if (paragraph.type !== "paragraph") continue;
      const first = paragraph.children?.[0];
      if (first?.type !== "text") continue;

      const match = /^[\s\S]+?[.?!](?=\s|$)/.exec(first.value);
      if (!match || match[0].length > 220 || match[0].length >= first.value.length) continue;

      const sentence = match[0];
      paragraph.children.splice(
        0,
        1,
        { type: "mark", data: { hName: "mark" }, children: [{ type: "text", value: sentence }] },
        { type: "text", value: first.value.slice(sentence.length) }
      );
    }
  };
}
