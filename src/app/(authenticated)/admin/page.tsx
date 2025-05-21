"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useRef } from "react";

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  return (
    <div className="py4 h-full w-full py-4 pr-4 pl-8">
      <h2 className="mb-2 text-xl font-bold">Upload Judgements</h2>
      <input
        ref={fileInputRef}
        name="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mb-2 flex h-10 cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        type="file"
      />
      <button
        onClick={async () => {
          //Check if have file
          if (file) {
            // Upload file to supabase storage
            // TODO: put this into a server action
            await supabase.storage
              .from("judgements")
              //Bucket RLS policy checks for the second path token to be a valid uuid
              //IF want to change need to change the RLS policy as well
              .upload(`${file.name}/${crypto.randomUUID()}`, file);

            // Reset file state and input
            setFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }
        }}
        className="cursor-pointer rounded-md bg-blue-500 px-4 py-1 text-white"
      >
        Upload
      </button>
    </div>
  );
};

export default Page;
