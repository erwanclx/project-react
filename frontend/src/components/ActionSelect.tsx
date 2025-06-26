import { Form } from 'react-bootstrap';

type Props = {
  onActionSelect: (action: string) => void;
  value: string;
};

const actions = [
  { label: 'Lister les films', value: 'list' },
  { label: 'Créer un film', value: 'create' },
  { label: 'Modifier un film', value: 'update' },
  { label: 'Supprimer un film', value: 'delete' },
];

export default function ActionSelect({ onActionSelect, value }: Props) {
  return (
    <Form.Group controlId="action-select" className="mb-3">
      <Form.Label>Action :</Form.Label>
      <Form.Select
        aria-label="Sélectionner une action"
        value={value}  // valeur contrôlée
        onChange={(e) => onActionSelect(e.target.value)}
      >
        <option value="" disabled>
          -- Choisir une action --
        </option>
        {actions.map((action) => (
          <option key={action.value} value={action.value}>
            {action.label}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}
