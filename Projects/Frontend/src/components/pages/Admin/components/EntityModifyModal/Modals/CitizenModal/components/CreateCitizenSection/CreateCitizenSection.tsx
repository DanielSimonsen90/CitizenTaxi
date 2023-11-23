import FormGroup from "components/shared/FormGroup";
import { Button, ButtonProps } from "danholibraryrjs";
import { Citizen } from "models/backend/common";

type Props = {
  hidePassword: boolean;
  setHidePassword: (hidePassword: boolean) => void;
  crud: ButtonProps['crud'];
  defaultModel: Citizen | undefined;
};

export const CreateCitizenSection = ({ crud, hidePassword, setHidePassword, defaultModel }: Props) => (
  <section className={`${crud}-citizen`}>
    <FormGroup label="Borgerens navn" htmlFor={`${crud}-citizen-name`}>
      <input type="text" id={`${crud}-citizen-name`} name="name" defaultValue={defaultModel?.name} />
    </FormGroup>

    <FormGroup label="Borgerens e-mail" htmlFor={`${crud}-citizen-email`}>
      <input type="email" id={`${crud}-citizen-email`} name="email" defaultValue={defaultModel?.email} />
    </FormGroup>

    {crud === 'create' && (<>
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
    </>)}
  </section>
);