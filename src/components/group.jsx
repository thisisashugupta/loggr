"use client";
import { useCallback, useEffect, useState } from "react"
import Task from "@/components/task";
import { createBrowserClient } from '@supabase/ssr'
import { isValidURL } from "../app/utils/regex"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus } from 'lucide-react'

export default function Group({ groupData, setTaskGroups, user_id }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const [tasks, setTasks] = useState([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

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
    <div className="w-full h-[100%] rounded flex flex-col items-center">
      <div className="w-[90%] flex justify-between py-4 space-x-2">
        <span className="text-2xl font-semibold">{groupData.tg_name}</span>
        <div className="flex space-x-2">
          <button className="hover:bg-blue-400 px-2 rounded" onClick={handleAddTaskClick}><Plus size={16} strokeWidth={2} /></button>
          <button className="hover:bg-red-400 px-2 rounded" onClick={handleDeleteTG}><Minus size={16} strokeWidth={2} /></button>
        </div>
      </div>

      <div>
        {showAddTaskForm && (
          <div className="overlay p-4">
            <form onSubmit={handleAddTask}>
              <Input type="text" name="newTaskName" placeholder="New Task" />
              <div className="flex justify-center p-4 space-x-4">
                <Button type="submit">Add Task</Button>
                <Button type="button" onClick={() => setShowAddTaskForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col justify-center items-center space-y-4 x-2">
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
      </div>
    </div>
  );
}
