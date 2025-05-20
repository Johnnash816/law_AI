import AppSidebar from "./(component)/appSideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full w-full">
      <AppSidebar />
      {children}
    </div>
  );
}
