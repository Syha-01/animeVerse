const API_BASE_URL = 'http://localhost:4000';

export interface User {
    id: string;
    username: string;
    email: string;
    activated: boolean;
    created_at: string;
}

export interface AuthToken {
    token: string;
    expiry: string;
}

export interface LoginResponse {
    authentication_token: AuthToken;
}

export interface RegisterResponse {
    user: User;
}

export interface AnimeData {
    id: number;
    title: string;
    synopsis: string;
    cover_image_url: string;
    total_episodes: number;
    status: string;
    release_date: string;
    rating: string;
    score: number;
    genres: string[];
    studios: string[];
    broadcast_information: string;
}

export interface SaveAnimeRequest {
    user_id: string;
    anime_id: number;
    status: string;
    current_episode?: number;
    score?: number;
    started_watching_date?: string;
    finished_watching_date?: string;
    anime: Omit<AnimeData, 'id'>;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                error: { message: 'An error occurred' },
            }));
            throw new Error(error.error?.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    async registerUser(
        username: string,
        email: string,
        password: string
    ): Promise<RegisterResponse> {
        return this.request<RegisterResponse>('/v1/users', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
    }

    async loginUser(email: string, password: string): Promise<LoginResponse> {
        return this.request<LoginResponse>('/v1/tokens/authentication', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async saveAnimeToList(
        token: string,
        userId: string,
        animeData: SaveAnimeRequest
    ): Promise<any> {
        return this.request('/v1/user_anime_list', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(animeData),
        });
    }

    async getUserAnimeList(token: string, userId: string): Promise<any> {
        return this.request(`/v1/user_anime_list?user_id=${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async getUserProfile(token: string): Promise<{ user: User }> {
        return this.request('/v1/users/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
