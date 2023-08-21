import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import MainWindow from "../../pages/views/mainWindow";

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <MainWindow session={session} />
    </div>
  );
}
