  type Props = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;

  error?: string;
}

export default function FormGroup({ label, htmlFor, children, error }: Props) {
  return (
    <div className="form-group">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {error && <span className="error">{error}</span>}
    </div>
  );
}