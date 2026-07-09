export default function LoadingSpinner({ message = "Cooking up results..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 border-4 border-[#222] border-t-[#00E5FF] rounded-full animate-spin" />
      <p className="mt-6 text-[#00E5FF] font-semibold">{message}</p>
      <p className="mt-2 text-sm text-[#9E9E9E]">This may take 15-30 seconds</p>
    </div>
  );
}
