interface PhoneButtonProps {
  phone: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PhoneButton({ phone, className = '', size = 'md' }: PhoneButtonProps) {
  if (!phone) return null;
  
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneUrl = `tel:+${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}`;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <a
      href={phoneUrl}
      className={`inline-flex items-center gap-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors ${sizeClasses[size]} ${className}`}
      title={`Ligar para ${phone}`}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="flex-shrink-0"
      >
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
      </svg>
      Telefone
    </a>
  );
}