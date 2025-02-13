interface ProviderIconProps {
  provider: string;
  className?: string;
}

export function ProviderIcon({ provider, className = "w-6 h-6" }: ProviderIconProps) {
  switch (provider.toLowerCase()) {
    case 'anthropic':
      return <img src="/anthropic-icon.png" className={className} alt="Anthropic" />;
    case 'openai':
      return <img src="/openai-icon.png" className={className} alt="OpenAI" />;
    case 'google':
      return <img src="/google-icon.png" className={className} alt="Google" />;
    case 'custom':
      return <img src="/custom-icon.png" className={className} alt="Custom" />;
    default:
      return <div className={`${className} bg-gray-200 rounded-full`} />;
  }
}