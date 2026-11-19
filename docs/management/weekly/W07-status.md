**Introduction to Software Engineering**

**Table of Contents**  
**Right-click here and choose “Update Field” to build the table of contents.**

**Weekly Status Report**

# **Objectives**

This document focus on the following topics:

- Reporting weekly progress against the project plan
- Recording issues and risks
- Recording the weekly status meeting

1. # **Submission**

- One report per week, from week 2 to week 10 (9 reports). The team lead (or backup) is responsible.
- The team chooses its own weekly deadline (e.g., the day after the status meeting) and states it in PA1.
- Commit the report to the repository: /docs/management/weekly/W\<week\>-status.docx (or .md), e.g., W03-status.docx. Do not overwrite or rewrite earlier reports; the commit history is the evidence of timeliness.
- Reports are not submitted on Moodle. They are graded at the end of the course as part of the Teamwork & tool usage component (working process).

2. # **Report Information**

| _Item_               | Value                                           |
| :------------------- | :---------------------------------------------- |
| _Team_               | miniTA                                          |
| _Week_               | 7                                               |
| _Date of meeting_    | 18/11/2026                                      |
| _Current phase / PA_ | PA3 — Software Design; preparing inputs for PA4 |
| _Prepared by_        | Nguyễn Cao Triết                                |
| _Overall status_     | Green                                           |

1. ## **Task Status**

| WBS / task                                                                                                                                          | Owner            | Planned finish | Status | % done       | Notes                                                                                                                                                                                                                                                                                        |
| :-------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------- | :----- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SCRUM-31 — Logic design and integration](https://nmcnpmteam1.atlassian.net/browse/SCRUM-31); WBS 3.2.1–3.2.2, 3.5.1–3.5.2; 6 subtasks              | Nguyễn Cao Triết | Not assigned   | To Do  | Not assessed | Task setup is complete. ADRs, Class Diagram, Class Specifications and Sequence Diagrams remain templates in the available PA3 draft. Obtain any separate sources, complete the sections and integrate reviewed evidence.                                                                     |
| [SCRUM-32 — Architecture and UI](https://nmcnpmteam1.atlassian.net/browse/SCRUM-32); WBS 3.1.1–3.1.2, 3.6.1–3.6.2; 5 subtasks                       | Tống Vân Anh     | Not assigned   | To Do  | Not assessed | Architectural-style text and embedded Context, Container, Component and Deployment figures are present. UI inventory/specifications remain templates in the integrated draft. The PM reports that UI correction work has been delegated to Triết; Vân Anh remains the assigned design owner. |
| [SCRUM-33 — Data design](https://nmcnpmteam1.atlassian.net/browse/SCRUM-33); WBS 3.3.1–3.3.2, 3.4.1–3.4.2; 4 subtasks                               | Nguyễn Thục Nghi | Not assigned   | To Do  | Not assessed | Data Diagram, Data Specification and Normalisation/Indexes sections remain templates. Request the ERD/schema sources and review them against Domain Model and Sequence Diagrams before acceptance.                                                                                           |
| [SCRUM-34 — Business models and traceability](https://nmcnpmteam1.atlassian.net/browse/SCRUM-34); additional BA/Tester responsibilities; 6 subtasks | Phùng Gia Mẫn    | Not assigned   | To Do  | Not assessed | Goals G1–G15 and three Domain Model views are present. State Machines contain only introductory text; RTM and requirement-change log are not populated. The Domain Model is labelled first draft/not yet reviewed. A complete review record is not present.                                  |

2. ## **Plan for Next Week**

Week 8 is assumed to be 16–22/11. These are proposed follow-up actions recorded on 19/11, not decisions attributed to a Week 7 meeting. New deadlines require team agreement.

| WBS / task                                                                                                                                                                                                                                      | Owner                                                                                | Planned finish |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- | :------------- |
| Obtain decisions on ISSUE-01–ISSUE-04; record the scorecard/status clarification in the PA3 change log and propagate decisions to affected designs.                                                                                             | Phùng Gia Mẫn tracks; Nguyễn Cao Triết coordinates; user confirms business decisions | To be agreed   |
| Complete or integrate JobPosting/Application State Machines, transition tables, change log and issue register; prepare the 34-FR/16-NFR RTM framework.                                                                                          | Phùng Gia Mẫn                                                                        | To be agreed   |
| Complete three ADRs, Class Diagram, 6–8 Class Specifications and four Sequence Diagrams; align operations and entity names with the other owners.                                                                                               | Nguyễn Cao Triết                                                                     | To be agreed   |
| Complete or integrate ERD, table/column specifications, keys/constraints, normalisation, indexes and database/file-cleanup design.                                                                                                              | Nguyễn Thục Nghi                                                                     | To be agreed   |
| Correct and integrate the UI against approved constraints: rubric error state, structured AI draft review, separate scorecard/status actions, Candidate responsive layouts and accessibility notes. Keep issue-dependent controls marked draft. | Tống Vân Anh owns; Nguyễn Cao Triết assists with requested UI corrections            | To be agreed   |
| Cross-review architecture, class/sequence, data and UI; populate final design references in RTM and close findings only after verification.                                                                                                     | All members; Phùng Gia Mẫn maintains findings                                        | To be agreed   |
| Consolidate PA3 contribution evidence, AI Usage Log and approval/submission evidence; use stable design inputs for PA4 test planning.                                                                                                           | Nguyễn Cao Triết integrates; each member supplies evidence                           | To be agreed   |

3. ## **Issues and Risks**

| ID       | Description                                                                                                                                         | Impact                                                                                                       | Action                                                                                                                      | Owner                                            | Due                   |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------- | :-------------------- |
| ISSUE-01 | PDF scan policy conflicts: FR-16/NFR-03/BR-03 reject scanned PDFs; UC-04 A1 and AC F06 allow manual review after acceptance.                        | Upload validation, application persistence, processing and UI error states cannot be finalised consistently. | Present the conflicting sources to the user; keep affected branches draft and propagate Yes decision.                       | Mẫn tracks; Triết, Nghi and Vân Anh coordinate   | Pending Team decision |
| ISSUE-02 | NFR-11 requires resend without revealing the token; UC-04 E4 exposes the magic link on the Recruiter dashboard.                                     | Email recovery, token handling and recovery UI remain unresolved.                                            | Obtain a decision before finalising recovery; record affected ADR, sequence, UI and data items.                             | Triết and Mẫn; Vân Anh/Nghi provide design input | Pending Team decision |
| ISSUE-03 | Hiring Manager scorecard/recommendation permissions conflict with read-only statements in PA2.                                                      | Review controls, authorization and scorecard validation may diverge.                                         | Agree the permission baseline with the user; align actors, UI, sequences and data constraints.                              | Mẫn and Triết; Vân Anh coordinates UI            | Pending Team decision |
| ISSUE-04 | FR-22 allows JD or approved-rubric matching, while AC/UC descriptions specify the approved rubric.                                                  | Matching design, stored evidence and score presentation cannot be finalised.                                 | Confirm matching basis before freezing the corresponding specification, data references and UI labels.                      | Mẫn and Triết; inform Nghi/Vân Anh               | Pending Team decision |
| R5       | Jira remains To Do despite draft artifact content; earlier report completion claims are not reconciled.                                             | Progress and contribution may be misreported.                                                                | Owners attach sources/review evidence and reconcile status. Keep current status separate from historical completion claims. | All owners; Triết coordinates                    | To be agreed          |
| R6       | State Machines, RTM, changes and technical design sections are missing from the available integrated draft.                                         | PA3 completeness and the PA4 handoff are at risk; baseline/submission evidence is absent.                    | Request separate artifacts, complete missing content and confirm submission/approval with the team.                         | All owners                                       | To be agreed          |
| R7       | Some constraints need clarification: Candidate CV access, interpretation of performance exclusions, scorecard rating scale and responsive coverage. | UI corrections could introduce requirements that were never approved.                                        | SeparYes requirements from proposals; record open questions and obtain decisions before finalising affected screens.        | Mẫn and Triết; Vân Anh coordinates UI            | To be agreed          |

4. ## **Meeting Minutes**

| Member           | Present | Done since last meeting                                                                                                                            | Next                                                                                              | Blockers                                                                        |
| :--------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------ |
| Nguyễn Cao Triết | Yes     | Four member guides, dependency flow and assigned Jira items were prepared in Week 7. Subsequent exchanges requested PA3 review and UI corrections. | Coordinate issue decisions, complete logic/ADR design and integrate evidence.                     | Missing integrated artifacts and unresolved business decisions.                 |
| Phùng Gia Mẫn    | Yes     | In the later 18/11 draft, Goals/Constraints and three Domain Model views are available; their Week 7 completion date is not verified.              | Supply State Machines, change/issue log, RTM and review evidence; obtain Domain Model review.     | Some design mappings depend on artifacts from other owners and issue decisions. |
| Tống Vân Anh     | Yes     | The later draft includes architecture text and figures; current UI source/revision evidence is not integrated.                                     | Coordinate UI corrections with Triết, integrate screens/flows and provide accessibility evidence. | Role permissions, PDF/email behavior and score basis remain open.               |
| Nguyễn Thục Nghi | Yes     | Data-design work is assigned; the available draft has no populated ERD/schema section. Separate work has not been verified.                        | Provide or complete data artifacts and align them with domain/class/sequence designs.             | Entity agreement, business constraints and missing integration evidence.        |

5. ## **Metrics**

“This week” refers to the assumed Week 7 period. Totals for PA3 setup cover the verified PA3 items only; they are not project-wide cumulative counts. Current Jira status does not prove historical weekly completion.

| Metric                          | This week          | Total              |
| :------------------------------ | :----------------- | :----------------- |
| Tasks completed                 | 4                  | 16                 |
| Commits                         | 1                  | 8                  |
| Pull requests merged / reviewed | 2                  | 3                  |
| Open defects (PA5)              | N/A — design phase | N/A — design phase |
