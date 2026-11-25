import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ApplicantHeader } from '../../components/ApplicantHeader';
import { Section } from '../../components/PageHeader';
import { Surface, DetailList } from '../../components/Surface';
import { Callout } from '../../components/Callout';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { formatDate, useDemo } from '../../data/store';
import { statusStyle, tokens } from '../../theme';

export function ApplicantDetail() {
  const { applications, jobs } = useDemo();
  const [searchParams] = useSearchParams();
  const requestedId = searchParams.get('application');
  const scenario = searchParams.get('state');

  const application =
    applications.find((item) => item.id === requestedId) ??
    applications.find((item) => item.id === (scenario === 'extraction-failed' ? 'APP-1045' : 'APP-1041')) ??
    applications[0];
  const job = jobs.find((item) => item.id === application.jobId);
  const extractionFailed = application.matchState === 'extraction-failed';
  const latestNotes = application.notes.slice(0, 2);

  return (
    <ApplicantHeader application={application} job={job} active="detail">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 20 }}>
          <Section title="Matching result" id="matching">
            <Surface>
              {extractionFailed ? (
                <Callout variant="warning" title="Matching score not available">
                  The CV text could not be extracted from this file, so no score was calculated. Open the
                  original PDF and review it manually.
                </Callout>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <span className="tabular" style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em' }}>
                      {application.matchScore}%
                    </span>
                    <span style={{ fontSize: 14, color: tokens.textSecondary }}>matching score</span>
                  </div>
                  <p style={{ margin: '4px 0 18px', fontSize: 13, color: tokens.textMuted }}>
                    Decision support only. A reviewer decides every status change; the score never changes a
                    status.
                  </p>

                  <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>Evidence from the CV</h3>
                  <ul style={{ listStyle: 'none', margin: '0 0 18px', padding: 0, display: 'grid', gap: 10 }}>
                    {application.evidence.map((item) => (
                      <li
                        key={item.quote}
                        style={{
                          background: tokens.surfaceSunken,
                          borderRadius: 8,
                          padding: '10px 12px',
                          fontSize: 13.5,
                          lineHeight: 1.6,
                        }}
                      >
                        <div style={{ fontStyle: 'italic', color: tokens.ink }}>“{item.quote}”</div>
                        <div style={{ marginTop: 4, fontSize: 12.5, color: tokens.textSecondary }}>
                          Matched criterion: {item.criterion}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>Missing criteria</h3>
                  <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', margin: 0, padding: 0 }}>
                    {application.missing.map((item) => (
                      <li
                        key={item}
                        style={{
                          padding: '3px 9px',
                          borderRadius: 999,
                          background: tokens.dangerSoft,
                          color: tokens.danger,
                          fontSize: 12.5,
                          fontWeight: 500,
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Surface>
          </Section>

          <Section title="Screening answers" id="answers">
            <Surface>
              <dl style={{ margin: 0, display: 'grid', gap: 14 }}>
                {application.answers.map((answer) => (
                  <div key={answer.question}>
                    <dt style={{ fontSize: 13.5, fontWeight: 600 }}>{answer.question}</dt>
                    <dd style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.65, color: tokens.textSecondary }}>
                      {answer.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </Surface>
          </Section>

          <Section
            title="Internal notes"
            id="notes-preview"
            actions={
              <Button size="small" variant="outlined" component={RouterLink} to={`/screens/SCR-18?application=${application.id}`}>
                Open notes
              </Button>
            }
          >
            {latestNotes.length === 0 ? (
              <Surface>
                <p style={{ margin: 0, fontSize: 14, color: tokens.textSecondary }}>No notes yet.</p>
              </Surface>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {latestNotes.map((note) => (
                  <Surface key={note.id} padding="14px 16px">
                    <div style={{ fontSize: 12.5, color: tokens.textMuted }}>
                      {note.author} · {formatDate(note.createdAt)}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.6 }}>{note.body}</p>
                  </Surface>
                ))}
              </div>
            )}
          </Section>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <Section title="Candidate" id="candidate">
            <Surface>
              <DetailList
                rows={[
                  { label: 'Email', value: application.email },
                  { label: 'Phone', value: application.phone },
                  { label: 'Application', value: <span className="tabular">{application.id}</span> },
                  { label: 'Applied', value: formatDate(application.appliedOn) },
                  { label: 'Official status', value: <span style={{ color: statusStyle[application.status].fg, fontWeight: 600 }}>{application.status}</span> },
                ]}
              />
            </Surface>
          </Section>

          <Section title="CV" id="cv">
            <Surface>
              {application.cvFileName ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <DescriptionOutlinedIcon sx={{ fontSize: 20, color: tokens.textSecondary }} />
                    <span style={{ fontSize: 14 }}>{application.cvFileName}</span>
                  </div>
                  <p style={{ margin: '10px 0 0', fontSize: 12.5, lineHeight: 1.55, color: tokens.textMuted }}>
                    The file lives in private storage. Preview and download are outside this frontend
                    prototype, so the PDF is not rendered here.
                  </p>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: 14, color: tokens.textSecondary }}>No CV attached.</p>
              )}
            </Surface>
          </Section>

          <Section title="Scorecard" id="scorecard-summary">
            {application.scorecard ? (
              <Surface>
                <p style={{ margin: 0, fontSize: 14 }}>
                  Saved {formatDate(application.scorecard.savedAt)} ·{' '}
                  {Object.keys(application.scorecard.ratings).length} criteria rated
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 12.5, color: tokens.textMuted }}>
                  The scorecard does not change the official status.
                </p>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ marginTop: '12px' }}
                  component={RouterLink}
                  to={`/screens/SCR-19?application=${application.id}`}
                >
                  Open scorecard
                </Button>
              </Surface>
            ) : (
              <Surface>
                <p style={{ margin: '0 0 12px', fontSize: 14, color: tokens.textSecondary }}>
                  No scorecard saved yet.
                </p>
                <Button size="small" variant="outlined" component={RouterLink} to={`/screens/SCR-19?application=${application.id}`}>
                  Add a scorecard
                </Button>
              </Surface>
            )}
          </Section>
        </div>
      </div>
    </ApplicantHeader>
  );
}
