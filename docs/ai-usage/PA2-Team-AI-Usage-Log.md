# miniTA — PA2 AI Usage Log

## Document Information

| Item | Value |
| :---- | :---- |
| Phase | PA2 — Software Requirements Specification |
| Prepared by | Nguyễn Cao Triết — Team Lead / PM |
| Prepared on | 02/11/2026 |
| Primary evidence | [`realPA/PA2-minTA.docx.md`](realPA/PA2-minTA.docx.md) |
| Related Jira Stories | [SCRUM-10](https://nmcnpmteam1.atlassian.net/browse/SCRUM-10), [SCRUM-11](https://nmcnpmteam1.atlassian.net/browse/SCRUM-11), [SCRUM-12](https://nmcnpmteam1.atlassian.net/browse/SCRUM-12), [SCRUM-13](https://nmcnpmteam1.atlassian.net/browse/SCRUM-13) |

## Usage Log

| # | Member | Tool | Task / purpose | How the output was verified and changed |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Nguyễn Cao Triết | OpenAI Codex | Drafted and reviewed the working Requirements Baseline, Purpose and Scope, Glossary, Problem Statement, Stakeholders, Functional Requirements, measurable Non-Functional Requirements, integration checklist and Requirements Review issue register. | Compared the draft against `realPA/PA1-miniTA.docx.md` and the official PA2 template. Removed unsupported stakeholders and scope, retained F01–F08 as Must-have and F09–F10 as Won't-have, separated approved requirements from proposals and preserved human recruitment decisions. Nguyễn Cao Triết performed the final content review before integration. |
| 2 | Nguyễn Cao Triết | OpenAI Codex | Reviewed and corrected Business Rules, Acceptance Criteria, Use Case Model/Specifications and the RTM after the PA2 sections were integrated. | Checked every correction against FR-01–FR-34 and the approved Hiring Manager permission baseline. Corrected read-only Hiring Manager descriptions, rejected non-selectable PDFs consistently with the OCR exclusion, removed unapproved metrics and implementation-specific details, added UC-06 and UC-08, updated role-specific RTM mappings and ran a structural check confirming 8/8 feature criteria, 8/8 Must-have UC specifications and 34/34 FRs in the RTM. |
| 3 | Phùng Gia Mẫn | Gemini | Drafted Business Rules and Use Case Specifications for the PA2 recruitment workflows. | Cross-checked the flows against PA1 Features F01–F08 and FR-01–FR-34. Automated rejection was removed, Recruiter approval remained mandatory and the later PM review corrected Hiring Manager permissions, selectable-PDF handling and the missing UC-06/UC-08 specifications. |
| 4 | Phùng Gia Mẫn | Gemini | Generated initial PlantUML content for the Use Case Diagram. | Compared actors and associations with the Actor table and Use Case List. The final source associates Hiring Managers with UC-06 and UC-07, retains Recruiter-only management use cases and removes helper use cases that were absent from the Use Case List. |
| 5 | Nguyễn Thục Nghi | Gemini | Drafted and reviewed Given/When/Then Acceptance Criteria, the Requirements Traceability Matrix and Requirements Review findings. | Checked criteria against the Functional Requirements and Business Rules. Removed unsupported timing/length metrics, added Hiring Manager authorization and recommendation cases, corrected selectable-PDF handling, separated F07 mappings by role and retained the missing Screen-ID work as an open issue. |
| 6 | Tống Vân Anh | Gemini | Suggested the screen inventory and main elements for F01–F08 and proposed a low-fidelity layout using a recruitment platform as a visual reference. | Compared suggested screens with UC-01–UC-08 and removed screens outside F01–F08. Screen names were changed to approved SRS terminology such as Evaluation Rubric, Matching Score, Application Status, Magic Link and Human Scorecard. |
| 7 | Tống Vân Anh | Figma AI | Generated the first low-fidelity mockups in the UL-SE Figma file. | Checked generated frames against the SRS Screen List and use cases, renamed frames, removed role-inappropriate controls, separated Candidate and Recruiter flows, changed remaining Vietnamese UI text to English and manually reviewed contrast, labels and keyboard accessibility. |

## Member Declaration Summary

| Member | Significant AI use declared | Human verification recorded | Remaining action |
| :---- | :---- | :---- | :---- |
| Nguyễn Cao Triết | Yes — OpenAI Codex | Yes | Confirm final PA2 review attendance and evidence before baseline declaration. |
| Phùng Gia Mẫn | Yes — Gemini | Yes | Confirm the final rendered Use Case Diagram matches the corrected PlantUML source. |
| Tống Vân Anh | Yes — Gemini and Figma AI | Yes | Add stable `SCR-xx` identifiers to the final Screen List. |
| Nguyễn Thục Nghi | Yes — Gemini | Yes | Replace RTM screen names with stable Screen IDs after they are assigned. |

## Verification Statement

AI output was treated as draft material and was not accepted as authoritative project evidence by itself. Product scope and requirements were checked against the submitted PA1 document, the official PA2 template and the team-approved requirements decisions. The final PA2 document remains subject to human review by the named contributors and the Team Lead.
