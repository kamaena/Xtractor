import { useState } from 'react';
import axios from 'axios';
import ContractInput from './components/ContractInput';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [contractText, setContractText] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    setExtractedData(null);

    try {
      const response = await axios.post('http://localhost:3001/api/extract', {
        contractText,
      });
      setExtractedData(response.data);
    } catch (err) {
      setError('Failed to extract contract data. Please check the server is running and your API key is set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Xtractor</h1>
        <p style={styles.subtitle}>Paste a contract below to extract key information.</p>

        <ContractInput
          value={contractText}
          onChange={setContractText}
          onExtract={handleExtract}
          loading={loading}
        />

        {error && (
          <div style={styles.errorBanner}>{error}</div>
        )}

        {extractedData && <ResultsPanel data={extractedData} />}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '48px 24px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '15px',
    color: '#64748b',
    margin: '0 0 32px',
  },
  errorBanner: {
    marginTop: '16px',
    padding: '12px 16px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    color: '#991b1b',
    fontSize: '14px',
  },
};

export default App;
