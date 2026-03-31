const IntakeThankYou = () => {
  return (
    <div
      className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <img
        src="/logo-emblem.svg"
        alt="Premier Vitality and Wellness LLC"
        className="h-16 mb-8"
      />
      <h1 className="text-2xl font-bold uppercase tracking-widest text-black mb-4 text-center">
        Thank You
      </h1>
      <p className="text-sm text-gray-600 max-w-md text-center leading-relaxed mb-2">
        Your patient intake form has been submitted successfully.
      </p>
      <p className="text-sm text-gray-600 max-w-md text-center leading-relaxed mb-8">
        A member of our team will review your information and reach out to you shortly.
        If you have any immediate questions, please contact our office directly.
      </p>
      <div className="text-xs text-gray-400 uppercase tracking-widest">
        Premier Vitality and Wellness LLC
      </div>
    </div>
  );
};

export default IntakeThankYou;
