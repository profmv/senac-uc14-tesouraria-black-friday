"""Verify the financial examples, local links, encoding, markup, scripts and timeline."""

from datetime import datetime
from decimal import Decimal as D, ROUND_HALF_UP
from pathlib import Path
import re
import subprocess

from bs4 import BeautifulSoup
import html5lib

ROOT = Path(__file__).resolve().parents[1]
PAGES = ["index.html", "slides.html", "guia-professor.html", "plano-de-aula.html"]


def br(value):
    cents = D(value).quantize(D("0.01"), rounding=ROUND_HALF_UP)
    return f"{cents:,.2f}".translate(str.maketrans(",.", ".,"))


def verify():
    parsed = {}
    for name in PAGES:
        source = (ROOT / name).read_bytes()
        parser = html5lib.HTMLParser()
        parser.parse(source, override_encoding="utf-8")
        assert not parser.errors, (name, parser.errors)
        doc = BeautifulSoup(source.decode("utf-8"), "html.parser")
        parsed[name] = doc
        assert doc.html["lang"] == "pt-BR" and len(doc.find_all("h1")) == 1
        ids = [tag["id"] for tag in doc.select("[id]")]
        assert len(ids) == len(set(ids)), name
        for el in doc.select("[href], [src]"):
            target = el.get("href", el.get("src"))
            if target.startswith("#"):
                assert target[1:] in ids, (name, target)
            elif "://" not in target:
                assert (ROOT / target).exists(), (name, target)
    for path in [*ROOT.glob("*.md"), *ROOT.glob("*.html"), *ROOT.glob("assets/**/*.js"),
                 *ROOT.glob("assets/**/*.css"), *ROOT.glob("docs/**/*.md"), *ROOT.glob("artifacts/*.py")]:
        raw = path.read_bytes()
        assert not raw.startswith(b"\xef\xbb\xbf"), path
        raw.decode("utf-8")
    for path in ROOT.glob("assets/**/*.js"):
        subprocess.run(["node", "--check", str(path)], check=True)
    for css in ROOT.glob("assets/*.css"):
        for target in re.findall(r"url\(['\"]?([^)'\"]+)", css.read_text(encoding="utf-8")):
            assert (css.parent / target).is_file(), (css, target)
    assert (ROOT / ".nojekyll").read_bytes() == b""
    guide = parsed["guia-professor.html"]
    slides = parsed["slides.html"]
    expected_minutes = [15, 25, 35, 15, 50, 25, 15]
    blocks = guide.select(".block")
    assert len(blocks) == len(expected_minutes) and sum(expected_minutes) == 180
    cursor = "19:00"
    for block, minutes in zip(blocks, expected_minutes):
        start, end = re.findall(r"\d{2}:\d{2}", block.select_one(".time").text)
        assert start == cursor
        assert (datetime.strptime(end, "%H:%M") - datetime.strptime(start, "%H:%M")).seconds == minutes * 60
        cursor = end
        assert len(block.select(".note")) == 4 and block.select_one("input[type=checkbox]")
    assert cursor == "22:00" and len(slides.select(".round .answer[hidden]")) == 4

    ice = D(100) * D("1.20")
    cascade = D(20000) * D(".85")
    a, b = cascade * D(".90"), D(20000) * D(".76")
    fees = D(30000) * D(".025") * 3
    card, pix = 30000 - fees, 30000 * D(".94")
    simple = 10000 * (1 + D(".05") * 4)
    debt = [10000 * D("1.05") ** month for month in range(1, 5)]
    rotating = 10000 * D("1.12") ** 6
    cdb = [40000 * D("1.01") ** month for month in range(1, 4)]
    gross = cdb[-1] - 40000
    tax = (gross * D(".225")).quantize(D(".01"), rounding=ROUND_HALF_UP)
    assert (ice * D(".8") - 100) == -4
    assert (1 - a / 20000) * 100 == D("23.5")
    values = [ice, ice * D(".80"), cascade, a, b, a-b, fees, card, pix, pix-card, simple-10000,
              simple, *debt, debt[-1]-simple, rotating, *cdb, gross, tax, gross-tax]
    for doc in (guide, slides):
        text = doc.get_text(" ", strip=True)
        for value in values:
            formatted = br(value)
            # Intermediate whole-real amounts may omit the centavos.
            pattern = re.escape(formatted).replace(",00", "(?:,00)?") if formatted.endswith(",00") else re.escape(formatted)
            assert re.search(r"(?<![\d.,])" + pattern + r"(?![\d,])", text), formatted
        assert "23,5%" in text and "02/12" in text
    # Variable balloons: every data-var used must exist in the data file; both pages load CSS and scripts.
    data_path = ROOT / "assets" / "variaveis-dados.js"
    assert data_path.is_file(), "assets/variaveis-dados.js ausente"
    keys = set(re.findall(r"^\s{2}(\w+):\s*\{", data_path.read_text(encoding="utf-8"), re.M))
    assert {"C", "i", "t", "J", "M", "valor", "fator", "potencia"} <= keys, keys
    used_total = 0
    for name in ("slides.html", "guia-professor.html"):
        doc = parsed[name]
        used = {tag["data-var"] for tag in doc.select("[data-var]")}
        assert used and used <= keys, (name, used - keys)
        used_total += len(doc.select("button.var[data-var]"))
        assert doc.select_one('link[rel=stylesheet][href="assets/variaveis.css"]'), name
        sources = [tag["src"] for tag in doc.select("script[src]")]
        assert "assets/variaveis-dados.js" in sources and "assets/variaveis.js" in sources, name
        assert sources.index("assets/variaveis-dados.js") < sources.index("assets/variaveis.js"), name
    print(f"[OK] {used_total} variable balloons use keys present in variaveis-dados.js.")
    print(f"[OK] {len(PAGES)} HTML pages, all application scripts and local references, UTF-8, seven blocks / 180 minutes, four rounds and {len(values)} financial amounts.")


if __name__ == "__main__":
    verify()
