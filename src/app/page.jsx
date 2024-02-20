// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createServerClient /* , type CookieOptions */ } from '@supabase/ssr'
import { cookies } from 'next/headers'
import MainWindow from '@/app/views/mainWindow'

export default async function Account() {
  // const supabase = createServerComponentClient({ cookies });
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-center items-center">
      <MainWindow session={session} />
    </div>
  );
}
