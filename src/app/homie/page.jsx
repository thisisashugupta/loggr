import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import MainWindow from "../../pages/views/mainWindow";
import AccountForm from "./home-view";
// import { ColorProvider } from "../utils/colourContext";

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">

      {/*<AccountForm session={session} />*/}
      <MainWindow session={session} />
    </div>
  );
}
