import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '@/css/PageHeader.css';

function PageHeader({ title, right, showBack = false, onBack }) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack(); // custom handler if provided
        } else {
            navigate(-1); // default: go back one step
        }
    };

    return (
        <header className="page-header">
            <div className="page-header__left">
                {showBack && (
                    <button
                        className="back-button"
                        onClick={handleBack}
                        aria-label="Go Back">
                        <ArrowLeft size={24} />
                    </button>
                )}
                <h1>{title}</h1>
            </div>

            <div className="page-header__right">{right}</div>
        </header>
    );
}

export default PageHeader;
