import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useKiosk } from "@/hooks/useKiosk";

const SITE_URL = "https://premiervitalityandwellness.com";
const COUNTDOWN_SECONDS = 20;

const IntakeThankYou = () => {
  const location = useLocation();
  const { isKiosk: kioskSession, clearKiosk } = useKiosk();
  const source = (location.state as any)?.source || "website";
  const isKiosk = source === "kiosk" || kioskSession;

  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!isKiosk) return;
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (!cancelledRef.current) {
            clearKiosk();
            window.location.href = SITE_URL;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isKiosk]);

  const handleCreateAccount = () => {
    cancelledRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div
      className="bg-white text-black flex flex-col items-center justify-center px-4"
      style={{ fontFamily: "'Manrope', sans-serif", minHeight: "100dvh", overflowY: "auto" }}
    >
      <img
        src="/logo-emblem.svg"
        alt="Premier Vitality and Wellness LLC"
        className="h-16 mb-8"
      />
      <h1 className="text-2xl font-bold uppercase tracking-widest text-black mb-4 text-center">
        Thank You
      </h1>

      {isKiosk ? (
        <>
          <p className="text-sm text-gray-600 max-w-md text-center leading-relaxed mb-8">
            Your patient intake form has been submitted successfully.
            A confirmation email is on its way to you.
          </p>
          <Link
            to="/auth?mode=signup"
            onClick={handleCreateAccount}
            className="inline-block px-8 py-3 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 rounded-full transition-colors duration-200 mb-6"
          >
            Create Your Patient Account
          </Link>
          <p className="text-xs text-gray-400 tabular-nums">
            Returning to home in {countdown}s...
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 max-w-md text-center leading-relaxed mb-2">
            Your patient intake form has been submitted successfully.
          </p>
          <p className="text-sm text-gray-600 max-w-md text-center leading-relaxed mb-8">
            A member of our team will review your information and reach out to you shortly.
            If you have any immediate questions, please contact our office directly.
          </p>
          <Link
            to="/auth?mode=signup"
            className="inline-block px-8 py-3 text-xs tracking-[0.2em] uppercase bg-black text-white hover:bg-gray-800 rounded-full transition-colors duration-200 mb-4"
          >
            Create Your Patient Account
          </Link>
          <a
            href={SITE_URL}
            className="text-xs text-gray-400 hover:text-gray-600 tracking-widest uppercase transition-colors"
          >
            Return to Homepage
          </a>
        </>
      )}

      <div className="text-xs text-gray-400 uppercase tracking-widest mt-8">
        Premier Vitality and Wellness LLC
      </div>
    </div>
  );
};

export default IntakeThankYou;
