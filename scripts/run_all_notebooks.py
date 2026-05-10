# -*- coding: utf-8 -*-
from pathlib import Path
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]


def main():
    notebooks = sorted(ROOT.glob("*학년_*/*/ch*/notebook.ipynb"))
    print(f"found {len(notebooks)} notebooks")
    failures = []
    for notebook in notebooks:
        print(f"\n[execute] {notebook.relative_to(ROOT)}")
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "jupyter",
                "nbconvert",
                "--to",
                "notebook",
                "--execute",
                "--inplace",
                str(notebook),
            ],
            cwd=ROOT,
        )
        if result.returncode != 0:
            failures.append(notebook)
    if failures:
        print("\nFailures:")
        for failure in failures:
            print(f"- {failure.relative_to(ROOT)}")
        raise SystemExit(1)
    print("\nAll notebooks completed.")


if __name__ == "__main__":
    main()
