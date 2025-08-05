import { useState } from 'react';
import api from '../../lib/customerApi';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface LoginFormProps {
    onSuccess: (token: string) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const [email, setEmail] = useState('ash@example.com');
    const [password, setPassword] = useState('pikachu');

    const login = async () => {
        const { data } = await api.post('/customer/login', { email, password });
        localStorage.setItem('customerToken', data.token);
        onSuccess(data.token);
    };

    return (
        <div className="mx-auto mt-16 max-w-md">
            <Card className="space-y-4 p-6">
                <h2 className="text-2xl font-bold">Customer Login</h2>
                <div>
                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button className="w-full" onClick={login}>
                    Login
                </Button>
            </Card>
        </div>
    );
}
