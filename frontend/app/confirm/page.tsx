// app/confirm/[email]/page.tsx
'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConfirmPage({ params }: { params: { email: string } }) {
    const router = useRouter();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    console.log(params);

    useEffect(() => {
        // Access params.email from server-side props
        const urlParams = new URLSearchParams(window.location.search);
        const fetchedToken = urlParams.get('token');
        const email = urlParams.get('email');

        console.log('Params:', { email, token: fetchedToken }); // Debug
        if (!fetchedToken || !email) {
            setError('Missing token or email parameter.');
        } else {
            setUserEmail(email);
            setToken(fetchedToken);
        }
    }, [params.email]);

    const handleConfirm = async () => {
        if (!token || !userEmail) {
            setError('Missing token or email parameter.');
            return;
        }

        try {
            localStorage.setItem('user_id', userEmail);
            localStorage.setItem('isLoggedIn', 'true');
            setIsConfirmed(true);
            router.push('/dashboard');
        } catch (err) {

            console.error('Confirmation error:', err);
        }
    };

    return (
        <div className='w-full h-screen flex justify-center items-center flex-col gap-3 p-8 bg-primary/10' style={{ textAlign: 'center', padding: '50px' }}>
            <div className='bg-white p-8 rounded-xl shadow-md shadow-primary/30 border border-primary/20'>
                <h2 className='lg:text-5xl my-4 sm:text-4xl text-3xl font-bold'>Confirm Your Account</h2>
                <p className='sm:text-lg text-base text-gray-700'>Click to confirm email: <span className='font-medium'>{userEmail || 'not provided'}</span></p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className='my-10'>
                    <button
                        onClick={handleConfirm}
                        disabled={isConfirmed}
                        className="text-secondary hover:bg-gradient-to-r hover:from-blue-500/70 hover:to-cyan-500/70 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"
                        style={{ padding: '10px 24px', fontSize: '16px', cursor: 'pointer', opacity: isConfirmed ? 0.6 : 1 }}
                    >
                        {isConfirmed ? 'Confirmed' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}