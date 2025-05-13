import AppNav from "./(component)/appNav";
import AppSidebar from "./(component)/appSideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AppNav />
      <AppSidebar />
      <main className="h-full w-full pt-16 pl-18">{children}</main>
    </div>
  );
}
