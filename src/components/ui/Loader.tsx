import { Loader } from "lucide-react";

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'purple' | 'green' | 'gray';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoaderSpinner: React.FC<LoaderProps> = ({ 
  size = 'md', 
  color = 'blue', 
  text, 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    gray: 'text-gray-600'
  };

  const containerClasses = fullScreen 
    ? 'h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4'
    : 'flex items-center justify-center py-10';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <Loader className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin mx-auto mb-4`} />
        {text && (
          <p className="text-gray-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  );
};

export default LoaderSpinner;
