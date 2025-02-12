import initWasm, { format } from "../oxc_prettier_wasm/pkg";
// @ts-expect-error
import { __debug as PrettierDebug } from "prettier/standalone";
import pluginESTree from "prettier/plugins/estree";
import pluginBabel from "prettier/plugins/babel";

const prettierOptions = { parser: "babel", plugins: [pluginESTree, pluginBabel] };

type FormatFn = (source: string) => Promise<{
  docAst: string;
  doc: string;
  formatted: string;
}>;

export const load = initWasm;

export const formatOxc: FormatFn = async (source) => {
  try {
    const { has_error, doc_ast, formatted } = format(source);
    if (has_error) throw new Error("Invalid source code");

    const docAst = JSON.parse(doc_ast);
    const doc = await PrettierDebug.formatDoc(docAst, prettierOptions);

    return { docAst: JSON.stringify(docAst, null, 2), doc, formatted };
  } catch (error) {
    throw new Error("[oxc_prettier] " + String(error), { cause: error });
  }
};

export const formatPrettier: FormatFn = async (source) => {
  try {
    const docAst = await PrettierDebug.printToDoc(source, prettierOptions);
    const doc = await PrettierDebug.formatDoc(docAst, prettierOptions);
    const { formatted } = await PrettierDebug.printDocToString(docAst, prettierOptions);

    return { docAst: JSON.stringify(docAst, null, 2), doc, formatted };
  } catch (error) {
    throw new Error("[prettier] " + String(error), { cause: error });
  }
};
