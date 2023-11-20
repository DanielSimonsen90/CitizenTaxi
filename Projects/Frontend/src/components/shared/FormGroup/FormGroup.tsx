  type Props = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;

  error?: string;
}

/**
 * Grouping label and children together with error message if any
 * @param props Necessary properties to render the component
 * @returns div.form-group with label, children (and error)
 */
export default function FormGroup({ label, htmlFor, children, error }: Props) {
  return (
    <div className="form-group">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <span className="error">{error}</span>}
    </div>
  );
}