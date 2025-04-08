export function Button({ children, className = '', variant = 'default', size = 'default', ...props }) {
    const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100',
    };
    const sizes = {
      default: 'h-10 px-4 py-2',
      icon: 'h-9 w-9',
    };
    return (
      <button className={` ${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
        {children}
      </button>
    );
  }