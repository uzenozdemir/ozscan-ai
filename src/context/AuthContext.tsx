import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'elite';
  credits: number;
  maxCredits: number;
  joinDate: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  useCredit: () => boolean;
  upgradePlan: (plan: 'pro' | 'elite') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Deterministic token generation - no invalid tokens
function generateToken(email: string): string {
  const timestamp = Date.now();
  const payload = btoa(JSON.stringify({ email, iat: timestamp, exp: timestamp + 86400000 }));
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const signature = btoa(`ozscan_${email}_${timestamp}`);
  return `${header}.${payload}.${signature}`;
}

function getStoredAuth(): AuthState {
  try {
    const stored = localStorage.getItem('ozscan_auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate token structure before returning
      if (parsed.token && parsed.user && parsed.token.split('.').length === 3) {
        return { user: parsed.user, token: parsed.token, isAuthenticated: true };
      }
    }
  } catch {
    localStorage.removeItem('ozscan_auth');
  }
  return { user: null, token: null, isAuthenticated: false };
}

const PLAN_CREDITS = { free: 5, pro: 50, elite: 999999 };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(getStoredAuth);

  const persistAuth = useCallback((newState: AuthState) => {
    setState(newState);
    if (newState.isAuthenticated) {
      localStorage.setItem('ozscan_auth', JSON.stringify({ user: newState.user, token: newState.token }));
    } else {
      localStorage.removeItem('ozscan_auth');
    }
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const token = generateToken(email);
    const user: User = {
      id: btoa(email),
      email,
      name: email.split('@')[0],
      plan: 'free',
      credits: 5,
      maxCredits: 5,
      joinDate: new Date().toISOString(),
    };
    // Check for existing user data
    try {
      const existingData = localStorage.getItem(`ozscan_user_${email}`);
      if (existingData) {
        const existing = JSON.parse(existingData);
        user.plan = existing.plan || 'free';
        user.credits = existing.credits ?? PLAN_CREDITS[user.plan];
        user.maxCredits = PLAN_CREDITS[user.plan];
        user.name = existing.name || user.name;
      }
    } catch { /* use defaults */ }
    persistAuth({ user, token, isAuthenticated: true });
  }, [persistAuth]);

  const register = useCallback(async (email: string, _password: string, name: string) => {
    await new Promise(r => setTimeout(r, 800));
    const token = generateToken(email);
    const user: User = {
      id: btoa(email),
      email,
      name,
      plan: 'free',
      credits: 5,
      maxCredits: 5,
      joinDate: new Date().toISOString(),
    };
    localStorage.setItem(`ozscan_user_${email}`, JSON.stringify(user));
    persistAuth({ user, token, isAuthenticated: true });
  }, [persistAuth]);

  const logout = useCallback(() => {
    if (state.user) {
      localStorage.setItem(`ozscan_user_${state.user.email}`, JSON.stringify(state.user));
    }
    persistAuth({ user: null, token: null, isAuthenticated: false });
  }, [persistAuth, state.user]);

  const useCredit = useCallback((): boolean => {
    if (!state.user) return false;
    if (state.user.plan === 'elite') return true;
    if (state.user.credits <= 0) return false;
    const updatedUser = { ...state.user, credits: state.user.credits - 1 };
    const newState = { ...state, user: updatedUser };
    persistAuth(newState);
    localStorage.setItem(`ozscan_user_${updatedUser.email}`, JSON.stringify(updatedUser));
    return true;
  }, [state, persistAuth]);

  const upgradePlan = useCallback((plan: 'pro' | 'elite') => {
    if (!state.user) return;
    const updatedUser = {
      ...state.user,
      plan,
      credits: PLAN_CREDITS[plan],
      maxCredits: PLAN_CREDITS[plan],
    };
    const newState = { ...state, user: updatedUser };
    persistAuth(newState);
    localStorage.setItem(`ozscan_user_${updatedUser.email}`, JSON.stringify(updatedUser));
  }, [state, persistAuth]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, useCredit, upgradePlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
