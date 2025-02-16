import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tress } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollText, Lock, Eye } from 'lucide-react'
import { API_URL } from '@/config'
import { useAuth } from '@/hooks/useAuth'
export function Home() {
    const [publicTresses, setPublicTresses] = useState<Tress[]>([])
    const [userTresses, setUserTresses] = useState<Tress[]>([])
    const { isLoggedIn } = useAuth(); 
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${API_URL}/api/tress/`)
            .then(response => response.json())
            .then(data => setPublicTresses(data))
            .catch(error => console.error('Error fetching public tresses:', error))

        if (isLoggedIn) {
            const token = localStorage.getItem('token');
            fetch(`${API_URL}/api/tress/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => setUserTresses(data))
                .catch(error => console.error('Error fetching user tresses:', error))
        }
    }, [isLoggedIn]); // 依赖 isLoggedIn

    const renderTressCard = (tress: Tress) => (
        <Card key={tress.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <ScrollText className="w-5 h-5 mr-2" />
                    {tress.title}
                </CardTitle>
                <CardDescription className="flex items-center">
                    By {tress.owner_username}
                    {!tress.is_public && <Lock className="w-4 h-4 ml-2" />}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="line-clamp-3">{tress.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Badge>{tress.language}</Badge>
                <Button variant="outline" size="sm" onClick={() => navigate(`/tress/${tress.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View
                </Button>
            </CardFooter>
        </Card>
    )

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome to Tressa</h1>
            <p className="text-muted-foreground">Share and discover Tresses.</p>
            <Tabs defaultValue="public">
                <TabsList>
                    <TabsTrigger value="public">Public Tresses</TabsTrigger>
                    {isLoggedIn && <TabsTrigger value="user">My Tresses</TabsTrigger>}
                </TabsList>
                <TabsContent value="public">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {publicTresses.map(renderTressCard)}
                    </div>
                </TabsContent>
                {isLoggedIn && (
                    <TabsContent value="user">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userTresses.map(renderTressCard)}
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
