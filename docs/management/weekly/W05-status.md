**Introduction to Software Engineering**

**Weekly Status Report**

# **Objectives**

- Reporting weekly progress against the project plan.
- Recording issues and risks.
- Recording the weekly status meeting.

1. # **Submission**

- One report is prepared for each project week from Week 2 to Week 10.
- The Team Lead or backup is responsible for preparing the report.
- Earlier weekly reports must not be overwritten because repository history is evidence of timeliness.

2. # **Report Information**

| _Item_               | Value                                                                                                           |
| :------------------- | :-------------------------------------------------------------------------------------------------------------- |
| _Team_               | miniTA                                                                                                          |
| _Week_               | 5                                                                                                               |
| _Date of meeting_    | 01/11/2026                                                                                                      |
| _Current phase / PA_ | PA2 closeout and PA3 preparation                                                                                |
| _Prepared by_        | Nguyễn Cao Triết                                                                                                |
| _Overall status_     | Amber — PA2 content is integrated, but Jira subtask status, Screen IDs and final review evidence are incomplete |

1. ## **Task Status**

Jira status was checked on 02/11/2026. The document status is based on [`realPA/PA2-minTA.docx.md`](realPA/PA2-minTA.docx.md).

| WBS / task                                                                                                               | Owner            | Planned finish | Status        | % done       | Notes                                                                                                                                                                     |
| :----------------------------------------------------------------------------------------------------------------------- | :--------------- | :------------- | :------------ | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [SCRUM-10 — Draft requirements and integrate the SRS](https://nmcnpmteam1.atlassian.net/browse/SCRUM-10)                 | Nguyễn Cao Triết | 31/10/2026     | Done          | 100%         | Purpose, scope, glossary, problem statement, stakeholders, FR/NFR content, integration and review preparation are present in the PA2 document.                            |
| [SCRUM-11 — Define business rules and use cases](https://nmcnpmteam1.atlassian.net/browse/SCRUM-11)                      | Phùng Gia Mẫn    | 31/10/2026     | Done          | 100%         | Business Rules, actors, Use Case Diagram/List and UC-01–UC-08 specifications are integrated. Hiring Manager permissions and PDF handling were corrected during PM review. |
| [SCRUM-12 — Create low-fidelity mockups and interactive prototype](https://nmcnpmteam1.atlassian.net/browse/SCRUM-12)    | Tống Vân Anh     | 31/10/2026     | Done          | 100%         | Screen inventory, low-fidelity mockups, prototype flows and accessibility notes are included. Stable `SCR-xx` identifiers remain open.                                    |
| [SCRUM-13 — Define acceptance criteria and requirements traceability](https://nmcnpmteam1.atlassian.net/browse/SCRUM-13) | Nguyễn Thục Nghi | 31/10/2026     | Done          | 100%         | Given/When/Then criteria cover F01–F08 and the RTM covers FR-01–FR-34. Role-specific F07 mappings were corrected during PM review.                                        |
| [SCRUM-28 — Write Given/When/Then acceptance criteria](https://nmcnpmteam1.atlassian.net/browse/SCRUM-28)                | Nguyễn Thục Nghi | 31/10/2026     | In Review     | 90%          | Content is already integrated, but the subtask has not been closed in Jira.                                                                                               |
| [SCRUM-14–SCRUM-27 and SCRUM-29–SCRUM-30](https://nmcnpmteam1.atlassian.net/browse/SCRUM-14)                             | All PA2 owners   | 31/10/2026     | To Do in Jira | Not reliable | Sixteen subtasks remain To Do although all four parent Stories are Done and their artifacts are present in the integrated document.                                       |

2. ## **Plan for Next Week**

| WBS / task                                                                                                         | Owner                              | Planned finish |
| :----------------------------------------------------------------------------------------------------------------- | :--------------------------------- | :------------- |
| Review the PA3 Software Design template, confirm deliverables and organize the shared design workspace             | Whole team                         | 03/11/2026     |
| [3.1.1–3.1.2] Prepare C4 Container and Component Diagrams based on the PA2 requirements baseline                   | Tống Vân Anh                       | 06/11/2026     |
| [3.2.1–3.2.2] Research design options and prepare ADRs for the backend framework and database                      | Nguyễn Cao Triết                   | 06/11/2026     |
| [3.3.1–3.3.2] Identify core entities and relationships, then prepare the initial ERD                               | Nguyễn Thục Nghi                   | 06/11/2026     |
| Confirm and assign Mẫn's PA3 responsibility because the submitted PA1 WBS does not list a PA3 task for this member | Nguyễn Cao Triết and Phùng Gia Mẫn | 03/11/2026     |
| Conduct a PA3 kickoff review to check consistency among C4 diagrams, ADRs, the data model and PA2 requirements     | Whole team                         | 07/11/2026     |

3. ## **Issues and Risks**

| ID  | Description                                                                                                                                         | Impact                                                                                              | Action                                                                                                    | Owner                              | Due        |
| :-- | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :--------------------------------- | :--------- |
| R1  | All four PA2 parent Stories are Done, while sixteen subtasks remain To Do and SCRUM-28 remains In Review.                                           | High — Jira no longer provides trustworthy task-level progress or contribution evidence.            | Each owner reconciles subtask status and adds the artifact/evidence link before closing the PA2 baseline. | All PA2 owners                     | 03/11/2026 |
| R2  | The Prototype / Mockups section has screen names but no stable `SCR-xx` identifiers.                                                                | High — the RTM cannot complete a stable orphan-screen check or provide durable screen traceability. | Assign Screen IDs in the screen inventory, then replace RTM screen names with those IDs.                  | Tống Vân Anh and Nguyễn Thục Nghi  | 03/11/2026 |
| R3  | The Requirements Review log is still a working log; final attendance and evidence for the 5 MB, 72-hour and 100%-weight decisions are not attached. | Medium — the document should not yet be declared the final requirements baseline.                   | Confirm the review meeting record and link the decision evidence or revise unsupported values.            | Nguyễn Cao Triết and whole team    | 03/11/2026 |
| R4  | PA1 WBS assigns PA3 work to Triết, Vân Anh and Nghi but does not identify a PA3 task for Mẫn.                                                       | Medium — workload and contribution evidence may become unbalanced during PA3.                       | PM and Mẫn agree on a scoped PA3 review/traceability task before design work is distributed.              | Nguyễn Cao Triết and Phùng Gia Mẫn | 03/11/2026 |

4. ## **Meeting Minutes**

Attendance must be confirmed from the actual meeting record; artifact progress below is evidence-based.

| Member           | Present | Done since last meeting                                                                                                                                  | Next                                                                           | Blockers                                                          |
| :--------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| Nguyễn Cao Triết | Yes     | Integrated the PA2 SRS; finalized FR/NFR content; reviewed and corrected Hiring Manager permissions, PDF validation, missing use cases and RTM mappings. | Close PA2 evidence gaps and begin backend/database ADRs.                       | Formal review attendance and decision evidence remain incomplete. |
| Phùng Gia Mẫn    | Yes     | Supplied Business Rules, actors, Use Case Model and Use Case Specifications; UC-06 and UC-08 are now included.                                           | Confirm PA3 responsibility and support design review against the PA2 baseline. | No PA3 task is assigned to Mẫn in the submitted PA1 WBS.          |
| Tống Vân Anh     | Yes     | Supplied the Screen List, low-fidelity mockups, prototype flows and accessibility notes.                                                                 | Add stable Screen IDs and begin C4 diagrams/high-fidelity design preparation.  | Screen IDs are not yet stable in the RTM.                         |
| Nguyễn Thục Nghi | Yes     | Supplied Acceptance Criteria, RTM and testability review content; all FR-01–FR-34 are represented in the RTM.                                            | Close SCRUM-28, update Screen mappings and begin entity/ERD design.            | Final Screen-ID mapping depends on Vân Anh's updated inventory.   |

5. ## **Metrics**

| Metric                          | This week | Total |
| :------------------------------ | :-------- | :---- |
| Task                            | 4         | 12    |
| Commits                         | 2         | 5     |
| Pull requests merged / reviewed | 1         | 1     |
| Open defects (PA5)              | N/A       | N/A   |
