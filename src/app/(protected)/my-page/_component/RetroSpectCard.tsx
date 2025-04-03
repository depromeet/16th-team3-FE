interface RetrospectCardProps {
  title: string;
  percentage: number;
  icon: string;
  messageStyle: string;
  messageText: string;
}

export default function RetrospectCard({
  title,
  percentage,
  icon,
  messageStyle,
  messageText,
}: RetrospectCardProps) {
  return (
    <div className="w-1/2 rounded-2xl bg-component-gray-secondary p-4">
      <div className="mb-4 text-c1 text-gray-alternative">{title}</div>
      <div className={`${messageStyle} text-t1`}>{percentage}%</div>
      <div>
        {messageText}
        <span className={`${messageStyle} ml-1`}>{icon}</span>
      </div>
    </div>
  );
}
