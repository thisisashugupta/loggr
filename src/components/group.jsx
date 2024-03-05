"use client";
import { useRef, useEffect, useState } from "react"
import Task from "@/components/task";
import { createBrowserClient } from '@supabase/ssr'
import { isValidURL } from "../app/utils/regex"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from 'lucide-react'

export default function Group({ groupData, setTaskGroups, user_id }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const [tasks, setTasks] = useState([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showAddTaskForm) {
      inputRef.current.focus();
    }
  }, [showAddTaskForm]);

  const handleDeleteTG = async () => {
    // delete tg query
    await supabase
      .from("taskgroups")
      .delete()
      .eq("tg_id", groupData.tg_id)
      .single();

    setTaskGroups((prevTaskGroups) => prevTaskGroups.filter((tg) => tg.tg_id !== groupData.tg_id));
  };

  const handleAddTaskClick = () => {
    setShowAddTaskForm(true);
  };

  // when add task (+) form is submitted
  const handleAddTask = async (e) => {
    try {
      e.preventDefault();

      const new_task_name = e.target.newTaskName.value;
      const isBookmark = isValidURL(new_task_name);
      if (isBookmark) {
        // fetch title
        const response = await fetch('/api/fetch',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ url: new_task_name })
          }
        );
        const { title, error } = await response.json();

        if (error) {
          console.log("title not received");
          console.error(error);
        } else {
          await addBookmark(new_task_name, title);
        }

      } else {
        // if not url, add as task
        await addTask(new_task_name);
      }
    } catch (e) {
      console.error(e);
    }
    setShowAddTaskForm(false);
  };

  const addBookmark = async (new_task_name, title) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: title,
          b_url: new_task_name,
          tg_id: groupData.tg_id,
          user_id: user_id,
          /*modified_at: Date.now(),*/
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      console.log("added data", data);
      setTasks((tasks) => [...tasks, data[0]]);
    }
  };

  const addTask = async (new_task_name) => {
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: new_task_name,
          tg_id: groupData.tg_id,
          user_id: user_id,
          /*modified_at: Date.now(),*/
        },
      ])
      .select();

    console.log(data);

    setTasks((tasks) => [...tasks, data[0]]);
  };

  const getTasks = async () => {
    let { data } = await supabase
      .from("tasks")
      .select("*")
      .eq("tg_id", groupData.tg_id);
    setTasks(data);
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="w-full h-full md:max-w-[300px] md:min-w-[300px] p-4 text-black rounded-md border bg-slate-500 bg-opacity-60 rounded flex flex-col items-center">
      
      <div className="w-full h-full grid grid-cols-3 py-4 space-x-2">
        <p className="col-span-2 text-2xl font-semibold break-words">{groupData.tg_name}</p>
        <div className="flex justify-end items-start space-x-2">
          <button className="aspect-square p-2 rounded hover:bg-blue-400" onClick={handleAddTaskClick}><Plus size={16} strokeWidth={2} /></button>
          <button className="aspect-square p-2 rounded hover:bg-red-400 " onClick={handleDeleteTG}><Minus size={16} strokeWidth={2} /></button>
        </div>
      </div>

      <div>
        {showAddTaskForm && (
          <div className="z-10 w-screen h-screen p-4 fixed top-0 left-0 flex items-center justify-center bg-gray-600 bg-opacity-60">
            <form className="p-6 bg-white rounded-lg flex flex-col" onSubmit={handleAddTask}>
              <Label className="mx-auto">Add New Task</Label>
              <Input className="mt-3" ref={inputRef} type="text" name="newTaskName" placeholder="New Task" autoComplete="off" />
              <div className="mt-3 flex justify-between">
                <Button type="submit">Add Task</Button>
                <Button type="button" onClick={() => setShowAddTaskForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      <ScrollArea className="w-full flex flex-col justify-center items-center">
        {tasks.map((task) => (
          <Task
            key={task.task_id}
            taskData={task}
            user_id={user_id}
            setTasks={setTasks}
            isBookmark={task.b_url}
            className="shadow-lg"
          />
        ))}
      </ScrollArea>

    </div>
  );
}
