"use client";

import { useCallback, useEffect, useState } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UserForm({ user }) {

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("users")
        .select(`username`)
        .eq("user_id", user?.id)
        .single();

      console.log("data", data);
      console.log("error", error);
      console.log("status", status);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
      }
    } catch (error) {
      alert("Error loading user data!");
      alert(error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ username }) {
    try {
      setLoading(true);

      let { error } = await supabase.from("users").upsert({
        user_id: user?.id,
        email: user?.email,
        username,
      });
      if (error) throw error;
      alert("User Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget bg-gray-500 p-16 rounded-xl">

      <div>
        <Label htmlFor="username">Username</Label>
        <Input id="username" type="text" value={username || ""} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <Button onClick={() => updateProfile({ username })} disabled={loading}> {loading ? "Loading ..." : "Update"} </Button>

      <form action="/auth/signout" method="post">
        <Button variant="destructive" type="submit"> Sign out </Button>
      </form>

    </div>
  );
}
