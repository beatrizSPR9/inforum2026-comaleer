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
    description: "Generic OCaml Specification Language used to annotate OCaml programs with formal contracts.",
    url: "https://github.com/ocaml-gospel/gospel"
  },
  {
    name: "COMA",
    description: "Continuation-passing intermediate verification language. The target of the translation pipeline.",
    url: "https://coma.paulpatault.fr/"
  },
];

// ---------------------------------------------------------------------------
// Instructions / steps
// ---------------------------------------------------------------------------
var STEPS = [
  {
    title: "Create OPAM switch",
    description: "Start by creating a dedicated switch running the following command. If the command fails, run <code>opam update</code> and then retry.",
    code: "opam switch create comaleer ocaml-base-compiler.4.14.2"
  },
  {
    title: "Restart and verify the switch",
    description: "Restart your machine and confirm the switch was created correctly by listing all available switches.",
    code: "opam switch list\n# Expected output:\n#     switch      compiler                    description\n->    comaleer    ocaml-base-compiler.4.14.2  comaleer"
  },
  {
    title: "Cameleer installation",
    description: "Clone the Cameleer repository, pin the required version of cmdliner, and install Cameleer along with all its dependencies (Why3, GOSPEL, solvers). Then verify the installation.",
    code: "git clone https://github.com/ocaml-gospel/cameleer.git\ncd cameleer\ngit checkout coma\nopam pin add cmdliner 1.3.0 && opam pin add .\ncameleer --version"
  },
  {
    title: "Run an example",
    description: "To verify a specific OCaml file, run Cameleer with the <code>--coma</code> flag. This translates the file to COMA and opens the Why3 IDE so you can interactively prove the example.",
    code: "cameleer --coma filename.ml"
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
    description: "Pure BST with insert, member, and removals.",
    topLevelLines: 45,
    inDepthLines:  42,
    topLevelPath: "examples/bst/binary_search_tree_top_level.ml",
    inDepthPath:  "examples/bst/binary_search_tree_in_depth.ml",
    proofResultsPath: "proof_results/binary_search_tree_in_depth.xml"
  },
  {
    id: "leftist_heaps",
    title: "Leftist Heaps",
    description: "Priority queue implemented with a variant of a binary heap.",
    topLevelLines: 73,
    inDepthLines:  41,
    topLevelPath: "examples/leftist_heaps/leftist_heaps_top_level.ml",
    inDepthPath:  "examples/leftist_heaps/leftist_heaps_in_depth.ml",
    proofResultsPath: "proof_results/leftist_heaps_in_depth.xml"
  },
  {
    id: "pairing_heaps",
    title: "Pairing Heaps",
    description: "Priority queue implemented using binary trees.",
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
    description: "Determines if two binary trees have the same elements.",
    topLevelLines: 17,
    inDepthLines:  14,
    topLevelPath: "examples/same_fringe/same_fringe_top_level.ml",
    inDepthPath:  "examples/same_fringe/same_fringe_in_depth.ml"
  },
  {
    id: "skew_heaps",
    title: "Skew Heaps",
    description: "Self-adjusting heap implemented with binary trees, optimized for fast merges.",
    topLevelLines: 48,
    inDepthLines:  27,
    topLevelPath: "examples/skew_heaps/skew_heaps_top_level.ml",
    inDepthPath:  "examples/skew_heaps/skew_heaps_in_depth.ml",
    proofResultsPath: "proof_results/skew_heaps_in_depth.xml"
  },
];
