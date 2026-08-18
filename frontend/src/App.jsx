import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./components/AppLayout";

import LoginPage              from "./pages/LoginPage";
import RegisterPage           from "./pages/RegisterPage";
import BrandDashboard         from "./pages/brand/BrandDashboard";
import InfluencerDashboard    from "./pages/influencer/InfluencerDashboard";
import InfluencersPage        from "./pages/brand/InfluencersPage";
import InfluencerProfilePage  from "./pages/brand/InfluencerProfilePage";
import CreateOfferPage        from "./pages/brand/CreateOfferPage";
import BookmarksPage          from "./pages/brand/BookmarksPage";
import RecommendationsPage    from "./pages/brand/RecommendationsPage";
import EarningsPage           from "./pages/influencer/EarningsPage";
import OffersPage             from "./pages/shared/OffersPage";
import InboxPage              from "./pages/shared/InboxPage";
import ChatPage               from "./pages/shared/ChatPage";
import BadgesPage             from "./pages/shared/BadgesPage";

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
}

function DashboardRouter() {
  const { user } = useAuth();
  return user?.role === "BRAND" ? <BrandDashboard /> : <InfluencerDashboard />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AppLayout>
              <Routes>
                {/* Core */}
                <Route path="/dashboard"           element={<DashboardRouter />} />
                <Route path="/offers"              element={<OffersPage />} />
                <Route path="/offers/new"          element={<CreateOfferPage />} />

                {/* Brand */}
                <Route path="/influencers"         element={<InfluencersPage />} />
                <Route path="/influencers/:id"     element={<InfluencerProfilePage />} />
                <Route path="/bookmarks"           element={<BookmarksPage />} />
                <Route path="/recommendations"     element={<RecommendationsPage />} />

                {/* Influencer */}
                <Route path="/earnings"            element={<EarningsPage />} />

                {/* Shared — Phase 3 */}
                <Route path="/inbox"               element={<InboxPage />} />
                <Route path="/chat/:brandId/:influencerId" element={<ChatPage />} />
                <Route path="/badges"              element={<BadgesPage />} />

                <Route path="/"                    element={<Navigate to="/dashboard" replace />} />
                <Route path="*"                    element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
