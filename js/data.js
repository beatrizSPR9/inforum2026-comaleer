// =============================================================================
// data.js — Single source of truth for all site content.
// EDITÁVEL: adiciona, remove ou edita case studies, tools e metadata aqui.
// =============================================================================

// ---------------------------------------------------------------------------
// Site metadata
// ---------------------------------------------------------------------------
var SITE = {
  thesisTitle: "Comaleer: A Translation Pipeline for Deductive Verification",
  author: "TODO: Author Name",
  institution: "TODO: Institution",
  year: 2026,
  thesisUrl: "#",                          // substituir pelo link da tese
  repoUrl: "https://github.com/TODO/TODO", // substituir pelo link do repositório
  email: "todo@example.org"
};

// ---------------------------------------------------------------------------
// Tools & repositories
// ---------------------------------------------------------------------------
var TOOLS = [
  {
    name: "Why3",
    description: "Platform for deductive program verification providing a rich logic and multiple solver back-ends.",
    url: "https://www.why3.org/"
  },
  {
    name: "Cameleer",
    description: "Deductive verification framework for OCaml programs, leveraging Why3 as a back-end.",
    url: "https://github.com/ocaml-gospel/cameleer"
  },
  {
    name: "GOSPEL",
    description: "Generic OCaml Specification Language used to annotate OCaml signatures with formal contracts.",
    url: "https://github.com/ocaml-gospel/gospel"
  },
  {
    name: "COMA",
    description: "Continuation-passing intermediate verification language. The target of the translation pipeline.",
    url: "https://gitlab.inria.fr/why3/coma"
  },
];

// ---------------------------------------------------------------------------
// Instructions / steps
// ---------------------------------------------------------------------------
var STEPS = [
  {
    title: "Clone the repository",
    code: "git clone https://github.com/TODO/ocaml-gospel-to-coma.git\ncd ocaml-gospel-to-coma"
  },
  {
    title: "Install dependencies",
    code: "opam switch create . 5.1.0\nopam install . --deps-only --with-test"
  },
  {
    title: "Run the translation pipeline",
    code: "dune exec bin/translate.exe -- examples/stack.ml \\\n  --style in-depth \\\n  -o build/stack.coma"
  },
  {
    title: "Verify the generated COMA code",
    code: "why3 prove -P alt-ergo,z3 build/stack.coma"
  }
];

// ---------------------------------------------------------------------------
// Case studies
// Each entry needs a matching folder under examples/ with two .ml files.
//
// To ADD a case study:
//   1. Append an object to this array.
//   2. Create examples/<folder>/<folder>_top_level.ml and <folder>_in_depth.ml
//
// To REMOVE: delete the object from this array.
// To EDIT: change title, description, or file paths directly here.
// ---------------------------------------------------------------------------
var CASE_STUDIES = [
  {
    id: "bst",
    title: "Binary Search Tree",
    description: "Pure BST with insert, member, and delete.",
    topLevelLines: 45,
    inDepthLines:  42,
    topLevelPath: "examples/bst/binary_search_tree_top_level.ml",
    inDepthPath:  "examples/bst/binary_search_tree_in_depth.ml"
  },
  {
    id: "leftist_heaps",
    title: "Leftist Heaps",
    description: "Functional priority queue with logarithmic merge.",
    topLevelLines: 73,
    inDepthLines:  41,
    topLevelPath: "examples/leftist_heaps/leftist_heaps_top_level.ml",
    inDepthPath:  "examples/leftist_heaps/leftist_heaps_in_depth.ml"
  },
  {
    id: "pairing_heaps",
    title: "Pairing Heaps",
    description: "Functional priority queue with efficient merge operation.",
    topLevelLines: 78,
    inDepthLines:  54,
    topLevelPath: "examples/pairing_heaps/pairing_heaps_top_level.ml",
    inDepthPath:  "examples/pairing_heaps/pairing_heaps_in_depth.ml"
  },
  {
    id: "red_black_trees",
    title: "Red Black Trees",
    description: "Self-balancing binary search trees with guaranteed logarithmic height.",
    topLevelLines: 131,
    inDepthLines:  111,
    topLevelPath: "examples/red_black_trees/red_black_trees_top_level.ml",
    inDepthPath:  "examples/red_black_trees/red_black_trees_in_depth.ml"
  },
  {
    id: "same_fringe",
    title: "Same Fringe",
    description: "Determines if two binary trees have the same sequence of leaves.",
    topLevelLines: 17,
    inDepthLines:  14,
    topLevelPath: "examples/same_fringe/same_fringe_top_level.ml",
    inDepthPath:  "examples/same_fringe/same_fringe_in_depth.ml"
  },
  {
    id: "skew_heaps",
    title: "Skew Heaps",
    description: "Functional priority queue with efficient merge operation.",
    topLevelLines: 48,
    inDepthLines:  27,
    topLevelPath: "examples/skew_heaps/skew_heaps_top_level.ml",
    inDepthPath:  "examples/skew_heaps/skew_heaps_in_depth.ml"
  },
];
