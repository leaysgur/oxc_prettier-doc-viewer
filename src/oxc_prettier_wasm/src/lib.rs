// Silence erroneous warnings from Rust Analyser for `#[derive(Tsify)]`
#![allow(non_snake_case)]

use oxc::{
    allocator::Allocator,
    parser::{ParseOptions, Parser},
    span::SourceType,
};
use oxc_prettier::{Prettier, PrettierOptions};
use tsify::Tsify;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(getter_with_clone)]
#[derive(Default, Tsify)]
pub struct ParseReturn {
    pub has_error: bool,
    pub doc_ast: String,
    pub formatted: String,
}

#[wasm_bindgen(js_name = format)]
pub fn format(source: &str, file_name: &str) -> ParseReturn {
    let allocator = Allocator::default();

    let source_type = SourceType::from_path(file_name).unwrap_or_default();
    let parser = Parser::new(&allocator, source, source_type).with_options(ParseOptions {
        preserve_parens: false,
        ..ParseOptions::default()
    });
    let parsed = parser.parse();

    let oxc_prettier = Prettier::new(&allocator, PrettierOptions::default());
    let doc_ast = oxc_prettier.doc(&parsed.program);

    let mut oxc_prettier = Prettier::new(&allocator, PrettierOptions::default());
    let formatted = oxc_prettier.build(&parsed.program);

    ParseReturn {
        has_error: !parsed.errors.is_empty(),
        doc_ast: doc_ast.to_string(),
        formatted,
    }
}
