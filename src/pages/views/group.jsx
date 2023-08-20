// views/mainWindow.js
"use client";
import { useCallback, useEffect, useState } from "react";
import Task from "../components/task";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function Group({ groupData, setTaskGroups }) {
  const supabase = createClientComponentClient();
  const [tasks, setTasks] = useState([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  const handleDeleteTG = async () => {
    // groupData.tg_id
    const { data, error } = await supabase
      .from("taskgroups")
      .delete()
      .eq("tg_id", groupData.tg_id)
      .single();

    let { data: taskgroups } = await supabase
      .from("taskgroups")
      .select("tg_name");

    console.log(taskgroups);

    // setTaskGroups(taskgroups);
  };

  const handleAddTask = () => {
    console.log("AddTask clicked");
    handleShowForm();
  };

  // show add Tgroup form
  const handleShowForm = () => setShowAddTaskForm(true);
  // hide add Tgroup form
  const handleHideForm = () => setShowAddTaskForm(false);
  // when form is submitted
  const submitForm = (e) => {
    e.preventDefault();
    console.log("submit form");
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
    <div className="w-[48%] h-[100%] border-solid border-white border-4 rounded flex flex-col items-center ">
      <div className="w-[90%] flex justify-between py-4">
        <span className="text-4xl text-white ">{groupData.tg_name}</span>
        <div className="flex">
          <button className="text-2xl font-bold px-2" onClick={handleAddTask}>
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
            <form onSubmit={submitForm}>
              <input type="text" name="taskName" placeholder="Task Name" />
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
          <Task key={task.task_id} taskData={task} />
        ))}
      </div>
    </div>
  );
}
