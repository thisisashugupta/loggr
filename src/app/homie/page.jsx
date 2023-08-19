import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import MainWindow from "../pages/views/mainWindow";
import AccountForm from "./home-view";

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div>
      {/*<AccountForm session={session} />*/}
      <MainWindow session={session} />
    </div>
  );
}
