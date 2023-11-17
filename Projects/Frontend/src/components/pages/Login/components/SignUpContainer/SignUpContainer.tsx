import FormGroup from "components/shared/FormGroup/FormGroup";
import { Button } from "danholibraryrjs";
import { useStateInQuery } from "hooks";
import { UserModifyPayload } from "models/backend/business/models/payloads";
import { Role } from "models/backend/common";
import { AllStringValues } from "types";
import { serializeForm, translateEnum, getListFromEnum, revertTranslationForEnum } from "utils";

type Props = {
  onSubmit: (payload: UserModifyPayload<false>) => void;
}

export default function SignUpContainer({ onSubmit }: Props) {
  const [params, setParams] = useStateInQuery<AllStringValues<UserModifyPayload<false>>>("formValues", {
    name: "",
    username: "",
    password: "",
    email: "",
    role: translateEnum(Role.Citizen)
  });

  return (
    <section>
      <header>
        <h2>Har du ikke en konto?</h2>
        <p className="secondary">Du kan oprette en konto her</p>
        <p className="muted disclaimer">
          I produktion ville borgerne skulle ringe til lægesekretærene, så de kan blive oprettet i systemet med deres notat.
        </p>
      </header>
      <form className="sign-up-container" onSubmit={e => {
        e.preventDefault();
        const data = serializeForm<AllStringValues<UserModifyPayload<false>>>(e.currentTarget);
        onSubmit({
          ...data,
          role: revertTranslationForEnum(data.role, Role)
        })
      }}>
        <FormGroup label="Brugernavn" htmlFor="create-username">
          <input id="create-username" name="username" required type="text" value={params.username} 
            onChange={e => setParams(prev => ({ ...prev, username: e.currentTarget.value }))} 
          />
        </FormGroup>

        <FormGroup label="Kodeord" htmlFor="create-password">
          <input id="create-password" name="password" required type="password" />
        </FormGroup>

        <FormGroup label="Navn" htmlFor="create-name">
          <input id="create-name" name="name" required type="text" value={params.name}
            onChange={e => setParams(prev => ({ ...prev, name: e.currentTarget.value }))}
          />
        </FormGroup>

        <FormGroup label="Rolle" htmlFor="create-role">
          <select id="create-role" required name="role">
            {getListFromEnum(Role).map(role => (
              <option key={Role[role]} value={translateEnum(role)} 
                onChange={e => setParams(prev => ({ ...prev, role: e.currentTarget.value }))}>
                {translateEnum(role)}
              </option>
            ))}
          </select>
        </FormGroup>

        <FormGroup label="Email" htmlFor="create-email">
          <input id="create-email" required name="email" type="email" value={params.email}
            onChange={e => setParams(prev => ({ ...prev, email: e.currentTarget.value }))}
          />
        </FormGroup>

        <Button type="submit">Opret konto</Button>
      </form>
    </section>
  );
}