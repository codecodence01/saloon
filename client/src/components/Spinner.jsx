export default function Spinner({ fullPage = true }) {
  if (fullPage) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-rose-gold/20 border-t-rose-gold animate-spin mx-auto mb-4"></div>
          <p className="text-warm-gray text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-8 h-8 rounded-full border-3 border-rose-gold/20 border-t-rose-gold animate-spin"></div>
    </div>
  );
}
