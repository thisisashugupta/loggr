// views/mainWindow.js
"use client";
import { useCallback, useEffect, useState } from "react";
import Task from "../components/task";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { isValidURL } from "../utils/regex";
import { Button } from "@/components/ui/button";
import { fetchWebpageInfo } from "../utils/fetching";

export default function Group({ groupData, setTaskGroups, user_id }) {
  const supabase = createClientComponentClient();
  const [tasks, setTasks] = useState([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const handleDeleteTG = async () => {
    // delete tg query
    const { data, error } = await supabase
      .from("taskgroups")
      .delete()
      .eq("tg_id", groupData.tg_id)
      .single();
    // fetch tg query
    let { data: fetchedTaskgroups } = await supabase
      .from("taskgroups")
      .select("*");

    console.log(fetchedTaskgroups);

    setTaskGroups(fetchedTaskgroups);
  };

  const handleAddTaskClick = () => {
    handleShowForm();
  };

  // show add Task form
  const handleShowForm = () => setShowAddTaskForm(true);
  // hide add Task form
  const handleHideForm = () => setShowAddTaskForm(false);

  const addBookmark = async (new_task_name, title) => {
    const { data, error: supaerror } = await supabase
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

    console.log("data", data);
    console.log("supaerror", supaerror);

    if (data === null) return;
    setTasks((tasks) => [...tasks, data[0]]);
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

  // when form is submitted
  const handleAddTask = async (e) => {
    try {
      e.preventDefault();
      // submit form

      const new_task_name = e.target.newTaskName.value;

      // check for bookmark
      const isBookmark = isValidURL(new_task_name);

      if (isBookmark) {
        // fetch title
        const response = await fetch(`/api/fetch?url=${new_task_name}`);
        const jsonData = await response.json();
        console.log("jsonData", jsonData);

        if (jsonData !== null) {
          const { title, error } = jsonData;
          // either title or error

          if (error) {
            console.log("title not received, error received");

            console.log(error);
            await addTask(new_task_name);
            console.log("adding as task");
          } else {
            console.log("title", title);

            if (title === null) {
              await addTask(new_task_name);
            } else {
              await addBookmark(new_task_name, title);
            }
          }
        }
      } else {
        // if is not url, do default
        await addTask(new_task_name);
      }
    } catch (e) {
      console.log("logging catch (e)");
      console.log(e);
    }
    setShowAddTaskForm(false);
  };

  useEffect(() => {
    async function getTasks() {
      let { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("tg_id", groupData.tg_id);
      setTasks(data);
    }
    getTasks();
  }, []);

  return (
    <div className="w-full h-[100%] rounded flex flex-col items-center">
      <div className="w-[90%] flex justify-between py-4 space-x-2">
        <span className="text-2xl font-semibold">{groupData.tg_name}</span>
        <div className="flex space-x-2">
          <Button className="hover:bg-blue-500" onClick={handleAddTaskClick}>+</Button>
          <Button className="hover:bg-red-500" onClick={handleDeleteTG}>-</Button>
        </div>
      </div>

      <div>
        {showAddTaskForm && (
          <div className="overlay">
            <form onSubmit={handleAddTask}>
              <input type="text" name="newTaskName" placeholder="Task Name" />
              <button type="submit">Add Task</button>
              <button type="button" onClick={handleHideForm}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="flex flex-col w-full justify-center items-center space-y-4">
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
