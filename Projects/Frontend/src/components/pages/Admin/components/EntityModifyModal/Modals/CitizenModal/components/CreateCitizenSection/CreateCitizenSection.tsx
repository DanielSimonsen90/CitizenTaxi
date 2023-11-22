import FormGroup from "components/shared/FormGroup";
import { Button } from "danholibraryrjs";

type Props = {
  hidePassword: boolean;
  setHidePassword: (hidePassword: boolean) => void;
};

export const CreateCitizenSection = ({ hidePassword, setHidePassword }: Props) => (
  <section className="create-citizen">
    <FormGroup label="Borgerens navn" htmlFor="citizen-name">
      <input type="text" id="citizen-name" name="name" />
    </FormGroup>

    <FormGroup label="Borgerens e-mail" htmlFor="citizen-email">
      <input type="email" id="citizen-email" name="email" />
    </FormGroup>

    <FormGroup label="Borgerens brugernavn" htmlFor="citizen-username">
      <input type="text" id="citizen-username" name="username" />
    </FormGroup>

    <FormGroup label="Borgerens kodeord" htmlFor="citizen-password">
      <div className="password-container">
        <input type={hidePassword ? 'password' : 'text'} id="citizen-password" name="password" />
        <Button type="button" importance="secondary" className="alt" onClick={() => setHidePassword(!hidePassword)}>
          {hidePassword ? 'Vis' : 'Skjul'} kodeord
        </Button>
      </div>
    </FormGroup>
  </section>
);