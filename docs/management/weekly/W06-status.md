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

| _Item_               | Value                                                                                                             |
| :------------------- | :---------------------------------------------------------------------------------------------------------------- |
| _Team_               | miniTA                                                                                                            |
| _Week_               | 6                                                                                                                 |
| _Date of meeting_    | 08/11/2026                                                                                                        |
| _Current phase / PA_ | PA3 — Software Design                                                                                             |
| _Prepared by_        | Nguyễn Cao Triết                                                                                                  |
| _Overall status_     | Green — PA3 is progressing according to the Gantt plan; initial architecture and data-design work is on schedule. |

1. ## **Task Status**

| WBS / task                                                   | Owner            | Planned finish | Status      | % done | Notes                                                                                                                 |
| :----------------------------------------------------------- | :--------------- | :------------- | :---------- | :----- | :-------------------------------------------------------------------------------------------------------------------- |
| [3.1.1–3.1.2] C4 Container and Component Diagrams            | Tống Vân Anh     | 04/11/2026     | Done        | 100%   | Initial diagrams identify the web application, backend services, database, file storage and major functional modules. |
| [3.2.1–3.2.2] ADRs for backend framework and database        | Nguyễn Cao Triết | 05/11/2026     | Done        | 100%   | Backend and database choices were documented with context, alternatives, decisions and consequences.                  |
| [3.3.1–3.3.2] Core entities, relationships and initial ERD   | Nguyễn Thục Nghi | 06/11/2026     | Done        | 100%   | The initial data model covers accounts, jobs, rubrics, candidates, applications, evaluations and status history.      |
| [3.4.1–3.4.2] Table schemas, constraints, keys and indexes   | Nguyễn Thục Nghi | 10/11/2026     | In Progress | 50%    | Main tables and data types have been drafted; constraints and indexing require completion and cross-checking.         |
| PA2-to-PA3 design traceability and consistency review        | Phùng Gia Mẫn    | 12/11/2026     | In Progress | 40%    | Use cases and business rules are being checked against architecture, entities and planned design-level interactions.  |
| [3.5.1–3.5.2] Class and Sequence Diagrams                    | Nguyễn Cao Triết | 12/11/2026     | Planned     | 10%    | Key classes and critical use cases have been selected; detailed diagrams are scheduled for Week 7.                    |
| [3.6.1–3.6.2] High-fidelity UI and complete navigation flows | Tống Vân Anh     | 14/11/2026     | Planned     | 10%    | PA2 low-fidelity screens are the baseline; detailed UI and screen-flow work is scheduled to start in Week 7.          |

2. ## **Plan for Next Week**

| WBS / task                                                                                       | Owner            | Planned finish |
| :----------------------------------------------------------------------------------------------- | :--------------- | :------------- |
| [3.4.1–3.4.2] Finalize table schemas, data types, primary/foreign keys, constraints and indexes  | Nguyễn Thục Nghi | 10/11/2026     |
| [3.5.1] Complete design-level Class Diagrams for the core domain and service logic               | Nguyễn Cao Triết | 11/11/2026     |
| [3.5.2] Complete Sequence Diagrams for 3–5 critical use cases, including alternative flows       | Nguyễn Cao Triết | 12/11/2026     |
| [3.6.1–3.6.2] Produce high-fidelity UI designs and the complete screen-navigation flow           | Tống Vân Anh     | 14/11/2026     |
| Verify PA2 use cases and business rules against C4, database, class and sequence designs         | Phùng Gia Mẫn    | 12/11/2026     |
| Conduct a cross-design review and resolve inconsistencies before integrating the PA3 deliverable | Whole team       | 14/11/2026     |

3. ## **Issues and Risks**

| ID  | Description                                                                                      | Impact                                                                                    | Action                                                                                                  | Owner                                 | Due        |
| :-- | :----------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ | :------------------------------------ | :--------- |
| R1  | Architecture, database and UI artefacts are being developed separately.                          | High — inconsistent names or responsibilities may break traceability across PA3 sections. | Use the PA2 glossary and FR/UC identifiers consistently, then conduct a cross-design review.            | Whole team                            | 14/11/2026 |
| R2  | The initial ERD may change when detailed use-case interactions and class operations are modeled. | Medium — late changes could require reworking schemas and sequence diagrams.              | Review the ERD against critical use cases before freezing keys, constraints and indexes.                | Nguyễn Thục Nghi and Nguyễn Cao Triết | 10/11/2026 |
| R3  | Mẫn has no formal PA3 work item in the submitted PA1 WBS.                                        | Medium — workload and contribution evidence may be unbalanced.                            | Record design traceability and consistency review as Mẫn's supporting PA3 responsibility.               | Nguyễn Cao Triết and Phùng Gia Mẫn    | 12/11/2026 |
| R4  | PA3 source artefacts are not yet consolidated in the shared submission structure.                | Medium — completed work may lack reviewable evidence or be difficult to integrate.        | Store editable diagrams and ADRs under the agreed design folder and link them from the PA3 deliverable. | Whole team                            | 12/11/2026 |

4. ## **Meeting Minutes**

| Member           | Present | Done since last meeting                                                                                | Next                                                                                    | Blockers                                                            |
| :--------------- | :------ | :----------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| Nguyễn Cao Triết | Yes     | Prepared the backend and database ADRs and selected the critical flows for detailed behavioral design. | Complete Class and Sequence Diagrams and coordinate the PA3 cross-design review.        | Diagram operations depend on the finalized entity and schema names. |
| Phùng Gia Mẫn    | Yes     | Reviewed PA2 business rules and use cases as inputs for the PA3 design.                                | Build a traceability checklist and report inconsistencies across PA2 and PA3 artefacts. | The submitted WBS does not contain a formal PA3 task for this role. |
| Tống Vân Anh     | Yes     | Prepared initial C4 Container and Component Diagrams based on the PA2 system scope.                    | Develop high-fidelity UI screens and the complete screen-navigation flow.               | UI naming must remain aligned with the PA2 screen inventory.        |
| Nguyễn Thục Nghi | Yes     | Identified core entities and relationships and prepared the initial ERD.                               | Finalize schemas, constraints, primary/foreign keys and indexes.                        | Some constraints depend on the detailed class and sequence designs. |

5. ## **Metrics**

| Metric                          | This week | Total |
| :------------------------------ | :-------- | :---- |
| tasks                           | 3         | 15    |
| Commits                         | 2         | 7     |
| Pull requests merged / reviewed | 0         | 1     |
| Open defects (PA5)              | N/A       | N/A   |
