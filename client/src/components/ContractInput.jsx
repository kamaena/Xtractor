function ContractInput({ value, onChange, onExtract, loading }) {
  return (
    <div style={styles.container}>
      <textarea
        style={styles.textarea}
        placeholder="Paste your contract text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
      />
      <button
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {}),
        }}
        onClick={onExtract}
        disabled={loading || value.trim() === ''}
      >
        {loading ? 'Extracting...' : 'Extract'}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  textarea: {
    width: '100%',
    height: '240px',
    padding: '14px',
    fontSize: '14px',
    fontFamily: 'inherit',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#1e293b',
  },
  button: {
    alignSelf: 'flex-end',
    padding: '10px 28px',
    fontSize: '14px',
    fontWeight: '600',
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  buttonDisabled: {
    background: '#94a3b8',
    cursor: 'not-allowed',
  },
};

export default ContractInput;
