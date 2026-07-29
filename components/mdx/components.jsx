import React from "react";
import dynamic from "next/dynamic";
import { slugifyHeading } from "@/lib/projects";

const Mermaid = dynamic(() => import("./Mermaid"));

/* ------------------------------------------------------------------ */
/* Authored components — usable directly inside the MDX case studies   */
/* ------------------------------------------------------------------ */

const CALLOUT_STYLES = {
  note: { label: "Note", tone: "text-white/35", rule: "bg-white/15" },
  insight: { label: "What I learned", tone: "text-sand/80", rule: "bg-sand/50" },
  warning: { label: "Caveat", tone: "text-white/45", rule: "bg-white/30" },
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
          className={`font-roboto text-[9.5px] font-medium uppercase tracking-[0.3em] ${style.tone}`}
        >
          {style.label}
        </p>
      </div>
      <div className="[&>p]:mb-0 [&>p+p]:mt-3.5 [&>p]:font-playfair [&>p]:text-[19px] [&>p]:font-normal [&>p]:leading-[1.55] [&>p]:text-paper/70 sm:[&>p]:text-[20.5px]">
        {children}
      </div>
    </aside>
  );
}

export function StatRow({ children }) {
  return (
    <div className="my-12 grid grid-cols-2 border-y border-white/10 sm:grid-cols-4">
      {children}
    </div>
  );
}

export function Stat({ value, label }) {
  return (
    <div className="border-white/[0.07] px-1 py-7 [&:not(:nth-child(-n+2))]:border-t sm:border-t-0 sm:px-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:pl-6 sm:[&:not(:nth-child(-n+2))]:border-t-0">
      <p className="font-playfair text-[30px] leading-none text-paper/90 sm:text-[34px]">
        {value}
      </p>
      <p className="mt-3 max-w-[130px] font-roboto text-[10.5px] uppercase leading-snug tracking-[0.14em] text-white/35">
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
              <p className="font-roboto text-[9.5px] font-medium uppercase tracking-[0.3em] text-sand/70">
                {group.label}
              </p>
              <span
                className="mb-4 mt-2.5 block h-px w-full bg-white/[0.08]"
                aria-hidden="true"
              />
            </>
          )}
          <ul className="space-y-2">
            {group.items.map((item) => (
              <li
                key={item}
                className="font-roboto text-[13.5px] font-light leading-snug text-paper/55"
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

function Heading({ level, children }) {
  const id = slugifyHeading(headingText(children));
  const Tag = `h${level}`;

  const sizes = {
    2: "font-playfair text-[30px] sm:text-[36px] leading-[1.15] text-paper/95 mt-20 mb-6",
    3: "font-roboto text-[17px] sm:text-[18px] font-medium tracking-[-0.005em] text-paper/80 mt-12 mb-4",
    4: "font-roboto text-[14.5px] font-medium uppercase tracking-[0.1em] text-white/45 mt-9 mb-3",
  };

  return (
    <Tag id={id} className={`scroll-mt-28 ${sizes[level] || sizes[4]}`}>
      {children}
    </Tag>
  );
}

export const mdxComponents = {
  Callout,
  Stat,
  StatRow,
  TechGrid,

  h1: ({ children }) => <Heading level={2}>{children}</Heading>,
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }) => <Heading level={4}>{children}</Heading>,

  p: ({ children }) => (
    <p className="mb-6 font-roboto text-[16.5px] font-light leading-[1.8] text-paper/[0.72] sm:text-[17px]">
      {children}
    </p>
  ),

  strong: ({ children }) => (
    <strong className="font-medium text-paper/95">{children}</strong>
  ),

  em: ({ children }) => <em className="italic text-paper/85">{children}</em>,

  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="text-paper/90 underline decoration-sand/40 underline-offset-[4px] transition-colors duration-300 hover:text-sand hover:decoration-sand"
      >
        {children}
      </a>
    );
  },

  ul: ({ children }) => (
    <ul className="mb-7 ml-1 list-none space-y-3">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="mb-7 ml-5 list-decimal space-y-3 marker:font-roboto marker:text-[12px] marker:text-sand/60">
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="relative pl-6 font-roboto text-[16px] font-light leading-[1.75] text-paper/[0.68] before:absolute before:left-0 before:top-[0.75em] before:h-px before:w-3 before:bg-sand/45 [ol>&]:pl-1.5 [ol>&]:before:hidden">
      {children}
    </li>
  ),

  blockquote: ({ children }) => (
    <blockquote className="my-11 border-l border-sand/40 py-1 pl-7 [&>p]:mb-0 [&>p]:font-playfair [&>p]:text-[22px] [&>p]:leading-[1.45] [&>p]:text-paper/85 sm:[&>p]:text-[25px]">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-16 border-white/[0.08]" />,

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
          <span className="absolute right-4 top-3.5 font-roboto text-[9px] uppercase tracking-[0.26em] text-sand/40">
            {lang}
          </span>
        )}
        <pre className="overflow-x-auto border-l border-white/[0.12] bg-white/[0.022] py-5 pl-5 pr-5 pt-10 font-mono text-[12.5px] leading-[1.75] text-paper/70">
          {children}
        </pre>
      </div>
    );
  },

  code: ({ children, className }) => {
    // Inside a <pre> the wrapper above already handled presentation.
    if (className) return <code className={className}>{children}</code>;
    return (
      <code className="bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-sand/90">
        {children}
      </code>
    );
  },

  table: ({ children }) => (
    <div className="my-10 overflow-x-auto border-y border-white/10">
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="border-b border-white/[0.08]">{children}</thead>
  ),

  th: ({ children }) => (
    <th className="whitespace-nowrap px-4 py-3.5 font-roboto text-[9.5px] font-medium uppercase tracking-[0.2em] text-sand/70 first:pl-0">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="border-t border-white/[0.05] px-4 py-3.5 font-roboto text-[13.5px] font-light text-paper/60 first:pl-0">
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
      className="my-9 h-auto w-full border border-white/[0.08]"
    />
  ),
};
