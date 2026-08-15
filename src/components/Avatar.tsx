import Image from "next/image";
import Link from "next/link";

export default function Avatar({
  username,
  avatarUrl,
  size = 32,
}: {
  username: string;
  avatarUrl?: string | null;
  size?: number;
}) {
  return (
    <Link
      href={`/u/${username}`}
      className="shrink-0 overflow-hidden rounded-full border border-surface-2 bg-surface-2"
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={username}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-mono font-bold text-accent uppercase"
          style={{ fontSize: size * 0.4 }}
        >
          {username.charAt(0)}
        </span>
      )}
    </Link>
  );
}
