// views/mainWindow.js
"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input"
import Group from "@/components/group";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


export default function MainWindow({ session }) {
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const [username, setUsername] = useState("username");
  const [user_id, setUser_id] = useState(null);
  const [taskGroups, setTaskGroups] = useState([]);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);

  const user = session?.user;

  // const updateTaskGroups = (updatedTaskgroups) => {
  //   setTaskGroups(updatedTaskgroups);
  // };

  const handleAddGroupClick = () => handleShowForm();

  const handleShowForm = () => setShowAddGroupForm(true);

  const handleHideForm = () => setShowAddGroupForm(false);

  const handleAddTaskGroup = async (e) => {
    e.preventDefault();
    const new_tg_name = e.target.taskGroupName.value;

    const { data, error } = await supabase
      .from("taskgroups")
      .insert([{ tg_name: new_tg_name, user_id: user_id }])
      .select();

    setTaskGroups((taskGroups) => [...taskGroups, data[0]]);
    handleHideForm();
  };

  // useEffect
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
    <div className="w-[90vw] h-[90vh] p-6 rounded flex justify-center items-center bg-white">
      <div className="w-full h-full">

        <div className="flex items-center justify-between rounded-md m-4 p-2 space-x-2">

          <div className="flex items-center space-x-8 rounded-lg">
            <h1 className="font-bold text-4xl">{Date().substring(0,10)}</h1>
            <Button onClick={handleAddGroupClick}> Add Task Group</Button>
          </div>

          { showAddGroupForm && 
            <form onSubmit={handleAddTaskGroup} className="flex space-x-2" >
              <Input name="taskGroupName" placeholder="Task Group name" />
              <Button type="submit">Add</Button>
              <Button onClick={handleHideForm}>Cancel</Button>
            </form>
          }

          <div className="flex space-x-2 rounded-lg">
            <Link href="/user"><Button variant="outline">{username}</Button></Link>
            <form action="/auth/signout" method="post" className=" rounded-lg">
              <Button variant="destructive" type="submit">Sign out</Button>
            </form>
          </div>
        </div>

        <div className="h-[85%] flex items-start justify-start rounded-md m-4 p-2 space-x-2 border-2 border-gray-300 shadow">
          <div className='h-full flex overflow-x-auto'>
          {taskGroups.map((taskGroup) => (

            <ScrollArea key={taskGroup.tg_id} className="min-w-[400px] p-4  text-black rounded-md border bg-slate-500 bg-opacity-60">
              <Group groupData={taskGroup} setTaskGroups={setTaskGroups} user_id={user_id} />
            </ScrollArea>

          ))}
          {/* <ScrollBar orientation="horizontal" /> */}
          </div>
        </div>

      </div>
    </div>
  );
}
