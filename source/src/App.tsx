import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { ApplicantInbox } from './screens/hr/ApplicantInbox';
import { RubricBuilder } from './screens/hr/RubricBuilder';
import { ApplicationForm } from './screens/candidate/ApplicationForm';
import { Gallery } from './gallery/Gallery';
import { PlaceholderScreen } from './screens/Placeholder';
import { LoginScreen, AccessDeniedScreen } from './screens/auth/AuthScreens';
import { JobForm } from './screens/hr/JobForm';
import { JobList } from './screens/hr/JobList';
import { JobDetail } from './screens/hr/JobDetail';
import { AiDraftInput } from './screens/hr/AiDraftInput';
import { ApplicationSubmitted } from './screens/candidate/ApplicationSubmitted';
import { StatusPortal } from './screens/candidate/StatusPortal';
import { LinkUnavailable } from './screens/candidate/LinkUnavailable';
import { PublicJob } from './screens/candidate/PublicJob';
import { ApplicantDetail } from './screens/hr/ApplicantDetail';
import { InternalNotes } from './screens/hr/InternalNotes';
import { Scorecard } from './screens/hr/Scorecard';
import { StatusUpdate } from './screens/hr/StatusUpdate';
import { Dashboard } from './screens/hr/Dashboard';
import { HomePage } from './screens/public/HomePage';
import { aiDraftForFrontend } from './data/fixtures';

function ScreenHost() {
  const { screenId } = useParams();
  switch (screenId) {
    case 'SCR-01':
      return <LoginScreen />;
    case 'SCR-02':
      return <LoginScreen forcedError />;
    case 'SCR-03':
      return <AccessDeniedScreen />;
    case 'SCR-04':
      return <ApplicantInbox />;
    case 'SCR-05':
      return <JobForm />;
    case 'SCR-06':
      return <JobList />;
    case 'SCR-07':
      return <JobDetail />;
    case 'SCR-08':
      return <RubricBuilder />;
    case 'SCR-09':
      return <RubricBuilder forceState="error" />;
    case 'SCR-10':
      return <AiDraftInput />;
    case 'SCR-11':
      return <RubricBuilder initialRubric={aiDraftForFrontend} aiReview idPrefix="scr11" heading="Review AI rubric draft" />;
    case 'SCR-12':
      return <ApplicationForm />;
    case 'SCR-13':
      return <ApplicationForm forceError />;
    case 'SCR-14':
      return <ApplicationSubmitted />;
    case 'SCR-15':
      return <StatusPortal />;
    case 'SCR-16':
      return <LinkUnavailable />;
    case 'SCR-17':
      return <ApplicantDetail />;
    case 'SCR-18':
      return <InternalNotes />;
    case 'SCR-19':
      return <Scorecard />;
    case 'SCR-20':
      return <StatusUpdate />;
    case 'SCR-21':
      return <Dashboard />;
    case 'SCR-22':
      return <PublicJob />;
    default:
      return <PlaceholderScreen />;
  }
}

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const shot = new URLSearchParams(location.search).get('shot') === '1';
    if (shot) document.documentElement.dataset.shot = 'true';
    else delete document.documentElement.dataset.shot;
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.documentElement.dataset.appReady = 'true';
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/screens/:screenId" element={<ScreenHost />} />
      <Route path="*" element={<Navigate to="/gallery" replace />} />
    </Routes>
  );
}
