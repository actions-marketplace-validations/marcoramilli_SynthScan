# 🔍 SynthScan

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-SynthScan-orange?logo=github)](https://github.com/marketplace/actions/synthscan)
[![npm version](https://img.shields.io/npm/v/synthscan.svg)](https://www.npmjs.com/package/synthscan)
[![PyPI version](https://img.shields.io/pypi/v/synthscan.svg)](https://pypi.org/project/synthscan/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Detect AI-generated (synthetic) code patterns in your repository.** Available as a powerful CLI tool (via **npm** or **pip**) and as a fully automated **GitHub Action**.

160+ detection patterns across 23 categories · Context-aware severity weighting · **Normalised per 1 000 LOC** · AST structural analysis · Fuzzy cross-file repetition · Diff/PR mode · SARIF output · Editable Markdown pattern file.

---

## 🚀 Features

- **Multi-Platform:** Run it anywhere using `npm`, `pip`, or GitHub Actions.
- **Diff / PR mode:** Pass a unified diff file — only added lines are scored. Score normalises against diff LOC for a clean "how synthetic is this PR" metric.
- **Beautiful Output:** Colorful terminal outputs, with a `--format json` flag to pipe results natively into tools like `jq`.
- **SARIF output:** Emit `synthscan-report.sarif` for GitHub Code Scanning integration — inline annotations appear directly on PR diffs.
- **Advanced Context:** Detects AI-structured docstrings, over-commented blocks, unreachable AST code, over-parameterised functions, and fuzzy cross-file repetitions.
- **Easily Configurable:** Gitignore-style `.synthscanignore` to exclude paths. Patterns are fully editable in plain Markdown!

---

## 📦 Installation

SynthScan is built in Python but packaged for both the Node and Python ecosystems so you can use the tools you already have.

### Via NPM (Node.js)
```bash
npm install -g synthscan
```

### Via PIP (Python)
```bash
pip install synthscan
```

### Via GitHub Actions
Add this workflow to any repo at `.github/workflows/synthscan.yml`:
```yaml
name: SynthScan
on: [pull_request, workflow_dispatch]
permissions:
  contents: read
  issues: write
jobs:
  synthscan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: marcoramilli/SynthScan@v2
        with:
          scan_path: '.'
          create_issue: "true"
```

---

## 💻 CLI Usage

Once installed globally, you can run `synthscan` from your terminal!

```bash
# Scan the current directory
synthscan

# Scan a specific directory
synthscan --scan-path ./src

# Fail if the score goes above 30 (useful in CI)
synthscan --score-threshold 30

# Output raw JSON to stdout (great for jq / piping)
synthscan --format json | jq '.synthetic_code_score'
```

### CLI Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `--scan-path` | `.` | Directory to scan. |
| `--patterns-file` | `patterns/synthetic_patterns.md` | Path to the Markdown detection patterns. |
| `--score-threshold`| `0` | Fail with exit code 1 if the score ≥ this value. |
| `--format` | `text` | Output format: `text` (beautiful colored UI) or `json`. |
| `--diff-file` | `""` | Path to a unified diff file. Only added lines are scored. |
| `--ignore-file` | `.synthscanignore` | Gitignore-style paths to exclude from scanning. |
| `--report-path` | `synthscan-report.json`| File path to write the JSON artefact. |
| `--sarif-output`| `false` | Set to `true` to emit a SARIF 2.1.0 report. |

---

## 🧠 How It Works

1. **Patterns** are defined in a human-readable Markdown file ([patterns/synthetic_patterns.md](patterns/synthetic_patterns.md)).  
   Each pattern is either a **plain-text substring** (case-insensitive) or a **Python regex** (prefixed with `regex:`). Patterns carry a **severity** (CRITICAL, HIGH, MEDIUM, LOW).

2. **The scanner** walks every source file and applies five layers of detection:
   - **Line-level matching** (Context-aware: comments score higher, strings lower).
   - **Multi-line block detection** (e.g. Try/Catch wrapping, AI-structured docstrings).
   - **AST structural analysis** (Python only: detects unreachable code, result-variable anti-patterns).
   - **Fuzzy cross-file repetition** (Catches repetitive AI scaffolding across multiple files).
   - **Inline suppression** (Lines with `# synthscan: ignore` are skipped).

3. **Scores are refined** by post-processing passes (clustering bonuses and diminishing returns per file).

### Synthetic Code Score

The headline metric is **score per 1 000 lines of code**:

`Synthetic Code Score = (Raw Score / Lines Scanned) * 1000`

This normalisation prevents large codebases from naturally accumulating higher scores than small ones.

**Reference ranges** (from benchmark testing):
- **0 – 5:** Likely human-written
- **5 – 15:** Low AI signal — review flagged lines
- **15 – 30:** Moderate AI signal
- **30+:** Strong AI signal

---

## 🤝 Contributing
Contributions, issues and feature requests are welcome!
Feel free to check [issues page](https://github.com/marcoramilli/SynthScan/issues).
If you find a new hallucination word or LLM tell, simply PR an addition to the `patterns/synthetic_patterns.md` file!

## 📝 License
Copyright © Marco Ramilli.  
This project is [MIT](LICENSE) licensed.
