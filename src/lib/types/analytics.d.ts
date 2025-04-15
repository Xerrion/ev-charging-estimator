// Type definitions for analytics platforms
interface Window {
	plausible?: (event: string, options?: { props: Record<string, string> }) => void;
	gtag?: (
		command: string,
		targetId: string,
		config?: Record<string, string | boolean | number>
	) => void;
	umami?: {
		track: (eventName: string, eventData?: Record<string, string>) => void;
		trackView: (url?: string) => void;
	};
	dataLayer?: any[];
}
