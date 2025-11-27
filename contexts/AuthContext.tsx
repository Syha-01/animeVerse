import { apiClient, User } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@animeverse_token';
const USER_KEY = '@animeverse_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load stored auth data on mount
    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const [storedToken, storedUser] = await Promise.all([
                AsyncStorage.getItem(TOKEN_KEY),
                AsyncStorage.getItem(USER_KEY),
            ]);

            if (storedToken) {
                setToken(storedToken);

                // Try to fetch the latest user data from the server
                try {
                    const { user: freshUser } = await apiClient.getUserProfile(storedToken);
                    setUser(freshUser);
                    await AsyncStorage.setItem(USER_KEY, JSON.stringify(freshUser));
                } catch (err) {
                    // If fetch fails (e.g. offline), fall back to stored user
                    console.log('Failed to fetch fresh user profile, using stored data');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load stored auth:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const response = await apiClient.loginUser(email, password);

            const authToken = response.authentication_token.token;

            // Store token
            await AsyncStorage.setItem(TOKEN_KEY, authToken);
            setToken(authToken);

            // Fetch full user profile
            const { user: userObj } = await apiClient.getUserProfile(authToken);

            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userObj));
            setUser(userObj);
        } catch (err: any) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            setError(null);
            setLoading(true);
            const response = await apiClient.registerUser(username, email, password);

            // Store user data with ID from registration response
            const userObj = response.user;
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userObj));
            setUser(userObj);

            // Note: After registration, user needs to activate their account via email
            // They'll need to login after activation
            // The user ID is now stored and will be available when they login
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await Promise.all([
                AsyncStorage.removeItem(TOKEN_KEY),
                AsyncStorage.removeItem(USER_KEY),
            ]);
            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        error,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
