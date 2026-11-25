import TextField, { type TextFieldProps } from '@mui/material/TextField';

/** TextField preset: outlined, label always visible above the control, 46px tall. */
export function Field(props: TextFieldProps) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      margin="none"
      {...props}
      InputLabelProps={{ shrink: true, ...props.InputLabelProps }}
      FormHelperTextProps={{ sx: { mx: 0 }, ...props.FormHelperTextProps }}
    />
  );
}
