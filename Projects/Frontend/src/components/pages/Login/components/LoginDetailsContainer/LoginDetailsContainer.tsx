import { Button } from "danholibraryrjs";
import { Role } from "models/backend/common";
import { useAuth } from "providers/AuthProvider";
import { translateEnum } from "utils";

const loginDetails = [
  {
    username: 'testborger',
    password: 'testborger123',
    role: Role.Citizen
  },
  {
    username: 'testadmin',
    password: 'testadmin123',
    role: Role.Admin
  }
]

export default function LoginDetailsContainer() { 
  const { login } = useAuth(true);

  return (
    <aside className="login-details-container">
      <header>
        <h2>Her er nogle login detaljer du kan bruge, i forbindelse med afprøvning af CitizenTaxi projektet.</h2>
      </header>

      <ul>
        {loginDetails.map(({ username, password, role }) => (
          <li key={translateEnum(role, Role)}>
            <h3>{translateEnum(role, Role)}</h3>
            <p><b>Brugernavn:</b> {username}</p>
            <p><b>Adgangskode:</b> {password}</p>
            <Button importance="secondary" className="alt" onClick={() => login(username, password)}>Log ind med {username}</Button>
          </li>
        ))}
      </ul>
    </aside>
  );
}