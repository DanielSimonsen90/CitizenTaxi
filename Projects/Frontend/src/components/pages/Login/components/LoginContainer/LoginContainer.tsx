import { Button } from "danholibraryrjs";

import FormGroup from "components/shared/FormGroup";
import { LoginPayload } from "models/backend/business/models/payloads";
import { serializeForm } from "utils";
import { useAuth } from "providers/AuthProvider";

type Props = {
  onSubmit: (payload: LoginPayload) => void;
  onCreateClick: () => void;
};

export default function LoginContainer({ onSubmit, onCreateClick }: Props) {
  // Get the loggingIn state from the AuthProvider to disable the login button 
  // while logging in so the user can't spam the button
  const { loggingIn } = useAuth();

  return (
    <form className="login-container" onSubmit={e => {
      // Create our own payload and pass it to the onSubmit callback
      e.preventDefault();
      const data = serializeForm<LoginPayload>(e.currentTarget);
      onSubmit(data);
    }}>
      <FormGroup label="Brugernavn" htmlFor="username">
        <input id="username" name="username" required type="text" />
      </FormGroup>

      <FormGroup label="Kodeord" htmlFor="password">
        <input id="password" name="password" required type="password" />
      </FormGroup>

      <div className="button-container">
        <Button type="submit" disabled={loggingIn}>Log ind</Button>
        <span className="or">eller</span>
        <Button importance="secondary" className="alt" type="button" onClick={onCreateClick}>Opret</Button>
      </div>
    </form>
  );
}