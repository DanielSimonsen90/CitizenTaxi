import FormGroup from "components/shared/FormGroup";
import { Button, ButtonProps } from "danholibraryrjs";

type Props = {
  hidePassword: boolean;
  setHidePassword: (hidePassword: boolean) => void;
  crud: ButtonProps['crud'];
};

export const CreateCitizenSection = ({ crud, hidePassword, setHidePassword }: Props) => (
  <section className="create-citizen">
    <FormGroup label="Borgerens navn" htmlFor={`${crud}-citizen-name`}>
      <input type="text" id={`${crud}-citizen-name`} name="name" />
    </FormGroup>

    <FormGroup label="Borgerens e-mail" htmlFor={`${crud}-citizen-email`}>
      <input type="email" id={`${crud}-citizen-email`} name="email" />
    </FormGroup>

    <FormGroup label="Borgerens brugernavn" htmlFor={`${crud}-citizen-username`}>
      <input type="text" id={`${crud}-citizen-username`} name="username" />
    </FormGroup>

    <FormGroup label="Borgerens kodeord" htmlFor={`${crud}-citizen-password`}>
      <div className="password-container">
        <input type={hidePassword ? 'password' : 'text'} id={`${crud}-citizen-password`} name="password" />
        <Button type="button" importance="secondary" className="alt" onClick={() => setHidePassword(!hidePassword)}>
          {hidePassword ? 'Vis' : 'Skjul'} kodeord
        </Button>
      </div>
    </FormGroup>
  </section>
);