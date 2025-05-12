import Chat from "./(component)/chat";

export default function Home() {
  return (
    // TODO: move this to chat route and add redirect to chat if logged in for login page
    <div className="flex h-full w-full">
      <div className="w-48 bg-amber-400">side</div>

      <Chat />
    </div>
  );
}
