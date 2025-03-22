import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { OfferRidePage } from './pages/OfferRidePage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ProfilePage } from './pages/ProfilePage';
import { FindRidePage } from './pages/FindRidePage';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/find-ride" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="offer-ride" element={<OfferRidePage />} />
          <Route path="my-trips" element={<MyTripsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="find-ride" element={<FindRidePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}