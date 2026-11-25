import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { ApplicantHeader } from '../../components/ApplicantHeader';
import { Section } from '../../components/PageHeader';
import { Surface } from '../../components/Surface';
import { Field } from '../../components/FormField';
import { Callout } from '../../components/Callout';
import { formatDate, useDemo } from '../../data/store';
import { tokens } from '../../theme';

export function InternalNotes() {
  const { applications, jobs, addNote } = useDemo();
  const [searchParams] = useSearchParams();
  const application =
    applications.find((item) => item.id === searchParams.get('application')) ?? applications[0];
  const job = jobs.find((item) => item.id === application.jobId);

  const [note, setNote] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [saved, setSaved] = useState(false);
  const noteError = note.trim() ? undefined : 'Write the note before saving.';

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setAttempted(true);
    if (noteError) return;
    addNote(application.id, note.trim());
    setNote('');
    setAttempted(false);
    setSaved(true);
  };

  return (
    <ApplicantHeader application={application} job={job} active="notes">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 20, alignItems: 'start' }}>
        <Section title="Notes" description="Newest first. Internal only — never shown to candidates." id="notes-list">
          {application.notes.length === 0 ? (
            <Surface>
              <p style={{ margin: 0, fontSize: 14, color: tokens.textSecondary }}>
                No notes yet. Use the form to record a decision, context or next step.
              </p>
            </Surface>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {application.notes.map((item) => (
                <Surface key={item.id} padding="14px 16px">
                  <div style={{ fontSize: 12.5, color: tokens.textMuted }}>
                    {item.author} · {formatDate(item.createdAt)}
                  </div>
                  <p style={{ margin: '5px 0 0', fontSize: 14.5, lineHeight: 1.6 }}>{item.body}</p>
                </Surface>
              ))}
            </div>
          )}
        </Section>

        <div>
          <Section title="Add a note" id="add-note">
            <Surface>
              {saved ? (
                <div style={{ marginBottom: 14 }}>
                  <Callout variant="success" role="status">
                    Note saved. The official status is unchanged.
                  </Callout>
                </div>
              ) : null}
              <form noValidate onSubmit={submit}>
                <Field
                  id="note-input"
                  label="Note"
                  required
                  multiline
                  minRows={4}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  error={attempted && Boolean(noteError)}
                  helperText={
                    attempted && noteError ? noteError : 'Decision, rationale and next step. Recruiters only.'
                  }
                />
                <Button type="submit" variant="contained" sx={{ marginTop: '14px' }} disabled={!note.trim()}>
                  Add note
                </Button>
              </form>
              <p style={{ margin: '10px 2px 0', fontSize: 12.5, color: tokens.textMuted }}>
                Candidates never see internal notes (BR-05).
              </p>
            </Surface>
          </Section>
        </div>
      </div>
    </ApplicantHeader>
  );
}
