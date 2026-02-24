declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

const CALENDLY_URL = "https://calendly.com/admin-premiervitalityandwellness/prerequisite?background_color=0d1117&text_color=ebe5d5&primary_color=c4a24e";

export const openCalendly = () => {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  } else {
    window.open(CALENDLY_URL, "_blank");
  }
};
