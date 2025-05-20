import AppNav from "./(component)/appNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full w-full">
      <AppNav />
      <main className="h-full w-full pt-16 pl-18">{children}</main>
    </div>
  );
}
