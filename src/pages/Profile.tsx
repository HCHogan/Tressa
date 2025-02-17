import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { API_URL } from '@/config'

interface UserProfile {
    id: number;
    username: string;
    email: string;
}

export function Profile() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }

        fetch(`${API_URL}/api/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch profile')
                }
                return response.json()
            })
            .then(data => setProfile(data))
            .catch(err => setError(err.message))
    }, [navigate])

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )
    }

    if (!profile) {
        return <div>Loading...</div>
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                    <AvatarFallback className="text-4xl">
                        {profile.username[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{profile.username}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <strong>Email:</strong> {profile.email}
                </div>
                <div>
                    <strong>User ID:</strong> {profile.id}
                </div>
                <Button className="w-full" onClick={() => navigate('/create')}>
                    Create New Tress
                </Button>
            </CardContent>
        </Card>
    )
}

