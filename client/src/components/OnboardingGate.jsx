import { Navigate } from 'react-router-dom';
import useStore from '../services/store';

export default function OnboardingGate({ children }) {
  const { hiringProcesses } = useStore();

  if (hiringProcesses.length === 0) {
    return <Navigate to="/app/onboarding" replace />;
  }

  return children;
}
