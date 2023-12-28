import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import MainWindow from "../views/mainWindow";

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-center items-center">
      <MainWindow session={session} />
    </div>
  );
}
