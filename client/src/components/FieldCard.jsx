function FieldCard({ label, value, last }) {
  return (
    <div style={{ ...styles.card, ...(last ? styles.cardLast : {}) }}>
      <div style={styles.label}>{label}</div>
      {value ? (
        <div style={styles.value}>{value}</div>
      ) : (
        <div style={styles.notFound}>Not found</div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#64748b',
  },
  value: {
    fontSize: '14px',
    color: '#1e293b',
    lineHeight: '1.5',
  },
  cardLast: {
    gridColumn: '1 / -1',
  },
  notFound: {
    fontSize: '14px',
    color: '#cbd5e1',
    fontStyle: 'italic',
  },
};

export default FieldCard;
