import { EntityCard, EntityCardProps } from "./components";

export default function AdminDashboard() {  
  return (
    <main>
      <h1>Vælg hvilken information du vil se</h1>
      <ul>
        {entityProps.map(props => (
          <li key={props.entityEndpoint}>
            <EntityCard {...props} />
          </li>
        ))}
      </ul>
    </main>
  );
}

const citizenProps = {
  title: "Borger",
  icon: "👴🏼",
  entityName: "borger",
  buttonEntityName: "Borger",
  entityEndpoint: "borgere"
};
const notesProps = {
  title: "Notater",
  icon: "📝",
  entityName: "borgernotater",
  buttonEntityName: "Notat",
  entityEndpoint: "notater"
};
const bookingProps = {
  title: "Bestillinger",
  icon: "🚖",
  entityName: "taxabestilling",
  buttonEntityName: "Bestilling",
  entityEndpoint: "bestillinger"
};

const entityProps: Array<EntityCardProps> = [
  citizenProps,
  notesProps,
  bookingProps
];