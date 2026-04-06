import { Navigate, useParams } from 'react-router-dom';
import useStore from '../services/store';

const BLOCKER_TYPES = ['job-description', 'competency-framework'];

export default function ReadinessGate({ children }) {
  const { id } = useParams();
  const { processDocuments, hiringProcesses } = useStore();

  const process = hiringProcesses.find((p) => p.id === id);
  if (!process) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const processDocs = processDocuments.filter((d) => d.processId === id);
  const uploadedTypes = processDocs.map((d) => d.type);
  const missingBlockers = BLOCKER_TYPES.filter((t) => !uploadedTypes.includes(t));

  if (missingBlockers.length > 0) {
    return <Navigate to={`/app/processes/${id}/documents`} replace />;
  }

  return children;
}
