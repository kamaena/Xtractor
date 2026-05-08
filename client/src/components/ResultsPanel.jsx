import FieldCard from './FieldCard';

const FIELD_LABELS = [
  { key: 'partyNames', label: 'Party Names' },
  { key: 'effectiveDate', label: 'Effective Date' },
  { key: 'expirationDeadline', label: 'Expiration / Deadline' },
  { key: 'paymentTerms', label: 'Payment Terms' },
  { key: 'governingLaw', label: 'Governing Law' },
  { key: 'noticeRequirements', label: 'Notice Requirements' },
  { key: 'keyObligations', label: 'Key Obligations' },
];

function ResultsPanel({ data }) {
  return (
    <div style={styles.grid}>
      {FIELD_LABELS.map(({ key, label }) => (
        <FieldCard key={key} label={label} value={data[key]} />
      ))}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
    marginTop: '32px',
  },
};

export default ResultsPanel;
