export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex-1 w-full flex flex-col mx-auto">{children}</div>;
}
