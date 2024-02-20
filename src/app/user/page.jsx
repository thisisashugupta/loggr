import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import UserForm from '@/app/user/user-form';

export default async function Account() {

  const cookieStore = cookies()

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
  )

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen min-w-screen flex flex-col justify-center items-center">
      <h1 className="text-black text-2xl text-center p-4">Update username</h1>
      <UserForm user={user} />
    </div>
  );
}
