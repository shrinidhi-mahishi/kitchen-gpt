export default function LoadingSpinner({
  message = "Cooking up results...",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-[#222]" />
        <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-[#00E5FF]" />
      </div>
      <p className="mt-6 font-display font-semibold text-[#00E5FF]">{message}</p>
      <p className="mt-2 text-sm text-[#9E9E9E]">Usually takes 15–30 seconds</p>
    </div>
  );
}
