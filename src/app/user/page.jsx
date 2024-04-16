import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import UserForm from '@/app/user/update-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

      <div className='absolute border-b border-gray-500 top-0 p-6 w-full flex justify-between items-center'>
        <Link href={`/`}>
          <h1 className="font-bold text-xl text-center">Loggr</h1>
        </Link>
        <form action="/auth/signout" method="post">
          <Button variant="destructive" type="submit">Sign out</Button>
        </form>
      </div>

      <h1 className="font-medium text-lg text-center">Update username</h1>      
      <UserForm user={user} />
    </div>
  );
}
