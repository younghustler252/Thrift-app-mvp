import AppRoute from '@/routes/AppRoute';
import { AuthProvider } from './context/AuthProvider';

function App() {
    return (
        <div>
            <AuthProvider>
                <AppRoute />
            </AuthProvider>
        </div>
    );
}

export default App;
