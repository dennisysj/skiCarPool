import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { OfferRidePage } from './pages/OfferRidePage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ProfilePage } from './pages/ProfilePage';
import { Toaster } from './components/ui/toaster';


export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="offer-ride" element={<OfferRidePage />} />
          <Route path="my-trips" element={<MyTripsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="find-ride" element={<HomePage />} />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}