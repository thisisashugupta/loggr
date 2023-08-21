// views/mainWindow.js
"use client";
import { useCallback, useEffect, useState } from "react";
import Task from "../components/task";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
  // when form is submitted
  const handleAddTask = async (e) => {
    e.preventDefault();
    // submit form
    const new_task_name = e.target.newTaskName.value;

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

    setShowAddTaskForm(false);
    setTasks((tasks) => [...tasks, data[0]]);
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
    <div className="w-[48%] h-[100%] border-solid border-white border-4 rounded flex flex-col items-center ">
      <div className="w-[90%] flex justify-between py-4">
        <span className="text-4xl text-white ">{groupData.tg_name}</span>
        <div className="flex">
          <button
            className="text-2xl font-bold px-2"
            onClick={handleAddTaskClick}
          >
            +
          </button>
          <button className="text-2xl font-bold px-2" onClick={handleDeleteTG}>
            delete_tg
          </button>
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

      <div className="flex flex-col w-[100%] justify-center items-center space-y-4">
        {tasks.map((task) => (
          <Task
            key={task.task_id}
            taskData={task}
            user_id={user_id}
            setTasks={setTasks}
            isBookmark={task.b_url}
          />
        ))}
      </div>
    </div>
  );
}
