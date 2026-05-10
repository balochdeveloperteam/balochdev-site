import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShellHeader from './nerd/components/ShellHeader';
import ShellFooter from './nerd/components/ShellFooter';
import VerticalBookCTA from './nerd/components/VerticalBookCTA';
import ScrollTopFab from './nerd/components/ScrollTopFab';
import SmoothScroll from './nerd/components/SmoothScroll';
import CursorGlow from './nerd/components/CursorGlow';
import RouteNProgress from './nerd/components/RouteNProgress';
import ScrollToTop from './nerd/components/ScrollToTop';
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
import NBlog from './nerd/pages/NBlog';
import NBlogPost from './nerd/pages/NBlogPost';
import NContact from './nerd/pages/NContact';
import NEstimate from './nerd/pages/NEstimate';
import NProposal from './nerd/pages/NProposal';
import NServicePage from './nerd/pages/NServicePage';
import NResourcePage from './nerd/pages/NResourcePage';
import NPrivacy from './nerd/pages/legal/NPrivacy';
import NTerms from './nerd/pages/legal/NTerms';
import NRefund from './nerd/pages/legal/NRefund';
import NFulfilment from './nerd/pages/legal/NFulfilment';
import AdminLogin from './nerd/pages/admin/AdminLogin';
import AdminDashboard from './nerd/pages/admin/AdminDashboard';
import NNotFound from './nerd/pages/NNotFound';

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <RouteNProgress />
      <div className="ndx-app-stack">
        <ShellHeader />
        <main className="ndx-main">
          <Routes>
            <Route path="/" element={<NHome />} />
            <Route path="/services" element={<NServices />} />
            <Route path="/services/:slug" element={<NServicePage />} />
            <Route path="/resources/:slug" element={<NResourcePage />} />
            <Route path="/technologies/:category/:slug" element={<TechnologyAiLanding />} />
            <Route path="/technologies" element={<NTechnologies />} />
            <Route path="/apps" element={<NApps />} />
            <Route path="/industries" element={<NIndustries />} />
            <Route path="/portfolio" element={<NPortfolio />} />
            <Route path="/projects/:slug" element={<NProjectPage />} />
            <Route path="/about" element={<NAbout />} />
            <Route path="/blog" element={<NBlog />} />
            <Route path="/blog/:slug" element={<NBlogPost />} />
            <Route path="/contact" element={<NContact />} />
            <Route path="/estimate" element={<NEstimate />} />
            <Route path="/proposal" element={<NProposal />} />
            <Route path="/privacy" element={<NPrivacy />} />
            <Route path="/terms" element={<NTerms />} />
            <Route path="/refund" element={<NRefund />} />
            <Route path="/fulfilment" element={<NFulfilment />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
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
      <div className="ndx-app">
        <SmoothScroll />
        <CursorGlow />
        <BootSplash />
        <AppRoutes />
        <VerticalBookCTA />
        <ScrollTopFab />
      </div>
    </Router>
  );
}

export default App;