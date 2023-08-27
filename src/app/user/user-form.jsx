"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function UserForm({ session }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const user = session?.user;

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
    <div className="form-widget">
      <div>
        <h1 className="text-white text-2xl p-4">Update Username</h1>
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <button
          className=" bg-white text-black rounded-xl text-xl p-2 button primary block"
          onClick={() => updateProfile({ username })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button
            className="bg-white text-black rounded-xl text-xl p-2 button block"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
