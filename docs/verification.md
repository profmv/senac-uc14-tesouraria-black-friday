# Classroom release verification

The integrated site passed the calculation and browser checks before the initial publication. The verification scripts are in artifacts and the PROVA records are in governance.db.

| Scope | Evidence |
| --- | --- |
| Arithmetic and content | Recalculated 24 monetary amounts using decimal arithmetic and checked the results against both the presentation and the guide. Checked the 23.5% effective discount, four rounds and seven consecutive timetable blocks totaling 180 minutes. |
| Static delivery | Parsed all four pages as HTML5, checked their local references and unique IDs, decoded text as UTF-8, inspected the empty .nojekyll file and ran Node syntax checks. |
| Chrome on desktop | Exercised fullscreen, slide navigation, teacher notes, progressive reveals, timer, team limits and score persistence, and compared the six-month chart outputs. |
| Chrome on mobile | Exercised all four pages at 390 pixels, checked page widths, restored a checked guide block after reloading, and checked print control visibility. |
| Simulator | Exercised comma decimals, independent invalid input handling, restoration of results, and live recalculation. |

The integration review corrected the percentage-to-decimal notation in the teacher guide and a lesson-plan table that widened the mobile page. Chart text and line colors respond to theme changes. Printing and audience visibility on a specific physical projector depend on the classroom equipment.
