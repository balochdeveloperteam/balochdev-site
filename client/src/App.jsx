import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import ShellHeader from './nerd/components/ShellHeader';
import ShellFooter from './nerd/components/ShellFooter';
import VerticalBookCTA from './nerd/components/VerticalBookCTA';
import { BookCallProvider } from './nerd/components/bookCall/BookCallContext';
import BookCallModal from './nerd/components/bookCall/BookCallModal';
import BookCallPrompt from './nerd/components/bookCall/BookCallPrompt';
import ScrollTopFab from './nerd/components/ScrollTopFab';
import SmoothScroll from './nerd/components/SmoothScroll';
import CursorGlow from './nerd/components/CursorGlow';
import RouteNProgress from './nerd/components/RouteNProgress';
import ScrollToTop from './nerd/components/ScrollToTop';
import PreferTrailingSlash from './nerd/components/PreferTrailingSlash';
import GoogleAnalytics from './nerd/components/GoogleAnalytics';
import BootSplash from './nerd/components/BootSplash';
import GlobalScrollReveal from './nerd/components/GlobalScrollReveal';
import NHome from './nerd/pages/NHome';
import NServices from './nerd/pages/NServices';
import NTechnologies from './nerd/pages/NTechnologies';
import TechnologyAiLanding from './nerd/pages/TechnologyAiLanding';
import NApps from './nerd/pages/NApps';
import NIndustries from './nerd/pages/NIndustries';
import NPortfolio from './nerd/pages/NPortfolio';
import NProjectPage from './nerd/pages/NProjectPage';
import NAbout from './nerd/pages/NAbout';
import NFaq from './nerd/pages/NFaq';
import NBlog from './nerd/pages/NBlog';
import NBlogPost from './nerd/pages/NBlogPost';
import NAdvertise from './nerd/pages/NAdvertise';
import NContact from './nerd/pages/NContact';
import NEstimate from './nerd/pages/NEstimate';
import NProposal from './nerd/pages/NProposal';
import NServicePage from './nerd/pages/NServicePage';
import ServicePracticeLanding from './nerd/pages/ServicePracticeLanding';
import NResourcePage from './nerd/pages/NResourcePage';
import NBrand from './nerd/pages/NBrand';
import NPrivacy from './nerd/pages/legal/NPrivacy';
import NTerms from './nerd/pages/legal/NTerms';
import NRefund from './nerd/pages/legal/NRefund';
import NFulfilment from './nerd/pages/legal/NFulfilment';
import AdminLogin from './nerd/pages/admin/AdminLogin';
import AdminGuard from './nerd/pages/admin/AdminGuard';
import AdminOverview from './nerd/pages/admin/AdminOverview';
import AdminPostsList from './nerd/pages/admin/AdminPostsList';
import AdminPostEditor from './nerd/pages/admin/AdminPostEditor';
import AdminAds from './nerd/pages/admin/AdminAds';
import AdminMedia from './nerd/pages/admin/AdminMedia';
import TeamGuard from './nerd/pages/team/TeamGuard';
import TeamLayout from './nerd/pages/team/TeamLayout';
import TeamDashboard from './nerd/pages/team/TeamDashboard';
import TeamMembers from './nerd/pages/team/TeamMembers';
import TeamMyRole from './nerd/pages/team/TeamMyRole';
import TeamPolicies from './nerd/pages/team/TeamPolicies';
import TeamWeeklyHours from './nerd/pages/team/TeamWeeklyHours';
import NNotFound from './nerd/pages/NNotFound';

function NBlogPostRoute() {
  const { slug } = useParams();
  return <NBlogPost key={slug ?? ''} />;
}

function AppRoutes() {
  return (
    <>
      <PreferTrailingSlash />
      <ScrollToTop />
      <GoogleAnalytics />
      <RouteNProgress />
      <div className="ndx-app-stack">
        <ShellHeader />
        <main className="ndx-main">
          <Routes>
            <Route path="/" element={<NHome />} />
            {/* Trailing-slash public routes (match Cloudflare Pages …/index.html URLs) */}
            <Route path="/services/" element={<NServices />} />
            <Route path="/services" element={<Navigate to="/services/" replace />} />
            <Route path="/services/practice/:practiceId/" element={<ServicePracticeLanding />} />
            <Route path="/services/practice/:practiceId" element={<ServicePracticeLanding />} />
            <Route path="/services/:slug/" element={<NServicePage />} />
            <Route path="/services/:slug" element={<NServicePage />} />
            <Route path="/brand/" element={<NBrand />} />
            <Route path="/brand" element={<Navigate to="/brand/" replace />} />
            <Route path="/resources/:slug/" element={<NResourcePage />} />
            <Route path="/resources/:slug" element={<NResourcePage />} />
            <Route path="/technologies/:category/:slug/" element={<TechnologyAiLanding />} />
            <Route path="/technologies/:category/:slug" element={<TechnologyAiLanding />} />
            <Route path="/technologies/" element={<NTechnologies />} />
            <Route path="/technologies" element={<Navigate to="/technologies/" replace />} />
            <Route path="/apps/" element={<NApps />} />
            <Route path="/apps" element={<Navigate to="/apps/" replace />} />
            <Route path="/portfolio/" element={<NPortfolio />} />
            <Route path="/portfolio" element={<Navigate to="/portfolio/" replace />} />
            <Route path="/projects/" element={<Navigate to="/portfolio/" replace />} />
            <Route path="/projects" element={<Navigate to="/portfolio/" replace />} />
            <Route path="/projects/:slug/" element={<NProjectPage />} />
            <Route path="/projects/:slug" element={<NProjectPage />} />
            <Route path="/industries/" element={<Navigate to="/services/" replace />} />
            <Route path="/industries" element={<Navigate to="/services/" replace />} />
            <Route path="/about/" element={<NAbout />} />
            <Route path="/about" element={<Navigate to="/about/" replace />} />
            <Route path="/faq/" element={<NFaq />} />
            <Route path="/faq" element={<Navigate to="/faq/" replace />} />
            <Route path="/blog/" element={<NBlog />} />
            <Route path="/blog" element={<Navigate to="/blog/" replace />} />
            <Route path="/blog/:slug/" element={<NBlogPostRoute />} />
            <Route path="/blog/:slug" element={<NBlogPostRoute />} />
            <Route path="/advertise/" element={<NAdvertise />} />
            <Route path="/advertise" element={<Navigate to="/advertise/" replace />} />
            <Route path="/contact/" element={<NContact />} />
            <Route path="/contact" element={<Navigate to="/contact/" replace />} />
            <Route path="/estimate/" element={<NEstimate />} />
            <Route path="/estimate" element={<Navigate to="/estimate/" replace />} />
            <Route path="/proposal/" element={<NProposal />} />
            <Route path="/proposal" element={<Navigate to="/proposal/" replace />} />
            <Route path="/privacy/" element={<NPrivacy />} />
            <Route path="/privacy" element={<Navigate to="/privacy/" replace />} />
            <Route path="/terms/" element={<NTerms />} />
            <Route path="/terms" element={<Navigate to="/terms/" replace />} />
            <Route path="/refund/" element={<NRefund />} />
            <Route path="/refund" element={<Navigate to="/refund/" replace />} />
            <Route path="/fulfilment/" element={<NFulfilment />} />
            <Route path="/fulfilment" element={<Navigate to="/fulfilment/" replace />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<AdminOverview />} />
              <Route path="posts" element={<AdminPostsList />} />
              <Route path="posts/new" element={<AdminPostEditor />} />
              <Route path="posts/:id/edit" element={<AdminPostEditor />} />
              <Route path="ads" element={<AdminAds />} />
              <Route path="media" element={<AdminMedia />} />
            </Route>
            <Route path="/team" element={<TeamGuard />}>
              <Route element={<TeamLayout />}>
                <Route index element={<TeamDashboard />} />
                <Route path="members" element={<TeamMembers />} />
                <Route path="my-role" element={<TeamMyRole />} />
                <Route path="policies" element={<TeamPolicies />} />
                <Route path="hours" element={<TeamWeeklyHours />} />
              </Route>
            </Route>
            <Route path="*" element={<NNotFound />} />
          </Routes>
          <GlobalScrollReveal />
        </main>
        <ShellFooter />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <BookCallProvider>
        <div className="ndx-app">
          <SmoothScroll />
          <CursorGlow />
          <BootSplash />
          <AppRoutes />
          <VerticalBookCTA />
          <BookCallModal />
          <BookCallPrompt />
          <ScrollTopFab />
        </div>
      </BookCallProvider>
    </Router>
  );
}

export default App;