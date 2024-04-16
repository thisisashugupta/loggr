// views/mainWindow.js
"use client";

import { useRef, useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input"
import Group from "@/components/group";
import Link from "next/link";
import { Label } from "@/components/ui/label";

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
  const inputRef = useRef(null);

  useEffect(() => {
    if (showAddGroupForm) {
      inputRef.current.focus();
    }
  }, [showAddGroupForm]);

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
          <div className="z-10 w-screen h-screen p-4 fixed top-0 left-0 flex items-center justify-center bg-gray-600 bg-opacity-60">
            <form className="p-6 bg-white rounded-lg flex flex-col" onSubmit={handleAddTaskGroup} >
              <Label className="mx-auto">Add New Task Group</Label>
              <Input className="mt-3" ref={inputRef} name="taskGroupName" placeholder="New Task Group" autoComplete="off" />
              <div className="mt-3 flex justify-between">
                <Button type="submit">Add</Button>
                <Button onClick={toggleTgModal}>Cancel</Button>
              </div>
            </form>
          </div>
          }

          <div className="w-full flex justify-between md:justify-end space-x-2">
            <Link href="/user"><Button variant="outline">{username}</Button></Link>
            <form action="/auth/signout" method="post"><Button variant="destructive" type="submit">Sign out</Button></form>
          </div>

      </div>

      <ScrollArea id="bottom-area" className='mt-2 mb-4 mx-3 md:m-4 p-2 h-full rounded-md border-2 border-gray-300 shadow'>
        <div className="h-full w-full rounded-md flex flex-col md:flex-row items-start justify-start">
          {taskGroups.map((taskGroup) => <Group key={taskGroup.tg_id} groupData={taskGroup} setTaskGroups={setTaskGroups} user_id={user_id} />)}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

    </div>
  );
}
