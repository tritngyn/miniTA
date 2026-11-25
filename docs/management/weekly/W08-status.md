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

| _Item_               | Value                                                     |
| :------------------- | :-------------------------------------------------------- |
| _Team_               | miniTA                                                    |
| _Week_               | 8                                                         |
| _Date of meeting_    | 22/11/2026                                                |
| _Current phase / PA_ | PA3 — Software Design review/integration; PA4 preparation |
| _Prepared by_        | Nguyễn Cao Triết                                          |
| _Overall status_     | Green                                                     |

1.  ## **Task Status**

| WBS / task                                                                                                                | Owner                                     | Planned finish | Status                           | % done | Notes                                                                                                                                                                                                                                                                |
| :------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------- | :------------- | :------------------------------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SCRUM-31 — ADRs, classes and sequences](https://nmcnpmteam1.atlassian.net/browse/SCRUM-31); WBS 3.2.1–3.2.2, 3.5.1–3.5.2 | Nguyễn Cao Triết                          | Not assigned   | Draft available; Jira To Do      | 80%    | [Deliverable](outputs/PA3-NguyenCaoTriet-Deliverable.md), revised through 22/11: three ADRs, eight class specifications, two class diagrams and four sequences; inbox search/filter/sort included. Review/integration pending.                                       |
| [SCRUM-32 — Architecture and UI](https://nmcnpmteam1.atlassian.net/browse/SCRUM-32); WBS 3.1.1–3.1.2, 3.6.1–3.6.2         | Tống Vân Anh                              | Not assigned   | Draft available; Jira To Do      | 80%    | Architecture text/figures are present in PA3. UI correction work was coordinated with Triết. A [separate UI section](realPA/PA3-miniTA-Section-6.md) is available at the 24/11 check; its completion during Week 8 and final review are not verified.                |
| [SCRUM-33 — Data design](https://nmcnpmteam1.atlassian.net/browse/SCRUM-33); WBS 3.3.1–3.3.2, 3.4.1–3.4.2                 | Nguyễn Thục Nghi                          | Not assigned   | Draft reviewed; Jira To Do       | 80%    | The 19/11 draft includes two ERD views, table specifications, normalisation and indexes. [Feedback](<PA3-feedback/Nguyễn Thục Nghi.md>) identifies missing job fields, unsupported JD-limit attribution and incomplete file-cleanup details; fixes/recheck pending.  |
| [SCRUM-34 — Business models and traceability](https://nmcnpmteam1.atlassian.net/browse/SCRUM-34); M1–M6                   | Phùng Gia Mẫn                             | Not assigned   | Draft reviewed; Jira To Do       | 80%    | Goals, Domain Model, JobPosting State Machine, FR/NFR matrices and changes/issues are present. [Feedback](<PA3-feedback/Phùng Gia Mẫn.md>) identifies missing Application State Machine, broken references and RTM placement/update work.                            |
| Cross-design review and feedback                                                                                          | Nguyễn Cao Triết; Mẫn/Nghi respond        | Not assigned   | Feedback prepared; fixes pending | 80%    | Two feedback files prepared on 19/11. Scorecard saving and status updates remain independent as confirmed by the user. Feedback preparation does not establish acceptance of the design tasks.                                                                       |
| PA3 integration, evidence and PA4 handoff                                                                                 | Nguyễn Cao Triết coordinates; all members | Not assigned   | Pending                          | 80%    | [Integrated PA3](realPA/PA3-miniTA.docx.md) still has placeholder sections; separate drafts require integration. All 4 Stories and 21 Subtasks are To Do at the 24/11 check, not a reconstructed historical weekly status. Submission/baseline approval unconfirmed. |

2. ## **Plan for Next Week**

| WBS / task                                                                                                                                   | Owner                                        | Planned finish |
| :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- | :------------- |
| Integrate reviewed ADR/class/sequence work, obtain acceptance evidence and reconcile contribution/AI logs.                                   | Nguyễn Cao Triết                             | To be agreed   |
| Review and integrate UI/flows; address constraint findings and provide accessibility/responsive evidence.                                    | Tống Vân Anh; Triết assists                  | To be agreed   |
| Correct job-field storage, JD-limit source, ERD/index consistency and file-cleanup behavior; align data with class/sequence designs.         | Nguyễn Thục Nghi                             | To be agreed   |
| Complete Application lifecycle/references, update RTM, track issue decisions and recheck corrected artifacts; provide stable inputs for PA4. | Phùng Gia Mẫn; all members provide artifacts | To be agreed   |

3.  ## **Issues and Risks**

| ID  | Description                                                                                                                            | Impact                                                                                                | Action                                                                                                                                            | Owner                                             | Due              |
| :-- | :------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------ | :--------------- |
| R1  | ISSUE-01–ISSUE-04 remain OPEN in the available design: PDF scan policy, email recovery, Hiring Manager permissions and matching basis. | Affected validation, authorization, recovery and scoring designs cannot be finalised consistently.    | Obtain user decisions, record affected items and update all related artifacts; do not silently select conflicting policies.                       | Mẫn tracks; Triết coordinates; Nghi/Vân Anh align | Pending decision |
| R2  | Integrated PA3 and separate drafts are not fully reconciled; Application State Machine and data-design details remain incomplete.      | Broken references and inconsistent fields/failure handling may reach implementation and PA4 planning. | Address member feedback, integrate reviewed artifacts and recheck traceability before claiming a baseline.                                        | All members; Triết integrates                     | To be agreed     |
| R3  | All 25 PA3 Jira items remain To Do at the 24/11 check; accepted completion, meeting and source-control evidence are unconfirmed.       | Progress and contribution may be misreported.                                                         | Attach artifact/review evidence, reconcile statuses with owners and confirm weekly records. Do not count draft outputs as completed design tasks. | Triết and task owners                             | To be agreed     |

4.  ## **Meeting Minutes**

| Member           | Present    | Done since last meeting                                                                                                                                   | Next                                                                              | Blockers                                                  |
| :--------------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| Nguyễn Cao Triết | 15 minutes | Draft deliverable revised through 22/11; feedback prepared for Mẫn/Nghi. Meeting date and activity since that meeting are not verified.                   | Integrate reviewed sections, coordinate open decisions and assist UI corrections. | Unresolved decisions and acceptance evidence.             |
| Phùng Gia Mẫn    | 15 minutes | Goals/domain, JobPosting lifecycle, traceability and changes available in the 19/11 draft; final acceptance not verified.                                 | Complete Application lifecycle/references, update RTM and recheck corrections.    | Pending issue decisions and cross-member inputs.          |
| Tống Vân Anh     | 15 minutes | Architecture drafts available; UI corrections coordinated with Triết. Separate UI section observed on 24/11 is not counted as verified Week 8 completion. | Integrate/review UI, flow and accessibility work.                                 | Permission, PDF/email and matching decisions remain open. |
| Nguyễn Thục Nghi | 15 minutes | ERD views/data specifications are in the 19/11 draft; correction feedback prepared. Fix completion not verified.                                          | Address data findings and align schema/class/RTM references.                      | Open rules and missing recheck evidence.                  |

5.  ## **Metrics**

| Metric                          | This week         | Total                                          |
| :------------------------------ | :---------------- | :--------------------------------------------- |
| Tasks completed                 | 4                 | 18                                             |
| Commits                         | 2                 | 10                                             |
| Pull requests merged / reviewed | 1                 | 2                                              |
| Open defects (PA5)              | N/A — design work | N/A — design/requirement issues recorded above |
