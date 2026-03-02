import { createBrowserRouter, Navigate } from 'react-router';

// ─── Root Layout ───
import { RootLayout, RouteErrorFallback } from './pages/RootLayout';

// ─── User Screens ───
import { SplashScreen } from './pages/user/SplashScreen';
import { OnboardingScreen } from './pages/user/OnboardingScreen';
import { LoginScreen } from './pages/user/LoginScreen';
import { OTPScreen } from './pages/user/OTPScreen';
import { ProfileSetupScreen } from './pages/user/ProfileSetupScreen';
import { InterestsScreen } from './pages/user/InterestsScreen';
import { TermsScreen } from './pages/user/TermsScreen';
import { PermissionsScreen } from './pages/user/PermissionsScreen';
import { WelcomeScreen } from './pages/user/WelcomeScreen';
import { HomeScreen } from './pages/user/HomeScreen';
import { UserProfileScreen } from './pages/user/UserProfileScreen';
import { PreCallScreen } from './pages/user/PreCallScreen';
import { CallingScreen } from './pages/user/CallingScreen';
import { InCallScreen } from './pages/user/InCallScreen';
import { IncomingCallScreen } from './pages/user/IncomingCallScreen';
import { CallEndScreen } from './pages/user/CallEndScreen';
import { WalletScreen } from './pages/user/WalletScreen';
import { RechargeScreen } from './pages/user/RechargeScreen';
import { PaymentResultScreen } from './pages/user/PaymentResultScreen';
import { TransactionsScreen } from './pages/user/TransactionsScreen';
import { EarningsScreen } from './pages/user/EarningsScreen';
import { WithdrawScreen } from './pages/user/WithdrawScreen';
import { WithdrawStatusScreen } from './pages/user/WithdrawStatusScreen';
import { NotificationsScreen } from './pages/user/NotificationsScreen';
import { CallHistoryScreen } from './pages/user/CallHistoryScreen';
import { SettingsScreen } from './pages/user/SettingsScreen';
import { ChatListScreen } from './pages/user/ChatListScreen';
import { CelebScreen } from './pages/user/CelebScreen';
import { ChatScreen } from './pages/user/ChatScreen';
import { AdminRequestScreen } from './pages/user/AdminRequestScreen';
import { CelebProfileScreen } from './pages/user/CelebProfileScreen';
import { AdminSelectionScreen } from './pages/user/AdminSelectionScreen';
import { RechargeCoinsScreen } from './pages/user/RechargeCoinsScreen';

// ─── Admin Screens ───
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import {
  AdminBuyCoins,
  AdminPurchaseHistory,
  AdminUsersList,
  AdminCreateUser,
  AdminUserDetail,
  AdminCoinTransactions,
  AdminCallsLog,
  AdminWithdrawals,
  AdminDiamondLiability,
  AdminReports,
  AdminNotifications,
  AdminProfile,
  AdminAuditLogs,
  AdminRechargeRequests,
} from './pages/admin/AdminScreens';

// ─── Super Admin Screens ───
import { SuperAdminLayout } from './pages/superadmin/SuperAdminLayout';
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import {
  SAAdminManagement,
  SACreateAdmin,
  SACoinMinting,
  SADiamondMonitoring,
  SAPayments,
  SAPricingConfig,
  SAAnnouncements,
  SAAuditLogs,
  SATwilioConfig,
  SAProfile,
  SAAnalytics,
} from './pages/superadmin/SuperAdminScreens';
import { SAAdminRequests } from './pages/superadmin/SAAdminRequests';
import { SACelebrityManagement } from './pages/superadmin/SACelebrityManagement';

// ─── Role Login Screens ───
import { CelebLoginScreen } from './pages/celebrity/CelebLoginScreen';
import { CelebEditProfileScreen } from './pages/celebrity/CelebEditProfileScreen';
import { AdminLoginScreen } from './pages/admin/AdminLoginScreen';
import { AdminEditProfileScreen } from './pages/admin/AdminEditProfileScreen';
import { UserLoginScreen } from './pages/user/UserLoginScreen';
import { UserEditProfileScreen } from './pages/user/UserEditProfileScreen';

// ─── Portal Selector (Landing) ───
import { PortalSelector } from './pages/PortalSelector';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        // Error boundary sits INSIDE providers (RootLayout) so children always have context
        ErrorBoundary: RouteErrorFallback,
        children: [
          // Portal selector
          { index: true, Component: PortalSelector },

          // ═══════════════════════════════════════════
          // USER PANEL
          // ═══════════════════════════════════════════
          { path: 'splash', Component: SplashScreen },
          { path: 'onboarding/:step', Component: OnboardingScreen },
          { path: 'login', Component: LoginScreen },
          { path: 'otp', Component: OTPScreen },
          { path: 'profile-setup', Component: ProfileSetupScreen },
          { path: 'interests', Component: InterestsScreen },
          { path: 'terms', Component: TermsScreen },
          { path: 'permissions', Component: PermissionsScreen },
          { path: 'welcome', Component: WelcomeScreen },
          { path: 'home', Component: HomeScreen },
          { path: 'user/:id', Component: UserProfileScreen },
          { path: 'pre-call/:id', Component: PreCallScreen },
          { path: 'pre-call/:id/:type', Component: PreCallScreen },
          { path: 'calling/:id', Component: CallingScreen },
          { path: 'calling/:id/:type', Component: CallingScreen },
          { path: 'in-call/:id', Component: InCallScreen },
          { path: 'in-call/:id/:type', Component: InCallScreen },
          { path: 'incoming-call', Component: IncomingCallScreen },
          { path: 'incoming-call/:id/:type', Component: IncomingCallScreen },
          { path: 'call-end', Component: CallEndScreen },
          { path: 'call-end/:id', Component: CallEndScreen },
          { path: 'wallet', Component: WalletScreen },
          { path: 'recharge', Component: RechargeScreen },
          { path: 'admin-selection', Component: AdminSelectionScreen },
          { path: 'recharge-coins', Component: RechargeCoinsScreen },
          { path: 'payment-result', Component: PaymentResultScreen },
          { path: 'payment-result/:status', Component: PaymentResultScreen },
          { path: 'transactions', Component: TransactionsScreen },
          { path: 'earnings', Component: EarningsScreen },
          { path: 'withdraw', Component: WithdrawScreen },
          { path: 'withdraw-status', Component: WithdrawStatusScreen },
          { path: 'notifications', Component: NotificationsScreen },
          { path: 'call-history', Component: CallHistoryScreen },
          { path: 'settings', Component: SettingsScreen },
          { path: 'celebs', Component: CelebScreen },
          { path: 'messages', Component: ChatListScreen },
          { path: 'chat/:id', Component: ChatScreen },
          { path: 'celeb/:id', Component: CelebProfileScreen },
          { path: 'admin-request', Component: AdminRequestScreen },
          { path: 'celeb-login', Component: CelebLoginScreen },
          { path: 'admin-login', Component: AdminLoginScreen },
          { path: 'user-login', Component: UserLoginScreen },
          { path: 'edit-profile', Component: UserEditProfileScreen },
          { path: 'celeb-edit-profile', Component: CelebEditProfileScreen },

          // ═══════════════════════════════════════════
          // ADMIN PANEL
          // ═══════════════════════════════════════════
          {
            path: 'admin',
            Component: AdminLayout,
            children: [
              { index: true, element: <Navigate to="/admin/dashboard" replace /> },
              { path: 'dashboard', Component: AdminDashboard },
              { path: 'coins', Component: AdminCoinTransactions },
              { path: 'buy-coins', Component: AdminBuyCoins },
              { path: 'purchase-history', Component: AdminPurchaseHistory },
              { path: 'users', Component: AdminUsersList },
              { path: 'create-user', Component: AdminCreateUser },
              { path: 'user/:id', Component: AdminUserDetail },
              { path: 'calls', Component: AdminCallsLog },
              { path: 'withdrawals', Component: AdminWithdrawals },
              { path: 'diamonds', Component: AdminDiamondLiability },
              { path: 'reports', Component: AdminReports },
              { path: 'notifications', Component: AdminNotifications },
              { path: 'audit', Component: AdminAuditLogs },
              { path: 'profile', Component: AdminProfile },
              { path: 'edit-profile', Component: AdminEditProfileScreen },
              { path: 'recharge-requests', Component: AdminRechargeRequests },
            ],
          },

          // ═══════════════════════════════════════════
          // SUPER ADMIN PANEL
          // ═══════════════════════════════════════════
          {
            path: 'superadmin',
            Component: SuperAdminLayout,
            children: [
              { index: true, element: <Navigate to="/superadmin/dashboard" replace /> },
              { path: 'dashboard', Component: SuperAdminDashboard },
              { path: 'admins', Component: SAAdminManagement },
              { path: 'admin-requests', Component: SAAdminRequests },
              { path: 'celebrities', Component: SACelebrityManagement },
              { path: 'admins/create', Component: SACreateAdmin },
              { path: 'coins', Component: SACoinMinting },
              { path: 'diamonds', Component: SADiamondMonitoring },
              { path: 'payments', Component: SAPayments },
              { path: 'pricing', Component: SAPricingConfig },
              { path: 'announcements', Component: SAAnnouncements },
              { path: 'audit', Component: SAAuditLogs },
              { path: 'twilio', Component: SATwilioConfig },
              { path: 'profile', Component: SAProfile },
              { path: 'analytics', Component: SAAnalytics },
            ],
          },

          // Catch-all
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);