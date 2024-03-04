import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import UserForm from '@/app/user/user-form';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen min-w-screen">

      <div className='p-6 w-full flex justify-between items-center'>
        <h1 className="font-medium text-lg text-center">Update username</h1>
        <form action="/auth/signout" method="post"><Button variant="destructive" type="submit">Sign out</Button></form>
      </div>
      <UserForm user={user} />
    </div>
  );
}
