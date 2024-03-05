// views/mainWindow.js
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input"
import Group from "@/components/group";
import Link from "next/link";

export default function MainWindow({ session }) {
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const [tgModal, setTgModal] = useState(false);
  const [username, setUsername] = useState("username");
  const [user_id, setUser_id] = useState(null);
  const [taskGroups, setTaskGroups] = useState([]);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);

  const user = session?.user;

  // const updateTaskGroups = (updatedTaskgroups) => {
  //   setTaskGroups(updatedTaskgroups);
  // };

  const toggleTgModal = (prevVal) => setShowAddGroupForm(!prevVal);
    // setTgModal(!prevVal);

  const handleShowForm = () => setShowAddGroupForm(true);

  const handleHideForm = (prev) => setShowAddGroupForm(!prev);

  const handleAddTaskGroup = async (e) => {
    e.preventDefault();
    const new_tg_name = e.target.taskGroupName.value;

    const { data, error } = await supabase
      .from("taskgroups")
      .insert([{ tg_name: new_tg_name, user_id: user_id }])
      .select();

    setTaskGroups((taskGroups) => [...taskGroups, data[0]]);
    setShowAddGroupForm(false);
  };

  useEffect(() => {
    async function getTG() {
      const { data } = await supabase.from("taskgroups").select("*");
      setTaskGroups(data);
    }
    getTG();
    console.log("use Effect 1");
  }, []); // Fetch taskgroups once on component mount

  useEffect(() => {
    async function getUserData() {
      const { data } = await supabase.from("users").select("*").single();
      setUsername(data.username);
      setUser_id(data.user_id);
    }
    getUserData();
    console.log("use Effect 2");
  }, []); // Fetch user data once on component mount

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex flex-col">

      <div id="top-bar" className="mx-6 mt-6 mb-2 md:p-4 flex flex-col-reverse md:flex-row items-center justify-between rounded-md gap-4">

          <div className="w-full flex items-center justify-between md:justify-start space-x-9">
            <h1 className="font-bold text-3xl md:text-4xl">{Date().substring(0,10)}</h1>
            <Button onClick={handleShowForm}>Add TG</Button>
          </div>

          { showAddGroupForm && 
            <form onSubmit={handleAddTaskGroup} className="w-full flex space-x-2" >
              <Input name="taskGroupName" placeholder="Task Group name" />
              <Button type="submit">Add</Button>
              <Button onClick={toggleTgModal}>Cancel</Button>
            </form>
          }

          <div className="w-full flex justify-between md:justify-end space-x-2">
            <Link href="/user"><Button variant="outline">{username}</Button></Link>
            <form action="/auth/signout" method="post"><Button variant="destructive" type="submit">Sign out</Button></form>
          </div>

      </div>

      <ScrollArea className='mt-2 mb-4 mx-3 md:m-4 p-2 h-full rounded-md border-2 border-gray-300 shadow'>
        <div className="w-full rounded-md flex flex-col md:flex-row items-start justify-start">
          {taskGroups.map((taskGroup) => (
            <div key={taskGroup.tg_id} className="w-full md:max-w-[300px] md:min-w-[300px] p-4 text-black rounded-md border bg-slate-500 bg-opacity-60">
              <Group groupData={taskGroup} setTaskGroups={setTaskGroups} user_id={user_id} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

    </div>
  );
}
