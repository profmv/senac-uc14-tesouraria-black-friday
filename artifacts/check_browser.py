"""Exercise the published lesson in desktop and mobile Chrome. Pass a site base URL."""

from pathlib import Path
import sys
from playwright.sync_api import sync_playwright, expect

base = sys.argv[1].rstrip("/") + "/"
out = Path(__file__).resolve().parent

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="chrome")
    page = browser.new_page(viewport={"width": 1366, "height": 768})
    errors = []
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.on("response", lambda response: errors.append(str(response.status) + " " + response.url)
            if response.status >= 400 else None)
    page.goto(base, wait_until="networkidle")
    expect(page.locator("#sim-difference")).to_contain_text("155,06")
    page.locator("#sim-factor-rate").fill("2,5")
    expect(page.locator("#sim-increase")).to_contain_text("102,50")
    page.locator("#sim-factor-value").fill("inválido")
    expect(page.locator("#sim-factor-results")).to_be_hidden()
    page.locator("#sim-months").fill("6")
    expect(page.locator("#sim-simple")).to_contain_text("13.000,00")
    page.locator("#sim-factor-value").fill("100,00")
    expect(page.locator("#sim-factor-results")).to_be_visible()
    page.locator("[data-theme-toggle]").click()
    page.locator(".hero-action").click()
    expect(page.locator("html")).to_have_attribute("data-theme", "dark")
    page.keyboard.press("f")
    expect(page.locator("html")).to_be_visible()
    assert page.evaluate("!!document.fullscreenElement")
    page.keyboard.press("f")
    page.keyboard.press("Space")
    expect(page.locator("#slide-count")).to_have_text("2 / 11")
    page.keyboard.press("ArrowLeft")
    for _ in range(4):
        page.keyboard.press("ArrowRight")
    expect(page.locator(".slide.active .answer")).to_be_hidden()
    page.keyboard.press("r")
    expect(page.locator(".slide.active .answer")).to_contain_text("15.200,00")
    page.keyboard.press("p")
    expect(page.locator("#notes-dialog")).to_be_visible()
    page.keyboard.press("Escape")
    page.locator("[data-minutes='10']").click()
    page.locator("#timer-play").click()
    expect(page.locator("#timer-display")).to_have_text("09:59", timeout=3500)
    page.locator("#timer-play").click()
    page.locator("#timer-reset").click()
    expect(page.locator("#timer-display")).to_have_text("10:00")
    page.locator("#score-open").click()
    assert page.locator("#teams .team").count() == 4
    page.locator("#add-team").click()
    page.locator("#add-team").click()
    expect(page.locator("#add-team")).to_be_disabled()
    page.locator(".team input").first.fill("Equipe Caixa")
    for amount in ["+10", "+5", "-5"]:
        page.locator(".team").first.get_by_text(amount, exact=True).click()
    page.reload()
    page.locator("#score-open").click()
    expect(page.locator(".team input").first).to_have_value("Equipe Caixa")
    expect(page.locator(".team-score").first).to_have_text("10 pts")
    page.keyboard.press("Escape")
    for _ in range(7):
        page.keyboard.press("ArrowRight")
    page.keyboard.press("r")
    page.locator("#months").fill("6")
    chart = page.evaluate("Chart.getChart('debt-chart').data.datasets.map(s => s.data.at(-1))")
    assert [round(x, 2) for x in chart] == [13000, 13400.96, 19738.23]
    page.wait_for_function("getComputedStyle(document.querySelector('.slide.active .answer')).opacity === '1'")
    page.screenshot(path=out / "round3-integration.png", animations="disabled")
    page.set_viewport_size({"width": 390, "height": 844})
    for filename in ["index.html", "slides.html", "guia-professor.html", "plano-de-aula.html"]:
        page.goto(base + filename, wait_until="networkidle")
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth"), filename
        if filename == "index.html":
            page.locator("[data-theme-toggle]").click()
            page.screenshot(path=out / "hub-mobile.png")
        if filename == "guia-professor.html":
            page.locator("#b1").check()
            page.reload()
            expect(page.locator("#b1")).to_be_checked()
            expect(page.locator("[data-progress-count]")).to_contain_text("1 de 7")
        if filename in ("plano-de-aula.html", "guia-professor.html"):
            page.emulate_media(media="print")
            expect(page.locator(".teach-header")).to_be_hidden()
            page.emulate_media(media="screen")
    assert not errors, errors
    browser.close()
    print("[OK] Chrome verified desktop and mobile routes, keyboards, fullscreen, notes, timer, scoreboard, charts, calculator validation, theme persistence, guide progress and print controls.")
