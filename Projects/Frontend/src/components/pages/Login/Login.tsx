import { DOMAIN_NAME } from "SiteConstants";
import { useStateInQuery } from "hooks";
import { LoginContainer, SignUpContainer } from "./components";
import { LoginPayload, UserModifyPayload } from "models/backend/business/models/payloads";
import { Request } from "utils";
import { useAuth } from "providers/AuthProvider";
import { Guid } from "types";
import { useNotification } from "providers/NotificationProvider";

export default function Login() {
  const { login } = useAuth();
  const { setNotification } = useNotification();

  // Toggle the create user form. This is stored in the URL 
  // so the doctor secretaries can share the link with the citizens 
  // without confusing them
  const [showCreate, setShowCreate] = useStateInQuery("showCreate", false);

  const onCreateClick = () => setShowCreate(v => !v);
  const onLoginSubmit = async (payload: LoginPayload) => login(payload.username, payload.password);
  const onCreateSubmit = async (payload: UserModifyPayload<false>) => {
    // Send a POST request to the backend to create the user
    const userCreateResponse = await Request<Guid>('users', {
      method: 'POST',
      body: payload
    });

    if (!userCreateResponse.success) {
      console.error(`Error for POST /users`, userCreateResponse.text, payload);
      return setNotification({
        type: "error",
        message: `Der skete en fejl med din oprettelse. - ${userCreateResponse.text}`
      });
    }

    // If the user was created successfully, log them in immediately
    login(payload.username, payload.password);
  };

  return (
    <main className="login">
      <header>
        <h1>Login</h1>
        <p className="muted">For at benytte {DOMAIN_NAME}, skal du logge ind.</p>
      </header>
      <section>
        <LoginContainer onCreateClick={onCreateClick} onSubmit={onLoginSubmit} />
        {showCreate && (<>
          <hr />
          <SignUpContainer onSubmit={onCreateSubmit} />
        </>)}
      </section>
    </main>
  );
}