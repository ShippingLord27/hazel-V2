import React from 'react';
import { Routes, Route } from 'react-router-dom';


import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ListingDetailPage from './pages/ListingDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';


import ChatPage from './pages/ChatPage'; 


import TestDataSavePage from './data/testdatasave';


import ProfileDashboard from './pages/profile/ProfileDashboard';
import MyListings from './pages/profile/MyListings';
import Favorites from './pages/profile/Favorites';
import ProfileSettings from './pages/profile/ProfileSettings';
import RentalTracker from './pages/profile/RentalTracker';
import ChatListPage from './pages/profile/ChatListPage';


import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import ListingManagement from './pages/admin/ListingManagement';
import AdminSettings from './pages/admin/AdminSettings';
import ContentManagement from './pages/admin/ContentManagement';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<AllProductsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="listing/:id" element={<ListingDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="chat" element={<ChatPage />} />

          <Route path="profile" element={<ProfilePage />}>
            <Route index element={<ProfileDashboard />} />
            <Route path="my-listings" element={<MyListings />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="rental-tracker" element={<RentalTracker />} />
            <Route path="messages" element={<ChatListPage />} />
            <Route path="settings" element={<ProfileSettings />} />
          </Route>
          <Route path="admin" element={<AdminDashboardPage />}>
             <Route index element={<AdminOverview />} />
             <Route path="users" element={<UserManagement />} />
             <Route path="listings" element={<ListingManagement />} />
             <Route path="content" element={<ContentManagement />} />
             <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="/seed-data" element={<TestDataSavePage />} />
      </Routes>
  );
}

export default App;
