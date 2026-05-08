const SAMPLE_CONTRACT = `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of January 1, 2024 ("Effective Date") by and between Acme Corp, a Delaware corporation ("Client"), and WidgetMakers LLC, a California limited liability company ("Vendor").

This Agreement shall remain in effect until December 31, 2024 ("Expiration Date"), unless terminated earlier by either party with 30 days written notice.

Payment Terms: Client shall pay Vendor $5,000 per month, due within 30 days of invoice. Late payments shall accrue interest at 1.5% per month.

Governing Law: This Agreement shall be governed by the laws of the State of California, without regard to its conflict of law provisions.

Notices: All notices must be delivered in writing via certified mail to the addresses listed in Exhibit A, with 10 days advance notice required.

Key Obligations: Vendor shall deliver software development services as described in Exhibit B. Client shall provide access to necessary systems, timely feedback, and all required credentials within 5 business days of request.`;

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
      <div style={styles.actions}>
        <button
          style={styles.sampleButton}
          onClick={() => onChange(SAMPLE_CONTRACT)}
          disabled={loading}
        >
          Sample Contract
        </button>
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
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  sampleButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    background: '#ffffff',
    color: '#2563eb',
    border: '1px solid #2563eb',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  button: {
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
