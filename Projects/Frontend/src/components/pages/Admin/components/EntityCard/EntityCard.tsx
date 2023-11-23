import { Link } from "react-router-dom";

type Props = {
  icon: string;
  title: string;
  entityName: string;
  buttonEntityName: string;
  entityEndpoint: string;
}

export type { Props as EntityCardProps };

export default function EntityCard({ 
  icon, title, 
  entityName, buttonEntityName, entityEndpoint 
}: Props) {
  return (
    <article className="entity-card">
      <h1 className="entity-card__title">{title}</h1>
      <p className="entity-card__icon">{icon}</p>
      <p className="entity-card__description secondary">Oprettelse, opdatering og slettelse af {entityName}</p>
      <Link to={`/${entityEndpoint}`} className="entity-card__open-btn button">Åben {buttonEntityName}side</Link>
    </article>
  );
}