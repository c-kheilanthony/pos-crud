import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const getAuthToken = () => localStorage.getItem('customerToken') || localStorage.getItem('cashierToken') || '';
console.log('Echo module loaded!');

function bearerAuthorizer(channel: any, options: any): any {
    return {
        authorize(socketId: string, callback: (error: any, data: any) => void) {
            fetch('/broadcasting/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                body: JSON.stringify({
                    socket_id: socketId,
                    channel_name: channel.name,
                }),
            })
                .then(async (res) => {
                    if (res.status !== 200) throw new Error(await res.text());
                    return res.json();
                })
                .then((data) => callback(null, data))
                .catch((err) => callback(err, null));
        },
    };
}

export const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authorizer: bearerAuthorizer, // ← use custom authorizer
});
console.log('Echo initialized with key:', import.meta.env.VITE_PUSHER_APP_KEY);
