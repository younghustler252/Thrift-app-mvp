import * as lucideIcon from 'lucide-react';

const IconRenderer = ({ name, size = 24, color = 'black' }) => {
    const Icon = lucideIcon[name];

    if (!Icon) return null;

    return <Icon size={size} color={color} />;
};

export default IconRenderer;
