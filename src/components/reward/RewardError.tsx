type RewardErrorProps = {
  message: string;
};

export default function RewardError({
  message,
}: RewardErrorProps) {
  return (
    <div className="my-3 rounded-xl border border-red-100 bg-white/80 p-3 text-center">
      <p role="alert" className="text-sm text-red-500">{message}</p>
    </div>
  );
}
