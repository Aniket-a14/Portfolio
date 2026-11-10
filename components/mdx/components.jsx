import React from "react";
import dynamic from "next/dynamic";
import { slugifyHeading } from "@/lib/projects";

const Mermaid = dynamic(() => import("./Mermaid"));

/* ------------------------------------------------------------------ */
/* Authored components — usable directly inside the MDX case studies   */
/* ------------------------------------------------------------------ */

const CALLOUT_STYLES = {
  note: { label: "Note", tone: "text-ink/70", rule: "bg-ink/15" },
  insight: { label: "What I learned", tone: "text-vermilion", rule: "bg-vermilion/50" },
  warning: { label: "Caveat", tone: "text-ink/70", rule: "bg-ink/30" },
};

/**
 * Callouts read as marginalia rather than as boxed "info panels" — a label, a
 * hairline, and the text set slightly larger than the body. Boxes fragment a
 * long read; a rule interrupts it far more gently.
 */
export function Callout({ type = "note", children }) {
  const style = CALLOUT_STYLES[type] || CALLOUT_STYLES.note;

  return (
    <aside className="my-11">
      <div className="mb-3.5 flex items-center gap-3">
        <span className={`h-px w-7 shrink-0 ${style.rule}`} aria-hidden="true" />
        <p
          className={`font-body text-[11px] font-medium uppercase tracking-[0.3em] ${style.tone}`}
        >
          {style.label}
        </p>
      </div>
      <div className="[&>p]:mb-0 [&>p+p]:mt-3.5 [&>p]:font-display [&>p]:text-[19px] [&>p]:font-normal [&>p]:leading-[1.55] [&>p]:text-ink/70 sm:[&>p]:text-[20.5px]">
        {children}
      </div>
    </aside>
  );
}

export function StatRow({ children }) {
  return (
    <div className="my-12 grid grid-cols-2 border-y border-ink/10 sm:grid-cols-4">
      {children}
    </div>
  );
}

export function Stat({ value, label }) {
  return (
    <div className="border-ink/[0.07] px-1 py-7 [&:not(:nth-child(-n+2))]:border-t sm:border-t-0 sm:px-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-6 sm:[&:not(:nth-child(-n+2))]:border-t-0">
      <p className="font-display text-[30px] leading-none text-ink/90 sm:text-[34px]">
        {value}
      </p>
      <p className="mt-3 max-w-[130px] font-body text-[11px] uppercase leading-snug tracking-[0.14em] text-ink/70">
        {label}
      </p>
    </div>
  );
}

export function TechGrid({ groups = [], items = [] }) {
  const resolved = groups.length ? groups : [{ label: null, items }];

  return (
    <div className="my-11 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
      {resolved.map((group, index) => (
        <div key={group.label || index}>
          {group.label && (
            <>
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.3em] text-vermilion">
                {group.label}
              </p>
              <span
                className="mb-4 mt-2.5 block h-px w-full bg-ink/[0.08]"
                aria-hidden="true"
              />
            </>
          )}
          <ul className="space-y-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="font-body text-[13.5px] font-light leading-snug text-ink/70"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Markdown element overrides                                          */
/* ------------------------------------------------------------------ */

/** Recovers the plain text of a heading so it can be turned into an anchor. */
function headingText(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(headingText).join("");
  if (React.isValidElement(node)) return headingText(node.props.children);
  return "";
}

function Heading({ level, children, chapter }) {
  const id = slugifyHeading(headingText(children));
  const Tag = `h${level}`;

  const sizes = {
    2: "font-display text-[30px] sm:text-[36px] leading-[1.15] text-ink/95 mt-20 mb-6",
    3: "font-body text-[17px] sm:text-[18px] font-medium tracking-[-0.005em] text-ink/80 mt-12 mb-4",
    4: "font-body text-[14.5px] font-medium uppercase tracking-[0.1em] text-ink/70 mt-9 mb-3",
  };

  const heading = (
    <Tag id={id} className={`scroll-mt-28 ${sizes[level] || sizes[4]}`}>
      {children}
    </Tag>
  );

  if (level !== 2 || !chapter) return heading;

  // Annotated essay: the chapter's takeaway sits in the left margin on wide screens
  // and directly under the heading everywhere else.
  return (
    <div className="relative">
      {heading}
      <aside
        aria-label={`Chapter ${chapter.number} in brief`}
        className="-mt-3 mb-7 xl:absolute xl:right-[calc(100%+1.75rem)] xl:top-1 xl:mb-0 xl:mt-0 xl:w-[190px]"
      >
        <p className="folio text-[11px] text-vermilion">
          {String(chapter.number).padStart(2, "0")} · {chapter.minutes} min
        </p>
        {chapter.takeaway && (
          <p className="mt-2 font-display text-[15.5px] italic leading-[1.4] text-ink/75">
            {chapter.takeaway}
          </p>
        )}
      </aside>
    </div>
  );
}

/** Base components. `makeMdxComponents` layers per-article chapter data on top. */
export const mdxComponents = {
  Callout,
  Stat,
  StatRow,
  TechGrid,

  h1: ({ children }) => <Heading level={2}>{children}</Heading>,
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  mark: ({ children }) => (
    <mark className="key-sentence hl">{children}</mark>
  ),
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }) => <Heading level={4}>{children}</Heading>,

  p: ({ children }) => (
    <p className="mb-6 font-display text-[18px] leading-[1.7] text-ink/[0.85] sm:text-[19.5px]">
      {children}
    </p>
  ),

  strong: ({ children }) => (
    <strong className="hl font-medium text-ink/95">{children}</strong>
  ),

  em: ({ children }) => <em className="italic text-ink/85">{children}</em>,

  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="text-ink/90 underline decoration-vermilion/40 underline-offset-[4px] transition-colors duration-300 hover:text-vermilion hover:decoration-vermilion"
      >
        {children}
      </a>
    );
  },

  ul: ({ children }) => (
    <ul className="mb-7 ml-1 list-none space-y-3">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-7 ml-5 list-decimal space-y-3 marker:font-body marker:text-[12px] marker:text-vermilion">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="relative pl-6 font-display text-[17.5px] leading-[1.65] text-ink/[0.82] before:absolute before:left-0 before:top-[0.75em] before:h-px before:w-3 before:bg-vermilion/45 [ol>&]:pl-1.5 [ol>&]:before:hidden">
      {children}
    </li>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-11 border-l border-vermilion/40 py-1 pl-7 [&>p]:mb-0 [&>p]:font-display [&>p]:text-[22px] [&>p]:leading-[1.45] [&>p]:text-ink/85 sm:[&>p]:text-[25px]">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-16 border-ink/[0.08]" />,

  // MDX hands fenced code to <pre><code>. The mermaid language is intercepted
  // here so diagrams render as diagrams instead of as source.
  pre: ({ children }) => {
    const child = React.Children.toArray(children)[0];
    const className = child?.props?.className || "";
    const code = child?.props?.children;

    if (className.includes("language-mermaid")) {
      return <Mermaid chart={String(code).replace(/\n$/, "")} />;
    }

    const lang = /language-(\w+)/.exec(className)?.[1];

    return (
      <div className="group relative my-9 -mx-1 sm:mx-0">
        {lang && (
          <span className="absolute right-4 top-3.5 font-body text-[11px] uppercase tracking-[0.26em] text-vermilion">
            {lang}
          </span>
        )}
        <pre tabIndex={0} className="overflow-x-auto border-l border-ink/[0.12] bg-ink/[0.022] py-5 pl-5 pr-5 pt-10 font-mono text-[12.5px] leading-[1.75] text-ink/70">
          {children}
        </pre>
      </div>
    );
  },

  code: ({ children, className }) => {
    // Inside a <pre> the wrapper above already handled presentation.
    if (className) return <code className={className}>{children}</code>;
    return (
      <code className="bg-ink/[0.03] px-1.5 py-0.5 font-mono text-[13px] text-vermilion">
        {children}
      </code>
    );
  },

  table: ({ children }) => (
    <div className="my-10 overflow-x-auto border-y border-ink/10">
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="border-b border-ink/[0.08]">{children}</thead>
  ),

  th: ({ children }) => (
    <th className="whitespace-nowrap px-4 py-3.5 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-vermilion first:pl-0">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-t border-ink/[0.05] px-4 py-3.5 font-body text-[13.5px] font-light text-ink/70 first:pl-0">
      {children}
    </td>
  ),

  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      loading="lazy"
      decoding="async"
      className="my-9 h-auto w-full border border-ink/[0.08]"
    />
  ),
};

export function makeMdxComponents(chapters = []) {
  const byId = new Map(chapters.map((c) => [c.id, c]));
  return {
    ...mdxComponents,
    h1: ({ children }) => <Heading level={2} chapter={byId.get(slugifyHeading(headingText(children)))}>{children}</Heading>,
    h2: ({ children }) => <Heading level={2} chapter={byId.get(slugifyHeading(headingText(children)))}>{children}</Heading>,
  };
}
