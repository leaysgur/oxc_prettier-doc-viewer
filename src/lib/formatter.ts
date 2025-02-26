import initWasm, { format } from "../oxc_prettier_wasm/pkg";
// @ts-expect-error
import { __debug as PrettierDebug } from "prettier/standalone";
import pluginESTree from "prettier/plugins/estree";
import pluginBabel from "prettier/plugins/babel";
import { createHighlighter } from "shiki";

// NOTE: May consider fine grained bundling in the future for deployment
const hi = async ([docAst_, doc_, formatted_]: [unknown, string, string], isTS: boolean) => {
  const theme = "catppuccin-macchiato";
  const lang = isTS ? "typescript" : "javascript";

  const highlighter = await createHighlighter({
    themes: [theme],
    langs: ["json", "javascript", "typescript"],
  });

  return {
    docAst: highlighter.codeToHtml(JSON.stringify(docAst_, null, 2), { lang: "json", theme }),
    doc: highlighter.codeToHtml(doc_, { lang, theme }),
    formatted: highlighter.codeToHtml(formatted_, { lang, theme }),
  };
};

type FormatFn = (
  source: string,
  fileName: string,
) => Promise<{
  docAst: string;
  doc: string;
  formatted: string;
}>;

export const load = initWasm;

export const formatOxc: FormatFn = async (source, fileName) => {
  const isTS = fileName.includes(".ts");
  const prettierOptions = { parser: "babel", plugins: [pluginESTree, pluginBabel] };

  try {
    const { has_error, doc_ast, formatted } = format(source, fileName);
    if (has_error) throw new Error("Invalid source code");

    const docAst = JSON.parse(doc_ast);
    const doc = await PrettierDebug.formatDoc(docAst, prettierOptions);

    const highlighted = await hi([docAst, doc, formatted], isTS);
    return highlighted;
  } catch (error) {
    throw new Error("[oxc_prettier] " + String(error), { cause: error });
  }
};

export const formatPrettier: FormatFn = async (source, fileName) => {
  const isTS = fileName.includes(".ts");
  const prettierOptions = {
    parser: isTS ? "babel-ts" : "babel",
    plugins: [pluginESTree, pluginBabel],
  };

  try {
    const docAst = await PrettierDebug.printToDoc(source, prettierOptions);
    const doc = await PrettierDebug.formatDoc(docAst, prettierOptions);

    // Don't reuse `docAst`, `formatDoc` mutates it!
    const docAstForFormatted = await PrettierDebug.printToDoc(source, prettierOptions);
    const { formatted } = await PrettierDebug.printDocToString(docAstForFormatted, prettierOptions);

    const highlighted = await hi([docAst, doc, formatted], isTS);
    return highlighted;
  } catch (error) {
    throw new Error("[prettier] " + String(error), { cause: error });
  }
};
