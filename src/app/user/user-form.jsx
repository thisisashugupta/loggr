"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function UserForm({ session }) {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstname] = useState(null);
  const [lastName, setLastname] = useState(null);
  const [username, setUsername] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const user = session?.user;

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("users")
        .select(`name_first, name_last, username, dateofbirth`)
        .eq("user_id", user?.id)
        .single();

      console.log("data", data);
      console.log("error", error);
      console.log("status", status);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFirstname(data.name_first);
        setLastname(data.name_last);
        setUsername(data.username);
        setDateOfBirth(data.dateofbirth);
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

  async function updateProfile({ firstName, lastName, username, dateOfBirth }) {
    try {
      setLoading(true);

      let { error } = await supabase.from("users").upsert({
        user_id: user?.id,
        email: user?.email,
        name_first: firstName,
        name_last: lastName,
        username,
        /* dateofbirth: dateOfBirth,
         updated_at: new Date().toISOString(),*/
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
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={firstName || ""}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={lastName || ""}
          onChange={(e) => setLastname(e.target.value)}
        />
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
        <label htmlFor="dateOfBirth">DateOfBirth</label>
        <input
          id="dateOfBirth"
          type="url"
          value={dateOfBirth || ""}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>
      <div>
        <button
          className="button primary block"
          onClick={() =>
            updateProfile({ firstName, lastName, username, dateOfBirth })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <form action="/auth/signout" method="post">
          <button className="button block" type="submit">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
