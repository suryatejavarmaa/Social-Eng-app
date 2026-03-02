import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockUsers, MockUser } from '../data/mockUsers';

// ─── Constants ───
export const COIN_DIAMOND_RATE = 6; // 6 coins = 1 diamond
export const DIAMOND_TO_RUPEE = 1.8; // 1 diamond = ₹1.8
export const AUDIO_COINS_PER_10SEC = 1; // 1 coin per 10 seconds
export const VIDEO_COINS_PER_10SEC = 4; // 4 coins per 10 seconds
export const AUDIO_COINS_PER_MIN = 6; // 6 coins per 60 seconds
export const VIDEO_COINS_PER_MIN = 24; // 24 coins per 60 seconds
export const AUDIO_DIAMONDS_PER_MIN = 1; // Receiver earns 1 diamond per 60 sec
export const VIDEO_DIAMONDS_PER_MIN = 4; // Receiver earns 4 diamonds per 60 sec (24/6)
export const MESSAGE_COST_COINS = 3; // 3 coins per message
export const MESSAGES_PER_DIAMOND = 2; // Receiver earns 1 diamond per 2 incoming messages
export const MESSAGE_WORD_LIMIT = 50; // Max 50 words per message
export const MIN_WITHDRAW_DIAMONDS = 100; // Minimum 100 diamonds to withdraw
export const MIN_WITHDRAW_DIAMONDS_FREE = 100;
export const MIN_WITHDRAW_DIAMONDS_PREMIUM = 25;
export const PREMIUM_FREE_COINS = 100; // Free coins on premium upgrade
export const COIN_PACK_SIZE = 10000; // Fixed coin pack size for admin purchases
export const COIN_PACK_RUPEE_COST = 3000; // Cost in rupees for 10,000 coins (₹0.30/coin — bulk admin rate)
export const COIN_TO_RUPEE_RATIO = COIN_PACK_RUPEE_COST / COIN_PACK_SIZE; // ₹0.30 per coin (admin buys wholesale)

// ─── Types ───
export interface AdminRequestData {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  reason: string;
  socialHandle: string;
  email: string;
  pitch: string;
  submittedAt: string;
  userName?: string;
}

interface Transaction {
  id: string;
  type: 'recharge' | 'call' | 'message' | 'withdraw' | 'diamond_earned' | 'refund';
  amount: number;
  date: string;
  method?: string;
  user?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface CallRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'audio' | 'video';
  duration: number; // in seconds
  coinsUsed: number;
  diamondsEarned: number;
  date: string;
  rating?: number;
}

interface MessageRecord {
  id: string;
  fromUserId: string;
  toUserId: string;
  toUserName: string;
  text: string;
  coinsSpent: number;
  timestamp: string;
  direction: 'sent' | 'received';
}

interface ChatThread {
  userId: string;
  userName: string;
  userAvatar: string;
  messages: MessageRecord[];
  totalCoinsSent: number;
  totalDiamondsReceived: number;
  sentMessageCount: number; // Track for diamond calculation
  receivedMessageCount: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'call' | 'coin' | 'diamond' | 'message';
  time: string;
  read: boolean;
}

interface WithdrawRequest {
  id: string;
  diamonds: number;
  amount: number; // in rupees (diamonds * 1.8)
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'paid';
  date: string;
  method: string;
  userName?: string;
  paymentDetails?: string; // user's UPI ID or bank account details
  approvedAt?: string;
  paidAt?: string;
  adminNote?: string;
}

export interface CoinPurchaseRequest {
  id: string;
  adminId: string;
  adminName: string;
  coinsPack: number; // dynamic coin amount requested
  rupeeCost: number; // auto-calculated: coinsPack * COIN_TO_RUPEE_RATIO (₹1 per coin)
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requestedAt: string;
  approvedAt?: string;
  paidAt?: string;
}

interface AdminData {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'suspended';
  coinInventory: number;
  diamondBalance: number;
  users: number;
  joined: string;
  email: string;
  phone: string;
  totalCoinsDistributed: number;
  totalDiamondsGenerated: number;
  totalDiamondsConverted: number;
  organization?: string;
  profileCompleted: boolean;
}

export interface CelebrityData {
  id: string;
  name: string;
  category: string;
  image: string;
  followers: string;
  rating: number;
  coinRate: number;
  isVerified: boolean;
  isOnline: boolean;
  isLive: boolean;
  tags: string[];
  bio: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  totalCalls: number;
  totalEarnings: number;
  phone: string;
  profileCompleted: boolean;
  age?: number;
  city?: string;
  gender?: 'Male' | 'Female' | 'Other';
  languages?: string[];
  speciality?: string;
  instagram?: string;
  isPremium?: boolean;
  experience?: number;
  youtube?: string;
  twitter?: string;
  availableFor?: string[];
}

export interface AdminPaymentSettings {
  bankAccount: string;
  upiId: string;
  ifscCode: string;
  accountHolderName: string;
}

export interface CreatedUser {
  id: string;
  name: string;
  phone: string;
  city: string;
  gender: 'Male' | 'Female' | 'Other';
  status: 'active' | 'suspended';
  coinBalance: number;
  diamondBalance: number;
  createdAt: string;
  profileCompleted: boolean;
  adminId?: string; // ID of the admin who created this user
  adminName?: string; // Name of the admin who created this user
}

export interface CoinRechargeRequest {
  id: string;
  userName: string;
  adminIds: string[];
  coins: number;
  price: number;
  bonus: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedByAdminId?: string;
  approvedByAdminName?: string;
  rejectedByAdminIds: string[];
  createdAt: string;
  approvedAt?: string;
}

export interface UserAssignedAdmin {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  // User state
  isPremium: boolean;
  coinBalance: number;
  diamondBalance: number;
  userName: string;
  userPhone: string;
  userCity: string;
  userGender: string;
  userAge: string;
  userInterests: string[];
  isLoggedIn: boolean;
  onboardingComplete: boolean;
  transactions: Transaction[];
  callHistory: CallRecord[];
  chatThreads: ChatThread[];
  notifications: Notification[];
  withdrawRequests: WithdrawRequest[];
  favourites: string[];

  // Admin state
  adminCoinInventory: number;
  adminDiamondBalance: number;
  adminUsers: MockUser[];
  adminTotalCoinsDistributed: number;
  adminTotalDiamondsGenerated: number;
  adminTotalDiamondsConverted: number;
  adminPaymentSettings: AdminPaymentSettings;

  // Super Admin state
  admins: AdminData[];
  totalMintedCoins: number;
  totalSystemDiamonds: number;
  totalCoinsInCirculation: number;
  totalDiamondsConverted: number;
  announcements: { id: string; title: string; message: string; target: string; date: string }[];

  // Celebrity state
  celebrities: CelebrityData[];

  // Admin Request
  adminRequest: AdminRequestData | null;
  adminRequests: AdminRequestData[];

  // Actions
  addCoins: (amount: number, method: string) => void;
  deductCoins: (amount: number, reason: string, userName?: string) => void;
  addDiamonds: (amount: number, fromUser: string, callType: string) => void;
  addCallRecord: (record: Omit<CallRecord, 'id' | 'date'>) => void;
  sendMessage: (toUserId: string, toUserName: string, toUserAvatar: string, text: string) => boolean;
  getChatThread: (userId: string) => ChatThread | undefined;
  submitWithdraw: (diamonds: number, method: string, paymentDetails?: string) => void;
  approveWithdraw: (id: string) => void;
  rejectWithdraw: (id: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleFavourite: (userId: string) => void;
  setUserProfile: (data: { name?: string; phone?: string; city?: string; gender?: string; age?: string; interests?: string[] }) => void;
  completeOnboarding: () => void;
  login: () => void;
  logout: () => void;
  upgradeToPremium: () => void;
  downgradeToFree: () => void;
  minWithdrawDiamonds: number;
  submitAdminRequest: (data: Omit<AdminRequestData, 'id' | 'status' | 'submittedAt'>) => void;
  cancelAdminRequest: () => void;
  approveAdminRequest: () => void;
  rejectAdminRequest: () => void;
  approveAdminRequestById: (id: string) => void;
  rejectAdminRequestById: (id: string) => void;

  // Admin actions
  adminBuyCoins: (amount: number) => void;
  adminSellCoinsToUser: (userId: string, amount: number) => void;
  adminApproveWithdraw: (id: string) => void;
  adminRejectWithdraw: (id: string) => void;
  adminMarkWithdrawPaid: (id: string, note?: string) => void;
  adminUpdatePaymentSettings: (settings: Partial<AdminPaymentSettings>) => void;

  // Super Admin actions
  mintCoins: (amount: number) => void;
  sellCoinsToAdmin: (adminId: string, amount: number) => void;
  suspendAdmin: (adminId: string) => void;
  activateAdmin: (adminId: string) => void;
  removeAdmin: (adminId: string) => void;
  addAnnouncement: (title: string, message: string, target: string) => void;
  createAdmin: (data: { name: string; email: string; phone: string; organization?: string; initialCoins?: number }) => AdminData;
  createdUsers: CreatedUser[];
  adminCreateUser: (data: { name: string; phone: string; city: string; gender: 'Male' | 'Female' | 'Other'; adminId?: string; adminName?: string }) => CreatedUser;

  // Coin Recharge Request system (User → Admin)
  coinRechargeRequests: CoinRechargeRequest[];
  userAssignedAdmin: UserAssignedAdmin | null;
  submitCoinRechargeRequest: (adminIds: string[], coins: number, price: number, bonus: number) => void;
  approveCoinRechargeRequest: (requestId: string, adminId: string) => void;
  rejectCoinRechargeRequest: (requestId: string, adminId: string) => void;
  assignAdminToUser: (adminId: string) => void;

  // Celebrity actions (Super Admin only)
  addCelebrity: (data: Omit<CelebrityData, 'id' | 'createdAt' | 'totalCalls' | 'totalEarnings' | 'profileCompleted'>) => CelebrityData;
  updateCelebrity: (id: string, data: Partial<CelebrityData>) => void;
  removeCelebrity: (id: string) => void;
  toggleCelebStatus: (id: string) => void;

  // Coin Purchase Request system (Admin <-> Super Admin)
  coinPurchaseRequests: CoinPurchaseRequest[];
  adminPaymentDebt: number;
  requestCoinPurchase: (coinAmount: number) => void;
  approveCoinPurchaseRequest: (id: string) => void;
  rejectCoinPurchaseRequest: (id: string) => void;
  markCoinPurchasePaid: (id: string) => void;

  // Phone-based OTP authentication
  checkPhoneForLogin: (phone: string, role: 'USER' | 'ADMIN' | 'CELEBRITY') => { success: boolean; error?: string; id?: string; name?: string; profileCompleted?: boolean; adminId?: string; adminName?: string; userStatus?: 'existing' | 'admin_created' | 'not_found' };
  verifyLoginOTP: (phone: string, otp: string) => { success: boolean; error?: string };
  markProfileCompleted: (role: 'USER' | 'ADMIN' | 'CELEBRITY', id: string) => void;

  unreadNotifications: number;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Safe no-op functions for fallback state during HMR
const noop = () => {};
const noopReturn = () => ({ success: false, error: 'Provider not ready' });

// Fallback state used during HMR when provider temporarily unmounts
const FALLBACK_STATE: AppState = {
  isPremium: false,
  coinBalance: 0,
  diamondBalance: 0,
  userName: '',
  userPhone: '',
  userCity: '',
  userGender: '',
  userAge: '',
  userInterests: [],
  isLoggedIn: false,
  onboardingComplete: false,
  transactions: [],
  callHistory: [],
  chatThreads: [],
  notifications: [],
  withdrawRequests: [],
  favourites: [],
  adminCoinInventory: 0,
  adminDiamondBalance: 0,
  adminUsers: [],
  adminTotalCoinsDistributed: 0,
  adminTotalDiamondsGenerated: 0,
  adminTotalDiamondsConverted: 0,
  adminPaymentSettings: {
    bankAccount: '',
    upiId: '',
    ifscCode: '',
    accountHolderName: '',
  },
  admins: [],
  totalMintedCoins: 0,
  totalSystemDiamonds: 0,
  totalCoinsInCirculation: 0,
  totalDiamondsConverted: 0,
  announcements: [],
  celebrities: [],
  adminRequest: null,
  adminRequests: [],
  addCoins: noop as any,
  deductCoins: noop as any,
  addDiamonds: noop as any,
  addCallRecord: noop as any,
  sendMessage: () => false,
  getChatThread: () => undefined,
  submitWithdraw: noop as any,
  approveWithdraw: noop as any,
  rejectWithdraw: noop as any,
  addNotification: noop as any,
  markNotificationRead: noop as any,
  markAllNotificationsRead: noop as any,
  toggleFavourite: noop as any,
  setUserProfile: noop as any,
  completeOnboarding: noop as any,
  login: noop as any,
  logout: noop as any,
  upgradeToPremium: noop as any,
  downgradeToFree: noop as any,
  minWithdrawDiamonds: 100,
  submitAdminRequest: noop as any,
  cancelAdminRequest: noop as any,
  approveAdminRequest: noop as any,
  rejectAdminRequest: noop as any,
  approveAdminRequestById: noop as any,
  rejectAdminRequestById: noop as any,
  adminBuyCoins: noop as any,
  adminSellCoinsToUser: noop as any,
  adminApproveWithdraw: noop as any,
  adminRejectWithdraw: noop as any,
  adminMarkWithdrawPaid: noop as any,
  adminUpdatePaymentSettings: noop as any,
  mintCoins: noop as any,
  sellCoinsToAdmin: noop as any,
  suspendAdmin: noop as any,
  activateAdmin: noop as any,
  removeAdmin: noop as any,
  addAnnouncement: noop as any,
  createAdmin: (() => ({ id: '', name: '', role: '', status: 'active' as const, coinInventory: 0, diamondBalance: 0, users: 0, joined: '', email: '', phone: '', totalCoinsDistributed: 0, totalDiamondsGenerated: 0, totalDiamondsConverted: 0, profileCompleted: false })) as any,
  createdUsers: [],
  adminCreateUser: (() => ({ id: '', name: '', phone: '', city: '', gender: 'Male' as const, status: 'active' as const, coinBalance: 0, diamondBalance: 0, createdAt: '', profileCompleted: false, adminId: '', adminName: '' })) as any,
  coinRechargeRequests: [],
  userAssignedAdmin: null,
  submitCoinRechargeRequest: noop as any,
  approveCoinRechargeRequest: noop as any,
  rejectCoinRechargeRequest: noop as any,
  assignAdminToUser: noop as any,
  addCelebrity: (() => ({ id: '', name: '', category: '', image: '', followers: '', rating: 0, coinRate: 0, isVerified: false, isOnline: false, isLive: false, tags: [], bio: '', status: 'pending' as const, createdAt: '', totalCalls: 0, totalEarnings: 0, phone: '', profileCompleted: false })) as any,
  updateCelebrity: noop as any,
  removeCelebrity: noop as any,
  toggleCelebStatus: noop as any,
  coinPurchaseRequests: [],
  adminPaymentDebt: 0,
  requestCoinPurchase: noop as any,
  approveCoinPurchaseRequest: noop as any,
  rejectCoinPurchaseRequest: noop as any,
  markCoinPurchasePaid: noop as any,
  checkPhoneForLogin: noopReturn as any,
  verifyLoginOTP: noopReturn as any,
  markProfileCompleted: noop as any,
  unreadNotifications: 0,
};

export const useApp = () => {
  const context = useContext(AppContext);
  // FALLBACK_STATE is returned silently when provider is temporarily absent (e.g. HMR).
  // No warning needed — the fallback is safe and the app recovers on next render.
  return context ?? FALLBACK_STATE;
};

// ─── Helpers ───
const genId = () => Math.random().toString(36).substr(2, 9);
const now = () => {
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `Today, ${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
};

// Mask numbers in message text: replace digits with X
export const maskNumbers = (text: string): string => {
  return text.replace(/\d/g, 'X');
};

// Count words in text
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
};

// ─── Initial Data ───
const initialTransactions: Transaction[] = [
  { id: 't1', type: 'recharge', amount: 500, date: 'Today, 3:42 PM', method: 'UPI', status: 'completed' },
  { id: 't2', type: 'call', amount: -45, date: 'Today, 2:15 PM', user: 'Ananya S.', status: 'completed' },
  { id: 't3', type: 'call', amount: -125, date: 'Yesterday', user: 'Priya P.', status: 'completed' },
  { id: 't4', type: 'recharge', amount: 1000, date: 'Feb 23', method: 'Card', status: 'completed' },
  { id: 't5', type: 'message', amount: -18, date: 'Feb 22', user: 'Meera K.', status: 'completed' },
];

const initialCallHistory: CallRecord[] = [
  { id: 'c1', userId: '1', userName: 'Ananya Sharma', userAvatar: mockUsers[0].avatar, type: 'video', duration: 100, coinsUsed: 40, diamondsEarned: 6, date: 'Today, 2:15 PM', rating: 5 },
  { id: 'c2', userId: '3', userName: 'Priya Patel', userAvatar: mockUsers[2].avatar, type: 'audio', duration: 600, coinsUsed: 60, diamondsEarned: 10, date: 'Yesterday', rating: 4 },
  { id: 'c3', userId: '5', userName: 'Meera Kapoor', userAvatar: mockUsers[4].avatar, type: 'video', duration: 180, coinsUsed: 72, diamondsEarned: 12, date: 'Feb 22', rating: 5 },
];

const initialNotifications: Notification[] = [
  { id: 'n1', title: 'Welcome to IMITR', message: 'Your premium account is now active', type: 'success', time: '2 hrs ago', read: false },
  { id: 'n2', title: 'Recharge Successful', message: '500 coins added to your wallet', type: 'coin', time: '3 hrs ago', read: false },
  { id: 'n3', title: 'Missed Call', message: 'You missed a call from Priya P.', type: 'call', time: '5 hrs ago', read: true },
  { id: 'n4', title: 'Diamond Earned', message: 'You earned 6 diamonds from a video call', type: 'diamond', time: '1 day ago', read: true },
];

const initialWithdraws: WithdrawRequest[] = [
  { id: 'w1', diamonds: 100, amount: 180, status: 'approved', date: 'Feb 20', method: 'Bank Transfer', userName: 'Arun Kumar' },
  { id: 'w2', diamonds: 150, amount: 270, status: 'pending', date: 'Feb 15', method: 'UPI', userName: 'Meera K.' },
];

const initialChatThreads: ChatThread[] = [
  {
    userId: '1',
    userName: 'Ananya Sharma',
    userAvatar: mockUsers[0].avatar,
    messages: [
      { id: 'm1', fromUserId: 'self', toUserId: '1', toUserName: 'Ananya Sharma', text: 'Hi Ananya! How are you doing today?', coinsSpent: 3, timestamp: 'Today, 10:30 AM', direction: 'sent' },
      { id: 'm2', fromUserId: '1', toUserId: 'self', toUserName: 'Arun Kumar', text: 'Hey! I am good, thanks for asking. How about you?', coinsSpent: 0, timestamp: 'Today, 10:32 AM', direction: 'received' },
      { id: 'm3', fromUserId: 'self', toUserId: '1', toUserName: 'Ananya Sharma', text: 'Doing great! Just exploring the app.', coinsSpent: 3, timestamp: 'Today, 10:35 AM', direction: 'sent' },
    ],
    totalCoinsSent: 6,
    totalDiamondsReceived: 1,
    sentMessageCount: 2,
    receivedMessageCount: 1,
  },
];

const initialAdmins: AdminData[] = [
  { id: 'ADM-001', name: 'Suresh Kumar', role: 'Creator Admin', status: 'active', coinInventory: 125400, diamondBalance: 3247, users: 342, joined: 'Jan 2025', email: 'suresh@imitr.com', phone: '+91 98765 00001', totalCoinsDistributed: 450000, totalDiamondsGenerated: 75000, totalDiamondsConverted: 45000, organization: 'StarConnect Media', profileCompleted: true },
  { id: 'ADM-002', name: 'Kavita Sharma', role: 'Creator Admin', status: 'active', coinInventory: 89200, diamondBalance: 1850, users: 278, joined: 'Feb 2025', email: 'kavita@imitr.com', phone: '+91 98765 00002', totalCoinsDistributed: 320000, totalDiamondsGenerated: 53333, totalDiamondsConverted: 32000, organization: 'DigiTalent Hub', profileCompleted: true },
  { id: 'ADM-003', name: 'Ravi Patel', role: 'Creator Admin', status: 'active', coinInventory: 56000, diamondBalance: 920, users: 189, joined: 'Feb 2025', email: 'ravi@imitr.com', phone: '+91 98765 00003', totalCoinsDistributed: 180000, totalDiamondsGenerated: 30000, totalDiamondsConverted: 18000, organization: 'Pixel Studios', profileCompleted: false },
  { id: 'ADM-004', name: 'Deepa Nair', role: 'Creator Admin', status: 'suspended', coinInventory: 12300, diamondBalance: 450, users: 94, joined: 'Mar 2025', email: 'deepa@imitr.com', phone: '+91 98765 00004', totalCoinsDistributed: 75000, totalDiamondsGenerated: 12500, totalDiamondsConverted: 8000, organization: 'VibeLive Network', profileCompleted: false },
  { id: 'ADM-005', name: 'Amit Singh', role: 'Creator Admin', status: 'active', coinInventory: 67800, diamondBalance: 2100, users: 215, joined: 'Mar 2025', email: 'amit@imitr.com', phone: '+91 98765 00005', totalCoinsDistributed: 290000, totalDiamondsGenerated: 48333, totalDiamondsConverted: 28000, organization: 'Royal Creators', profileCompleted: false },
  { id: 'ADM-006', name: 'Priya Menon', role: 'Creator Admin', status: 'active', coinInventory: 104500, diamondBalance: 2780, users: 310, joined: 'Jan 2025', email: 'priya.menon@imitr.com', phone: '+91 98765 00006', totalCoinsDistributed: 385000, totalDiamondsGenerated: 64166, totalDiamondsConverted: 39000, organization: 'Luminaire Entertainment', profileCompleted: true },
  { id: 'ADM-007', name: 'Arjun Reddy', role: 'Creator Admin', status: 'active', coinInventory: 73600, diamondBalance: 1540, users: 226, joined: 'Feb 2025', email: 'arjun.reddy@imitr.com', phone: '+91 98765 00007', totalCoinsDistributed: 258000, totalDiamondsGenerated: 43000, totalDiamondsConverted: 26500, organization: 'Elevate Digital', profileCompleted: false },
  { id: 'ADM-008', name: 'Neha Gupta', role: 'Creator Admin', status: 'active', coinInventory: 95100, diamondBalance: 2430, users: 295, joined: 'Jan 2025', email: 'neha.gupta@imitr.com', phone: '+91 98765 00008', totalCoinsDistributed: 410000, totalDiamondsGenerated: 68333, totalDiamondsConverted: 41000, organization: 'CrownVerse Agency', profileCompleted: true },
  { id: 'ADM-009', name: 'Vikash Joshi', role: 'Creator Admin', status: 'active', coinInventory: 41200, diamondBalance: 870, users: 152, joined: 'Mar 2025', email: 'vikash.joshi@imitr.com', phone: '+91 98765 00009', totalCoinsDistributed: 142000, totalDiamondsGenerated: 23666, totalDiamondsConverted: 14500, organization: 'TrendWave Studios', profileCompleted: false },
  { id: 'ADM-010', name: 'Lakshmi Iyer', role: 'Creator Admin', status: 'active', coinInventory: 112800, diamondBalance: 3050, users: 338, joined: 'Dec 2024', email: 'lakshmi.iyer@imitr.com', phone: '+91 98765 00010', totalCoinsDistributed: 470000, totalDiamondsGenerated: 78333, totalDiamondsConverted: 47000, organization: 'GoldStar Collective', profileCompleted: true },
];

const initialCelebrities: CelebrityData[] = [
  { id: 'CEL-001', name: 'Ananya Sharma', category: 'Actress', image: 'https://images.unsplash.com/photo-1638964327749-53436bcccdca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGNlbGVicml0eSUyMGdsYW1vdXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIxNjkwMzR8MA&ixlib=rb-4.1.0&q=80&w=1080', followers: '1.2M', rating: 4.8, coinRate: 20, isVerified: true, isOnline: true, isLive: false, tags: ['Actress', 'Fashion'], bio: 'Renowned actress known for her versatile roles in Bollywood cinema.', status: 'active', createdAt: 'Jan 2025', totalCalls: 1842, totalEarnings: 48500, phone: '+91 99887 76601', profileCompleted: true, age: 28, city: 'Mumbai', gender: 'Female', languages: ['Hindi', 'English', 'Marathi'], speciality: 'Method Acting & Dance', instagram: '@ananyasharma_official', isPremium: true, experience: 8, youtube: '@AnanyaSharmaOfficial', twitter: '@ananya_sharma', availableFor: ['Video Call', 'Audio Call', 'Meet & Greet'] },
  { id: 'CEL-002', name: 'Vikram Rathore', category: 'Actor', image: 'https://images.unsplash.com/photo-1745426358430-7d88183c1b90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBhY3RvciUyMHBvcnRyYWl0JTIwc3R1ZGlvfGVufDF8fHx8MTc3MjE2OTAzN3ww&ixlib=rb-4.1.0&q=80&w=1080', followers: '850K', rating: 4.6, coinRate: 18, isVerified: true, isOnline: false, isLive: false, tags: ['Actor', 'Sports'], bio: 'Action star and fitness enthusiast with a massive fan following.', status: 'active', createdAt: 'Jan 2025', totalCalls: 1240, totalEarnings: 32000, phone: '+91 99887 76602', profileCompleted: true, age: 34, city: 'Delhi', gender: 'Male', languages: ['Hindi', 'English', 'Punjabi'], speciality: 'Action & Stunts', instagram: '@vikramrathore', isPremium: true, experience: 12, youtube: '@VikramRathoreFilms', twitter: '@vikram_rathore', availableFor: ['Video Call', 'Audio Call'] },
  { id: 'CEL-003', name: 'Meera Nair', category: 'Singer', image: 'https://images.unsplash.com/photo-1763296378615-becd737bceb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwZXJmb3JtZXIlMjBzdGFnZSUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjE2OTA0MHww&ixlib=rb-4.1.0&q=80&w=1080', followers: '2.4M', rating: 4.9, coinRate: 25, isVerified: true, isOnline: true, isLive: true, tags: ['Music', 'Lifestyle'], bio: 'Chart-topping singer and songwriter with international acclaim.', status: 'active', createdAt: 'Feb 2025', totalCalls: 2100, totalEarnings: 67000, phone: '+91 99887 76603', profileCompleted: false, age: 26, city: 'Kochi', gender: 'Female', languages: ['Malayalam', 'Hindi', 'English', 'Tamil'], speciality: 'Playback Singing & Composition', instagram: '@meeranairmusic', isPremium: true, experience: 6, youtube: '@MeeraNairMusic', twitter: '@meera_nair', availableFor: ['Video Call', 'Audio Call', 'Live Session'] },
];

// ─── localStorage persistence helpers ───
const CELEB_STORAGE_KEY = 'imitr_celebrities';
const COIN_PURCHASE_STORAGE_KEY = 'imitr_coin_purchases';
const ADMIN_REQUESTS_STORAGE_KEY = 'imitr_admin_requests';
const ADMIN_REQUEST_STORAGE_KEY = 'imitr_admin_request';
const CHAT_THREADS_STORAGE_KEY = 'imitr_chat_threads';
const TRANSACTIONS_STORAGE_KEY = 'imitr_transactions';
const CALL_HISTORY_STORAGE_KEY = 'imitr_call_history';
const FAVOURITES_STORAGE_KEY = 'imitr_favourites';
const NOTIFICATIONS_STORAGE_KEY = 'imitr_notifications';
const WITHDRAWS_STORAGE_KEY = 'imitr_withdraws';
const USER_PROFILE_STORAGE_KEY = 'imitr_user_profile';
const PREMIUM_STORAGE_KEY = 'imitr_premium';
const BALANCES_STORAGE_KEY = 'imitr_balances';
const ADMIN_PAYMENT_DEBT_STORAGE_KEY = 'imitr_admin_payment_debt';
const ADMINS_STORAGE_KEY = 'imitr_admins';
const ADMINS_VERSION_KEY = 'imitr_admins_version';
const ADMINS_DATA_VERSION = 4; // bump this when initialAdmins changes
const ADMIN_COIN_INVENTORY_STORAGE_KEY = 'imitr_admin_coin_inventory';
const ADMIN_DIAMOND_BALANCE_STORAGE_KEY = 'imitr_admin_diamond_balance';
const ADMIN_STATS_STORAGE_KEY = 'imitr_admin_stats';
const ANNOUNCEMENTS_STORAGE_KEY = 'imitr_announcements';
const SA_SYSTEM_STATS_STORAGE_KEY = 'imitr_sa_system_stats';
const ADMIN_PAYMENT_SETTINGS_STORAGE_KEY = 'imitr_admin_payment_settings';

function loadCelebritiesFromStorage(): CelebrityData[] {
  return loadFromStorage(CELEB_STORAGE_KEY, initialCelebrities);
}

function saveCelebritiesToStorage(celebs: CelebrityData[]) {
  saveToStorage(CELEB_STORAGE_KEY, celebs);
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed as T;
    }
  } catch (_e) { /* ignore parse errors */ }
  return fallback;
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_e) { /* ignore quota errors */ }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(() => loadFromStorage(PREMIUM_STORAGE_KEY, false));
  const [coinBalance, setCoinBalance] = useState(() => {
    const b = loadFromStorage<{ coins: number; diamonds: number } | null>(BALANCES_STORAGE_KEY, null);
    return b ? b.coins : 6000;
  });
  const [diamondBalance, setDiamondBalance] = useState(() => {
    const b = loadFromStorage<{ coins: number; diamonds: number } | null>(BALANCES_STORAGE_KEY, null);
    return b ? b.diamonds : 247;
  });
  const [userName, setUserName] = useState(() => {
    const p = loadFromStorage<{ name: string; phone: string; city: string; gender: string; age: string; interests: string[] } | null>(USER_PROFILE_STORAGE_KEY, null);
    return p ? p.name : 'Arun Kumar';
  });
  const [userPhone, setUserPhone] = useState(() => {
    const p = loadFromStorage<{ name: string; phone: string; city: string; gender: string; age: string; interests: string[] } | null>(USER_PROFILE_STORAGE_KEY, null);
    return p ? p.phone : '+91 98765 43210';
  });
  const [userCity, setUserCity] = useState(() => {
    const p = loadFromStorage<{ name: string; phone: string; city: string; gender: string; age: string; interests: string[] } | null>(USER_PROFILE_STORAGE_KEY, null);
    return p ? p.city : 'Mumbai';
  });
  const [userGender, setUserGender] = useState(() => {
    const p = loadFromStorage<{ name: string; phone: string; city: string; gender: string; age: string; interests: string[] } | null>(USER_PROFILE_STORAGE_KEY, null);
    return p ? p.gender : 'Male';
  });
  const [userAge, setUserAge] = useState(() => {
    const p = loadFromStorage<{ name: string; phone: string; city: string; gender: string; age: string; interests: string[] } | null>(USER_PROFILE_STORAGE_KEY, null);
    return p ? p.age : '30';
  });
  const [userInterests, setUserInterests] = useState<string[]>(() => {
    const p = loadFromStorage<{ name: string; phone: string; city: string; gender: string; age: string; interests: string[] } | null>(USER_PROFILE_STORAGE_KEY, null);
    return p ? p.interests : ['Business', 'Travel', 'Music'];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadFromStorage(TRANSACTIONS_STORAGE_KEY, initialTransactions));
  const [callHistory, setCallHistory] = useState<CallRecord[]>(() => loadFromStorage(CALL_HISTORY_STORAGE_KEY, initialCallHistory));
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => loadFromStorage(CHAT_THREADS_STORAGE_KEY, initialChatThreads));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage(NOTIFICATIONS_STORAGE_KEY, initialNotifications));
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawRequest[]>(() => loadFromStorage(WITHDRAWS_STORAGE_KEY, initialWithdraws));
  const [favourites, setFavourites] = useState<string[]>(() => loadFromStorage(FAVOURITES_STORAGE_KEY, ['1', '3']));

  const [adminCoinInventory, setAdminCoinInventory] = useState(() => loadFromStorage(ADMIN_COIN_INVENTORY_STORAGE_KEY, 125400));
  const [adminDiamondBalance, setAdminDiamondBalance] = useState(() => loadFromStorage(ADMIN_DIAMOND_BALANCE_STORAGE_KEY, 3247));
  const [adminUsers] = useState<MockUser[]>(mockUsers);
  const [adminTotalCoinsDistributed, setAdminTotalCoinsDistributed] = useState(() => loadFromStorage(ADMIN_STATS_STORAGE_KEY, { totalCoinsDistributed: 450000, totalDiamondsGenerated: 75000, totalDiamondsConverted: 45000 }).totalCoinsDistributed);
  const [adminTotalDiamondsGenerated, setAdminTotalDiamondsGenerated] = useState(() => loadFromStorage(ADMIN_STATS_STORAGE_KEY, { totalCoinsDistributed: 450000, totalDiamondsGenerated: 75000, totalDiamondsConverted: 45000 }).totalDiamondsGenerated);
  const [adminTotalDiamondsConverted, setAdminTotalDiamondsConverted] = useState(() => loadFromStorage(ADMIN_STATS_STORAGE_KEY, { totalCoinsDistributed: 450000, totalDiamondsGenerated: 75000, totalDiamondsConverted: 45000 }).totalDiamondsConverted);
  const [adminPaymentSettings, setAdminPaymentSettings] = useState<AdminPaymentSettings>(() => loadFromStorage(ADMIN_PAYMENT_SETTINGS_STORAGE_KEY, {
    bankAccount: '',
    upiId: '',
    ifscCode: '',
    accountHolderName: '',
  }));

  const [admins, setAdmins] = useState<AdminData[]>(() => {
    const savedVersion = loadFromStorage<number>(ADMINS_VERSION_KEY, 0);
    if (savedVersion < ADMINS_DATA_VERSION) {
      // Data version changed — use fresh initialAdmins and update version
      saveToStorage(ADMINS_STORAGE_KEY, initialAdmins);
      saveToStorage(ADMINS_VERSION_KEY, ADMINS_DATA_VERSION);
      return initialAdmins;
    }
    return loadFromStorage(ADMINS_STORAGE_KEY, initialAdmins);
  });
  const [totalMintedCoins, setTotalMintedCoins] = useState(() => loadFromStorage(SA_SYSTEM_STATS_STORAGE_KEY, { totalMintedCoins: 8400000, totalSystemDiamonds: 1200000, totalCoinsInCirculation: 6200000, totalDiamondsConverted: 131000 }).totalMintedCoins);
  const [totalSystemDiamonds, setTotalSystemDiamonds] = useState(() => loadFromStorage(SA_SYSTEM_STATS_STORAGE_KEY, { totalMintedCoins: 8400000, totalSystemDiamonds: 1200000, totalCoinsInCirculation: 6200000, totalDiamondsConverted: 131000 }).totalSystemDiamonds);
  const [totalCoinsInCirculation, setTotalCoinsInCirculation] = useState(() => loadFromStorage(SA_SYSTEM_STATS_STORAGE_KEY, { totalMintedCoins: 8400000, totalSystemDiamonds: 1200000, totalCoinsInCirculation: 6200000, totalDiamondsConverted: 131000 }).totalCoinsInCirculation);
  const [totalDiamondsConverted, setTotalDiamondsConverted] = useState(() => loadFromStorage(SA_SYSTEM_STATS_STORAGE_KEY, { totalMintedCoins: 8400000, totalSystemDiamonds: 1200000, totalCoinsInCirculation: 6200000, totalDiamondsConverted: 131000 }).totalDiamondsConverted);
  const [announcements, setAnnouncements] = useState(() => loadFromStorage(ANNOUNCEMENTS_STORAGE_KEY, [
    { id: 'a1', title: 'Scheduled Maintenance', message: 'System maintenance on Feb 28, 2-4 AM IST', target: 'All Users', date: 'Feb 25' },
    { id: 'a2', title: 'New Feature: Video Filters', message: 'Premium video filters now available', target: 'Creators', date: 'Feb 22' },
  ]));

  const [celebrities, setCelebrities] = useState<CelebrityData[]>(loadCelebritiesFromStorage);

  // Sync celebrities to localStorage whenever they change
  React.useEffect(() => {
    saveCelebritiesToStorage(celebrities);
  }, [celebrities]);

  const [adminRequest, setAdminRequest] = useState<AdminRequestData | null>(() => loadFromStorage(ADMIN_REQUEST_STORAGE_KEY, null));
  const [adminRequests, setAdminRequests] = useState<AdminRequestData[]>(() => loadFromStorage(ADMIN_REQUESTS_STORAGE_KEY, []));

  const [coinPurchaseRequests, setCoinPurchaseRequests] = useState<CoinPurchaseRequest[]>(() => loadFromStorage(COIN_PURCHASE_STORAGE_KEY, []));
  const [adminPaymentDebt, setAdminPaymentDebt] = useState(() => loadFromStorage(ADMIN_PAYMENT_DEBT_STORAGE_KEY, 0));

  // ─── Persist state slices to localStorage ───
  React.useEffect(() => { saveToStorage(COIN_PURCHASE_STORAGE_KEY, coinPurchaseRequests); }, [coinPurchaseRequests]);
  React.useEffect(() => { saveToStorage(ADMIN_REQUESTS_STORAGE_KEY, adminRequests); }, [adminRequests]);
  React.useEffect(() => { saveToStorage(ADMIN_REQUEST_STORAGE_KEY, adminRequest); }, [adminRequest]);
  React.useEffect(() => { saveToStorage(CHAT_THREADS_STORAGE_KEY, chatThreads); }, [chatThreads]);
  React.useEffect(() => { saveToStorage(TRANSACTIONS_STORAGE_KEY, transactions); }, [transactions]);
  React.useEffect(() => { saveToStorage(CALL_HISTORY_STORAGE_KEY, callHistory); }, [callHistory]);
  React.useEffect(() => { saveToStorage(FAVOURITES_STORAGE_KEY, favourites); }, [favourites]);
  React.useEffect(() => { saveToStorage(NOTIFICATIONS_STORAGE_KEY, notifications); }, [notifications]);
  React.useEffect(() => { saveToStorage(WITHDRAWS_STORAGE_KEY, withdrawRequests); }, [withdrawRequests]);
  React.useEffect(() => { saveToStorage(PREMIUM_STORAGE_KEY, isPremium); }, [isPremium]);
  React.useEffect(() => { saveToStorage(BALANCES_STORAGE_KEY, { coins: coinBalance, diamonds: diamondBalance }); }, [coinBalance, diamondBalance]);
  React.useEffect(() => { saveToStorage(USER_PROFILE_STORAGE_KEY, { name: userName, phone: userPhone, city: userCity, gender: userGender, age: userAge, interests: userInterests }); }, [userName, userPhone, userCity, userGender, userAge, userInterests]);
  React.useEffect(() => { saveToStorage(ADMIN_PAYMENT_DEBT_STORAGE_KEY, adminPaymentDebt); }, [adminPaymentDebt]);
  React.useEffect(() => { saveToStorage(ADMINS_STORAGE_KEY, admins); }, [admins]);
  React.useEffect(() => { saveToStorage(ADMIN_COIN_INVENTORY_STORAGE_KEY, adminCoinInventory); }, [adminCoinInventory]);
  React.useEffect(() => { saveToStorage(ADMIN_DIAMOND_BALANCE_STORAGE_KEY, adminDiamondBalance); }, [adminDiamondBalance]);
  React.useEffect(() => { saveToStorage(ADMIN_STATS_STORAGE_KEY, { totalCoinsDistributed: adminTotalCoinsDistributed, totalDiamondsGenerated: adminTotalDiamondsGenerated, totalDiamondsConverted: adminTotalDiamondsConverted }); }, [adminTotalCoinsDistributed, adminTotalDiamondsGenerated, adminTotalDiamondsConverted]);
  React.useEffect(() => { saveToStorage(SA_SYSTEM_STATS_STORAGE_KEY, { totalMintedCoins: totalMintedCoins, totalSystemDiamonds: totalSystemDiamonds, totalCoinsInCirculation: totalCoinsInCirculation, totalDiamondsConverted: totalDiamondsConverted }); }, [totalMintedCoins, totalSystemDiamonds, totalCoinsInCirculation, totalDiamondsConverted]);
  React.useEffect(() => { saveToStorage(ANNOUNCEMENTS_STORAGE_KEY, announcements); }, [announcements]);
  React.useEffect(() => { saveToStorage(ADMIN_PAYMENT_SETTINGS_STORAGE_KEY, adminPaymentSettings); }, [adminPaymentSettings]);

  // ─── User Actions ───
  const addCoins = useCallback((amount: number, method: string) => {
    setCoinBalance(prev => prev + amount);
    setTransactions(prev => [
      { id: genId(), type: 'recharge', amount, date: now(), method, status: 'completed' },
      ...prev,
    ]);
    setNotifications(prev => [
      { id: genId(), title: 'Recharge Successful', message: `${amount.toLocaleString()} coins added via ${method}`, type: 'coin', time: 'Just now', read: false },
      ...prev,
    ]);
  }, []);

  const deductCoins = useCallback((amount: number, reason: string, user?: string) => {
    setCoinBalance(prev => Math.max(0, prev - amount));
    const type = reason === 'Message' ? 'message' as const : 'call' as const;
    setTransactions(prev => [
      { id: genId(), type, amount: -amount, date: now(), user, status: 'completed' },
      ...prev,
    ]);
  }, []);

  const addDiamonds = useCallback((amount: number, fromUser: string, callType: string) => {
    setDiamondBalance(prev => prev + amount);
    setNotifications(prev => [
      { id: genId(), title: 'Diamond Earned!', message: `+${amount} diamonds from ${callType} with ${fromUser}`, type: 'diamond', time: 'Just now', read: false },
      ...prev,
    ]);
  }, []);

  const addCallRecord = useCallback((record: Omit<CallRecord, 'id' | 'date'>) => {
    setCallHistory(prev => [{ ...record, id: genId(), date: now() }, ...prev]);
  }, []);

  // ─── Message System ───
  // Returns true if message sent successfully, false if insufficient coins or word limit
  const sendMessage = useCallback((toUserId: string, toUserName: string, toUserAvatar: string, text: string): boolean => {
    // Check word limit
    const wordCount = countWords(text);
    if (wordCount > MESSAGE_WORD_LIMIT) return false;
    
    // Check coin balance
    if (coinBalance < MESSAGE_COST_COINS) return false;

    // Mask numbers in text
    const maskedText = maskNumbers(text);

    // Deduct coins from sender
    setCoinBalance(prev => prev - MESSAGE_COST_COINS);

    // Add transaction
    setTransactions(prev => [
      { id: genId(), type: 'message', amount: -MESSAGE_COST_COINS, date: now(), user: toUserName, status: 'completed' },
      ...prev,
    ]);

    const msgRecord: MessageRecord = {
      id: genId(),
      fromUserId: 'self',
      toUserId,
      toUserName,
      text: maskedText,
      coinsSpent: MESSAGE_COST_COINS,
      timestamp: now(),
      direction: 'sent',
    };

    setChatThreads(prev => {
      const existingIdx = prev.findIndex(t => t.userId === toUserId);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const thread = { ...updated[existingIdx] };
        thread.messages = [...thread.messages, msgRecord];
        thread.totalCoinsSent += MESSAGE_COST_COINS;
        thread.sentMessageCount += 1;
        // User B earns 1 diamond every 2 sent messages (2 × 3 coins = 6 coins = 1 diamond)
        if (thread.sentMessageCount % MESSAGES_PER_DIAMOND === 0) {
          thread.totalDiamondsReceived += 1;
        }
        updated[existingIdx] = thread;
        return updated;
      } else {
        return [...prev, {
          userId: toUserId,
          userName: toUserName,
          userAvatar: toUserAvatar,
          messages: [msgRecord],
          totalCoinsSent: MESSAGE_COST_COINS,
          totalDiamondsReceived: 0,
          sentMessageCount: 1,
          receivedMessageCount: 0,
        }];
      }
    });

    // Simulate auto-reply after 2s (for demo)
    setTimeout(() => {
      const replies = [
        'Thanks for your message!',
        'That sounds great!',
        'I appreciate you reaching out.',
        'Let me think about that...',
        'Haha, nice one!',
        'Tell me more about yourself!',
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg: MessageRecord = {
        id: genId(),
        fromUserId: toUserId,
        toUserId: 'self',
        toUserName: 'Arun Kumar',
        text: replyText,
        coinsSpent: 0,
        timestamp: now(),
        direction: 'received',
      };

      setChatThreads(prevThreads => {
        const idx = prevThreads.findIndex(t => t.userId === toUserId);
        if (idx >= 0) {
          const updated = [...prevThreads];
          const thread = { ...updated[idx] };
          thread.messages = [...thread.messages, replyMsg];
          thread.receivedMessageCount += 1;
          updated[idx] = thread;
          return updated;
        }
        return prevThreads;
      });
    }, 2000);

    return true;
  }, [coinBalance]);

  const getChatThread = useCallback((userId: string): ChatThread | undefined => {
    return chatThreads.find(t => t.userId === userId);
  }, [chatThreads]);

  const submitWithdraw = useCallback((diamonds: number, method: string, paymentDetails?: string) => {
    const minDiamonds = isPremium ? MIN_WITHDRAW_DIAMONDS_PREMIUM : MIN_WITHDRAW_DIAMONDS_FREE;
    if (diamonds < minDiamonds) return;
    const amount = parseFloat((diamonds * DIAMOND_TO_RUPEE).toFixed(2));
    setDiamondBalance(prev => prev - diamonds);
    setWithdrawRequests(prev => [
      { id: genId(), diamonds, amount, status: 'pending', date: now(), method, userName: userName || 'Arun Kumar', paymentDetails: paymentDetails || '' },
      ...prev,
    ]);
    setNotifications(prev => [
      { id: genId(), title: 'Withdrawal Submitted', message: `${diamonds} diamonds (₹${amount.toLocaleString()}) withdrawal pending admin approval`, type: 'diamond', time: 'Just now', read: false },
      ...prev,
    ]);
  }, [isPremium, userName]);

  const approveWithdraw = useCallback((id: string) => {
    setWithdrawRequests(prev => {
      const req = prev.find(w => w.id === id);
      if (req) {
        // Notification for the user
        setNotifications(n => [
          { id: genId(), title: 'Withdrawal Approved!', message: `Your withdrawal of ${req.diamonds} diamonds (₹${req.amount.toLocaleString()}) has been approved. Payment will be sent shortly.`, type: 'success', time: 'Just now', read: false },
          ...n,
        ]);
      }
      return prev.map(w => w.id === id ? { ...w, status: 'approved' as const, approvedAt: now() } : w);
    });
  }, []);

  const rejectWithdraw = useCallback((id: string) => {
    setWithdrawRequests(prev => {
      const req = prev.find(w => w.id === id);
      if (req) setDiamondBalance(d => d + req.diamonds);
      return prev.map(w => w.id === id ? { ...w, status: 'rejected' as const } : w);
    });
  }, []);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'time' | 'read'>) => {
    setNotifications(prev => [{ ...notif, id: genId(), time: 'Just now', read: false }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const toggleFavourite = useCallback((userId: string) => {
    setFavourites(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  }, []);

  const setUserProfile = useCallback((data: { name?: string; phone?: string; city?: string; gender?: string; age?: string; interests?: string[] }) => {
    if (data.name) setUserName(data.name);
    if (data.phone) setUserPhone(data.phone);
    if (data.city) setUserCity(data.city);
    if (data.gender) setUserGender(data.gender);
    if (data.age) setUserAge(data.age);
    if (data.interests) setUserInterests(data.interests);
  }, []);

  const completeOnboarding = useCallback(() => setOnboardingComplete(true), []);
  const login = useCallback(() => setIsLoggedIn(true), []);
  const logout = useCallback(() => setIsLoggedIn(false), []);
  const upgradeToPremium = useCallback(() => {
    setIsPremium(true);
    setCoinBalance(prev => prev + PREMIUM_FREE_COINS);
    setNotifications(prev => [
      { id: genId(), title: 'Welcome to Premium!', message: `You are now a Premium member! ${PREMIUM_FREE_COINS} free coins added to your wallet.`, type: 'success', time: 'Just now', read: false },
      ...prev,
    ]);
    setTransactions(prev => [
      { id: genId(), type: 'recharge', amount: PREMIUM_FREE_COINS, date: now(), method: 'Premium Bonus', status: 'completed' },
      ...prev,
    ]);
  }, []);

  const downgradeToFree = useCallback(() => {
    setIsPremium(false);
    setNotifications(prev => [
      { id: genId(), title: 'Downgraded to Free', message: 'You are now a Free member.', type: 'info', time: 'Just now', read: false },
      ...prev,
    ]);
  }, []);

  const minWithdrawDiamonds = isPremium ? MIN_WITHDRAW_DIAMONDS_PREMIUM : MIN_WITHDRAW_DIAMONDS_FREE;

  const submitAdminRequest = useCallback((data: Omit<AdminRequestData, 'id' | 'status' | 'submittedAt'>) => {
    const reqId = genId();
    const reqData = {
      id: reqId,
      status: 'pending' as const,
      submittedAt: now(),
      userName: userName,
      ...data,
    };
    setAdminRequest(reqData);
    setAdminRequests(prev => [reqData, ...prev]);
    setNotifications(prev => [
      { id: genId(), title: 'Admin Application Submitted', message: 'Your Creator Admin application is now under review by the Super Admin team.', type: 'info', time: 'Just now', read: false },
      ...prev,
    ]);
  }, [userName]);

  const cancelAdminRequest = useCallback(() => {
    setAdminRequest(null);
  }, []);

  const approveAdminRequest = useCallback(() => {
    if (adminRequest) {
      const approved = { ...adminRequest, status: 'approved' as const };
      setAdminRequest(approved);
      setAdminRequests(prev => prev.map(r => r.id === adminRequest.id ? { ...r, status: 'approved' as const } : r));
      setNotifications(prev => [
        { id: genId(), title: 'Admin Request Approved!', message: 'Your Creator Admin application has been approved. You now have admin access!', type: 'success', time: 'Just now', read: false },
        ...prev,
      ]);
    }
  }, [adminRequest]);

  const rejectAdminRequest = useCallback(() => {
    if (adminRequest) {
      const rejected = { ...adminRequest, status: 'rejected' as const };
      setAdminRequest(rejected);
      setAdminRequests(prev => prev.map(r => r.id === adminRequest.id ? { ...r, status: 'rejected' as const } : r));
      setNotifications(prev => [
        { id: genId(), title: 'Admin Request Declined', message: 'Your Creator Admin application was not approved. You may reapply later.', type: 'warning', time: 'Just now', read: false },
        ...prev,
      ]);
    }
  }, [adminRequest]);

  const approveAdminRequestById = useCallback((id: string) => {
    setAdminRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
    // Also sync the user's own adminRequest if it matches
    setAdminRequest(prev => prev && prev.id === id ? { ...prev, status: 'approved' as const } : prev);
    setNotifications(prev => [
      { id: genId(), title: 'Admin Request Approved!', message: 'A Creator Admin application has been approved.', type: 'success', time: 'Just now', read: false },
      ...prev,
    ]);
  }, []);

  const rejectAdminRequestById = useCallback((id: string) => {
    setAdminRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
    // Also sync the user's own adminRequest if it matches
    setAdminRequest(prev => prev && prev.id === id ? { ...prev, status: 'rejected' as const } : prev);
    setNotifications(prev => [
      { id: genId(), title: 'Admin Request Declined', message: 'A Creator Admin application was not approved.', type: 'warning', time: 'Just now', read: false },
      ...prev,
    ]);
  }, []);

  // ─── Admin Actions ───
  const adminBuyCoins = useCallback((amount: number) => {
    setAdminCoinInventory(prev => prev + amount);
  }, []);

  const adminSellCoinsToUser = useCallback((_userId: string, amount: number) => {
    setAdminCoinInventory(prev => prev - amount);
    setAdminTotalCoinsDistributed(prev => prev + amount);
  }, []);

  const adminApproveWithdraw = useCallback((id: string) => {
    setWithdrawRequests(prev => {
      const req = prev.find(w => w.id === id);
      if (req) {
        setAdminTotalDiamondsConverted(p => p + req.diamonds);
      }
      return prev.map(w => w.id === id ? { ...w, status: 'approved' as const } : w);
    });
  }, []);

  const adminRejectWithdraw = useCallback((id: string) => {
    rejectWithdraw(id);
  }, [rejectWithdraw]);

  const adminMarkWithdrawPaid = useCallback((id: string, note?: string) => {
    setWithdrawRequests(prev => {
      const req = prev.find(w => w.id === id);
      if (req) {
        // Add transaction record for the user's transaction history
        setTransactions(t => [
          { id: genId(), type: 'withdraw' as const, amount: -req.amount, date: now(), method: `Payout (${req.method})`, user: req.userName, status: 'completed' as const },
          ...t,
        ]);
        // Notification for user
        setNotifications(n => [
          { id: genId(), title: 'Payout Sent!', message: `₹${req.amount.toLocaleString()} has been sent to your ${req.method}. ${req.diamonds} diamonds converted.`, type: 'success', time: 'Just now', read: false },
          ...n,
        ]);
      }
      return prev.map(w => w.id === id ? { ...w, status: 'paid' as const, paidAt: now(), adminNote: note || w.adminNote } : w);
    });
  }, []);

  const adminUpdatePaymentSettings = useCallback((settings: Partial<AdminPaymentSettings>) => {
    setAdminPaymentSettings(prev => ({ ...prev, ...settings }));
  }, []);

  // ─── Super Admin Actions ───
  const mintCoins = useCallback((amount: number) => {
    setTotalMintedCoins(prev => prev + amount);
  }, []);

  const sellCoinsToAdmin = useCallback((adminId: string, amount: number) => {
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, coinInventory: a.coinInventory + amount } : a));
    setTotalCoinsInCirculation(prev => prev + amount);
  }, []);

  const suspendAdmin = useCallback((adminId: string) => {
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, status: 'suspended' as const } : a));
  }, []);

  const activateAdmin = useCallback((adminId: string) => {
    setAdmins(prev => prev.map(a => a.id === adminId ? { ...a, status: 'active' as const } : a));
  }, []);

  const removeAdmin = useCallback((adminId: string) => {
    setAdmins(prev => prev.filter(a => a.id !== adminId));
  }, []);

  const addAnnouncement = useCallback((title: string, message: string, target: string) => {
    setAnnouncements(prev => [{ id: genId(), title, message, target, date: 'Today' }, ...prev]);
  }, []);

  // ─── Create Admin (Super Admin) ───
  const createAdmin = useCallback((data: { name: string; email: string; phone: string; organization?: string; initialCoins?: number }): AdminData => {
    const newId = genId();
    const newAdmin: AdminData = {
      id: `ADM-${newId.toUpperCase().slice(0, 6)}`,
      name: data.name,
      role: 'Creator Admin',
      status: 'active',
      coinInventory: data.initialCoins || 0,
      diamondBalance: 0,
      users: 0,
      joined: now(),
      email: data.email,
      phone: data.phone,
      organization: data.organization,
      totalCoinsDistributed: 0,
      totalDiamondsGenerated: 0,
      totalDiamondsConverted: 0,
      profileCompleted: false,
    };
    setAdmins(prev => [...prev, newAdmin]);
    setNotifications(n => [
      { id: genId(), title: 'Admin Created', message: `New Creator Admin "${data.name}" has been created. They can login using their phone number.`, type: 'success', time: 'Just now', read: false },
      ...n,
    ]);
    return newAdmin;
  }, []);

  // ─── Created Users (Admin) ───
  const [createdUsers, setCreatedUsers] = useState<CreatedUser[]>(() => loadFromStorage('imitr_created_users', []));
  React.useEffect(() => { saveToStorage('imitr_created_users', createdUsers); }, [createdUsers]);

  const adminCreateUser = useCallback((data: { name: string; phone: string; city: string; gender: 'Male' | 'Female' | 'Other'; adminId?: string; adminName?: string }): CreatedUser => {
    const newId = genId();
    const newUser: CreatedUser = {
      id: `USR-${newId.toUpperCase().slice(0, 6)}`,
      name: data.name,
      phone: data.phone,
      city: data.city,
      gender: data.gender,
      status: 'active',
      coinBalance: 0,
      diamondBalance: 0,
      createdAt: now(),
      profileCompleted: false,
      adminId: data.adminId,
      adminName: data.adminName,
    };
    setCreatedUsers(prev => [...prev, newUser]);
    setNotifications(n => [
      { id: genId(), title: 'User Created', message: `New user "${data.name}" has been added. They can login using phone number ${data.phone}.`, type: 'success', time: 'Just now', read: false },
      ...n,
    ]);
    return newUser;
  }, []);

  // ─── Coin Recharge Request System (User → Admin) ───
  const [coinRechargeRequests, setCoinRechargeRequests] = useState<CoinRechargeRequest[]>(() => loadFromStorage('imitr_coin_recharge_requests', []));
  const [userAssignedAdmin, setUserAssignedAdmin] = useState<UserAssignedAdmin | null>(() => loadFromStorage('imitr_user_assigned_admin', null));
  React.useEffect(() => { saveToStorage('imitr_coin_recharge_requests', coinRechargeRequests); }, [coinRechargeRequests]);
  React.useEffect(() => { saveToStorage('imitr_user_assigned_admin', userAssignedAdmin); }, [userAssignedAdmin]);

  const submitCoinRechargeRequest = useCallback((adminIds: string[], coins: number, price: number, bonus: number) => {
    const reqId = genId();
    const newReq: CoinRechargeRequest = {
      id: reqId,
      userName: userName || 'Arun Kumar',
      adminIds,
      coins,
      price,
      bonus,
      status: 'pending',
      rejectedByAdminIds: [],
      createdAt: now(),
    };
    setCoinRechargeRequests(prev => [newReq, ...prev]);
    setNotifications(prev => [
      { id: genId(), title: 'Recharge Request Sent', message: `Your request for ${coins.toLocaleString()} coins has been sent to ${adminIds.length} admin(s). You'll be notified once approved.`, type: 'coin', time: 'Just now', read: false },
      ...prev,
    ]);
  }, [userName]);

  const approveCoinRechargeRequest = useCallback((requestId: string, adminId: string) => {
    setCoinRechargeRequests(prev => {
      const req = prev.find(r => r.id === requestId);
      if (!req || req.status !== 'pending') return prev;
      // Find admin name
      const admin = admins.find(a => a.id === adminId);
      const adminName = admin?.name || 'Admin';
      const adminEmail = admin?.email || '';
      // Add coins to user
      setCoinBalance(c => c + req.coins + req.bonus);
      // Deduct coins from admin inventory
      setAdminCoinInventory(inv => Math.max(0, inv - (req.coins + req.bonus)));
      setAdminTotalCoinsDistributed(d => d + req.coins + req.bonus);
      // Set assigned admin
      setUserAssignedAdmin({ id: adminId, name: adminName, email: adminEmail });
      // Add transaction
      setTransactions(t => [
        { id: genId(), type: 'recharge' as const, amount: req.coins + req.bonus, date: now(), method: `Approved by ${adminName}`, status: 'completed' as const },
        ...t,
      ]);
      // Notify user
      setNotifications(n => [
        { id: genId(), title: 'Recharge Approved!', message: `${adminName} approved your request. ${(req.coins + req.bonus).toLocaleString()} coins added to your wallet!`, type: 'success', time: 'Just now', read: false },
        ...n,
      ]);
      return prev.map(r => r.id === requestId ? { ...r, status: 'approved' as const, approvedByAdminId: adminId, approvedByAdminName: adminName, approvedAt: now() } : r);
    });
  }, [admins]);

  const rejectCoinRechargeRequest = useCallback((requestId: string, adminId: string) => {
    setCoinRechargeRequests(prev => {
      const req = prev.find(r => r.id === requestId);
      if (!req || req.status !== 'pending') return prev;
      const newRejected = [...req.rejectedByAdminIds, adminId];
      // If all admins rejected, mark as rejected
      if (newRejected.length >= req.adminIds.length) {
        setNotifications(n => [
          { id: genId(), title: 'Recharge Rejected', message: `Your request for ${req.coins.toLocaleString()} coins was declined by all selected admins.`, type: 'warning', time: 'Just now', read: false },
          ...n,
        ]);
        return prev.map(r => r.id === requestId ? { ...r, status: 'rejected' as const, rejectedByAdminIds: newRejected } : r);
      }
      return prev.map(r => r.id === requestId ? { ...r, rejectedByAdminIds: newRejected } : r);
    });
  }, []);

  const assignAdminToUser = useCallback((adminId: string) => {
    const admin = admins.find(a => a.id === adminId);
    if (!admin) return;
    setUserAssignedAdmin({ id: admin.id, name: admin.name, email: admin.email });
    setNotifications(n => [
      { id: genId(), title: 'Admin Assigned', message: `${admin.name} from ${admin.organization || 'IMITR'} has been assigned as your admin. You can now recharge coins directly!`, type: 'success', time: 'Just now', read: false },
      ...n,
    ]);
  }, [admins]);

  // ─── Celebrity Actions (Super Admin only) ───
  const addCelebrity = useCallback((data: Omit<CelebrityData, 'id' | 'createdAt' | 'totalCalls' | 'totalEarnings' | 'profileCompleted'>): CelebrityData => {
    const newId = genId();
    const newCelebrity: CelebrityData = {
      ...data,
      id: `CEL-${newId.toUpperCase().slice(0, 6)}`,
      createdAt: now(),
      totalCalls: 0,
      totalEarnings: 0,
      profileCompleted: false,
    };
    setCelebrities(prev => [...prev, newCelebrity]);
    return newCelebrity;
  }, []);

  const updateCelebrity = useCallback((id: string, data: Partial<CelebrityData>) => {
    setCelebrities(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, []);

  const removeCelebrity = useCallback((id: string) => {
    setCelebrities(prev => prev.filter(c => c.id !== id));
  }, []);

  const toggleCelebStatus = useCallback((id: string) => {
    setCelebrities(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c));
  }, []);

  // ─── Coin Purchase Request System (Admin <-> Super Admin) ───
  const requestCoinPurchase = useCallback((coinAmount: number) => {
    const reqId = genId();
    const rupeeCost = Math.round(coinAmount * COIN_TO_RUPEE_RATIO);
    const reqData: CoinPurchaseRequest = {
      id: reqId,
      adminId: 'ADM-001',
      adminName: 'Suresh Kumar',
      coinsPack: coinAmount,
      rupeeCost,
      status: 'pending' as const,
      requestedAt: now(),
    };
    setCoinPurchaseRequests(prev => [reqData, ...prev]);
    setNotifications(prev => [
      { id: genId(), title: 'Coin Purchase Requested', message: `You have requested ${coinAmount.toLocaleString()} coins for ₹${rupeeCost.toLocaleString()}. A Super Admin will review your request.`, type: 'info', time: 'Just now', read: false },
      ...prev,
    ]);
  }, []);

  const approveCoinPurchaseRequest = useCallback((id: string) => {
    setCoinPurchaseRequests(prev => {
      const req = prev.find(r => r.id === id);
      if (req) {
        setAdminPaymentDebt(d => d + req.rupeeCost);
        setNotifications(n => [
          { id: genId(), title: 'Coin Purchase Approved', message: `Your request for ${req.coinsPack.toLocaleString()} coins has been approved. Pay ₹${req.rupeeCost.toLocaleString()} to complete.`, type: 'success', time: 'Just now', read: false },
          ...n,
        ]);
      }
      return prev.map(r => r.id === id ? { ...r, status: 'approved' as const, approvedAt: now() } : r);
    });
  }, []);

  const rejectCoinPurchaseRequest = useCallback((id: string) => {
    setCoinPurchaseRequests(prev => {
      const req = prev.find(r => r.id === id);
      if (req) {
        setNotifications(n => [
          { id: genId(), title: 'Coin Purchase Rejected', message: `Your request for ${req.coinsPack.toLocaleString()} coins has been rejected.`, type: 'warning', time: 'Just now', read: false },
          ...n,
        ]);
      }
      return prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r);
    });
  }, []);

  const markCoinPurchasePaid = useCallback((id: string) => {
    setCoinPurchaseRequests(prev => {
      const req = prev.find(r => r.id === id);
      if (req) {
        setAdminPaymentDebt(d => d - req.rupeeCost);
        setAdminCoinInventory(c => c + req.coinsPack);
        setNotifications(n => [
          { id: genId(), title: 'Coin Purchase Paid', message: `Payment received. ${req.coinsPack.toLocaleString()} coins added to your inventory.`, type: 'success', time: 'Just now', read: false },
          ...n,
        ]);
      }
      return prev.map(r => r.id === id ? { ...r, status: 'paid' as const, paidAt: now() } : r);
    });
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // ─── Phone-Based OTP Authentication System ───
  const DEMO_OTP = '123456'; // Demo OTP for frontend simulation

  const checkPhoneForLogin = useCallback((phone: string, role: 'USER' | 'ADMIN' | 'CELEBRITY') => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Please enter a valid phone number' };
    }
    const normalizedPhone = phone.replace(/\D/g, '').slice(-10); // Last 10 digits

    if (role === 'ADMIN') {
      const admin = admins.find(a => a.phone.replace(/\D/g, '').slice(-10) === normalizedPhone);
      if (admin) {
        if (admin.status === 'suspended') return { success: false, error: 'This admin account has been suspended. Contact Super Admin.' };
        return { success: true, id: admin.id, name: admin.name, profileCompleted: admin.profileCompleted };
      }
      // Accept any number — treat as new admin needing profile setup
      const tempId = `ADM-TEMP-${normalizedPhone}`;
      return { success: true, id: tempId, name: '', profileCompleted: false };
    }

    if (role === 'CELEBRITY') {
      const celeb = celebrities.find(c => c.phone.replace(/\D/g, '').slice(-10) === normalizedPhone);
      if (celeb) {
        if (celeb.status === 'suspended') return { success: false, error: 'This celebrity account has been suspended.' };
        return { success: true, id: celeb.id, name: celeb.name, profileCompleted: celeb.profileCompleted };
      }
      // Accept any number — treat as new celebrity needing profile setup
      const tempId = `CEL-TEMP-${normalizedPhone}`;
      return { success: true, id: tempId, name: '', profileCompleted: false };
    }

    // USER — check if phone exists in admin-created users first
    const user = createdUsers.find(u => u.phone.replace(/\D/g, '').slice(-10) === normalizedPhone);
    if (user) {
      if (user.status === 'suspended') return { success: false, error: 'This user account has been suspended. Contact your Admin.' };
      const status: 'existing' | 'admin_created' = user.profileCompleted ? 'existing' : 'admin_created';
      return { success: true, id: user.id, name: user.name, profileCompleted: user.profileCompleted, adminId: user.adminId, adminName: user.adminName, userStatus: status };
    }
    // Accept any number — treat as new user needing profile setup
    const tempId = `USR-TEMP-${normalizedPhone}`;
    return { success: true, id: tempId, name: '', profileCompleted: false, userStatus: 'admin_created' as const };
  }, [admins, celebrities, createdUsers]);

  const verifyLoginOTP = useCallback((phone: string, otp: string) => {
    if (!otp || otp.length !== 6) return { success: false, error: 'Please enter a valid 6-digit OTP' };
    // In a real app, this would verify against a backend. For demo, accept DEMO_OTP.
    if (otp !== DEMO_OTP) return { success: false, error: 'Invalid OTP. For demo, use 123456.' };
    return { success: true };
  }, []);

  const markProfileCompleted = useCallback((role: 'USER' | 'ADMIN' | 'CELEBRITY', id: string) => {
    if (role === 'ADMIN') {
      setAdmins(prev => prev.map(a => a.id === id ? { ...a, profileCompleted: true } : a));
      setNotifications(n => [
        { id: genId(), title: 'Admin Profile Activated', message: 'Admin profile setup completed successfully.', type: 'success', time: 'Just now', read: false },
        ...n,
      ]);
    } else if (role === 'CELEBRITY') {
      setCelebrities(prev => prev.map(c => c.id === id ? { ...c, profileCompleted: true } : c));
      setNotifications(n => [
        { id: genId(), title: 'Celebrity Profile Activated', message: 'Celebrity profile setup completed successfully.', type: 'success', time: 'Just now', read: false },
        ...n,
      ]);
    } else {
      setCreatedUsers(prev => prev.map(u => u.id === id ? { ...u, profileCompleted: true } : u));
      setNotifications(n => [
        { id: genId(), title: 'User Activated', message: 'New user activated under your network.', type: 'success', time: 'Just now', read: false },
        ...n,
      ]);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      isPremium,
      coinBalance, diamondBalance, userName, userPhone, userCity, userGender, userAge, userInterests,
      isLoggedIn, onboardingComplete, transactions, callHistory, chatThreads, notifications, withdrawRequests, favourites,
      adminCoinInventory, adminDiamondBalance, adminUsers,
      adminTotalCoinsDistributed, adminTotalDiamondsGenerated, adminTotalDiamondsConverted,
      adminPaymentSettings,
      admins, totalMintedCoins, totalSystemDiamonds, totalCoinsInCirculation, totalDiamondsConverted, announcements,
      addCoins, deductCoins, addDiamonds, addCallRecord, sendMessage, getChatThread,
      submitWithdraw, approveWithdraw, rejectWithdraw,
      addNotification, markNotificationRead, markAllNotificationsRead, toggleFavourite, setUserProfile,
      completeOnboarding, login, logout, upgradeToPremium, downgradeToFree, minWithdrawDiamonds,
      adminBuyCoins, adminSellCoinsToUser, adminApproveWithdraw, adminRejectWithdraw, adminMarkWithdrawPaid, adminUpdatePaymentSettings,
      mintCoins, sellCoinsToAdmin, suspendAdmin, activateAdmin, removeAdmin, addAnnouncement, createAdmin,
      createdUsers, adminCreateUser,
      coinRechargeRequests, userAssignedAdmin, submitCoinRechargeRequest, approveCoinRechargeRequest, rejectCoinRechargeRequest, assignAdminToUser,
      unreadNotifications,
      adminRequest,
      submitAdminRequest,
      cancelAdminRequest,
      approveAdminRequest,
      rejectAdminRequest,
      approveAdminRequestById,
      rejectAdminRequestById,
      adminRequests,
      celebrities,
      addCelebrity,
      updateCelebrity,
      removeCelebrity,
      toggleCelebStatus,
      coinPurchaseRequests,
      adminPaymentDebt,
      requestCoinPurchase,
      approveCoinPurchaseRequest,
      rejectCoinPurchaseRequest,
      markCoinPurchasePaid,
      checkPhoneForLogin,
      verifyLoginOTP,
      markProfileCompleted,
    }}>
      {children}
    </AppContext.Provider>
  );
}