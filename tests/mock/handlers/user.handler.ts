import { UserProfile } from "@/hooks/useUser";
import { http, HttpResponse } from "msw";


const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000' || process.env.BACKEND_URL;

export const mockUserProfile:UserProfile = {  
  id: 'user-1',
  name: 'Test User',
  email: 'test@focura.com',
  image: "Image" ,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: "2024-01-01T00:00:00.000Z"
}

const ok = (data: unknown) => HttpResponse.json({ success: true, data });

export const userHandler = [
    http.get(`${BASE}/api/v1/user/profile`, () => ok({user: mockUserProfile}))
]
