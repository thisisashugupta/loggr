import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import MainWindow from '@/app/views/mainWindow'

export default async function Account() {

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
    <MainWindow session={session} />
  );
}
