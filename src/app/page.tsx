import Chat from "./(component)/chat";

export default function Home() {
  return (
    <div className="flex h-full w-full">
      <div className="w-48 bg-amber-400">side</div>

      <Chat />
    </div>
  );
}
