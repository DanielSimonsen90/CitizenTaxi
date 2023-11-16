import { Button } from "danholibraryrjs";

import FormGroup from "components/shared/FormGroup/FormGroup";
import { LoginPayload } from "models/backend/business/models/payloads";
import { serializeForm } from "utils";
import { ErrorForModel } from "types";

type Props = {
  errors: ErrorForModel<LoginPayload>;
  onSubmit: (payload: LoginPayload) => void;
  onCreateClick: () => void;
};

export default function LoginContainer({ errors, onSubmit, onCreateClick }: Props) {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      const data = serializeForm<LoginPayload>(e.currentTarget);
      onSubmit(data);
    }}>
      <FormGroup label="Brugernavn" htmlFor="username" error={errors.usernameError}>
        <input id="username" name="username" required type="text" />
      </FormGroup>

      <FormGroup label="Kodeord" htmlFor="password" error={errors.passwordError}>
        <input id="password" name="password" required type="password" />
      </FormGroup>

      <div className="button-container">
        <Button type="submit">Log ind</Button>
        <span className="or">eller</span>
        <Button importance="secondary" type="button" onClick={onCreateClick}>Opret</Button>
      </div>
    </form>
  );
}