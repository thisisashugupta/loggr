// views/mainWindow.js
"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// views/mainWindow.js
import Group from "./group";
import FavTabs from "../components/favtabs.jsx";

export default function MainWindow({ session }) {
  const supabase = createClientComponentClient();
  const [username, setUsername] = useState(null);
  const [user_id, setUser_id] = useState(null);
  const [taskGroups, setTaskGroups] = useState([]);
  const [showAddGroupForm, setShowAddGroupForm] = useState(false);

  const user = session?.user;

  // const updateTaskGroups = (updatedTaskgroups) => {
  //   setTaskGroups(updatedTaskgroups);
  // };

  // add group is clicked
  const handleAddGroupClick = () => handleShowForm();

  // show add Tgroup form
  const handleShowForm = () => setShowAddGroupForm(true);

  // hide add Tgroup form
  const handleHideForm = () => setShowAddGroupForm(false);

  // when form is submitted
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
    <div className="w-[90%] h-[80%] border-solid border-white border-4 rounded flex justify-center items-center">
      <div className="w-[90%] h-[90%]">
        <div className="flex justify-between">
          <div className="flex space-x-8">
            <h1 className="font-bold text-5xl">Tuesday 1 Jan</h1>

            <button
              onClick={handleAddGroupClick}
              className="bg-white text-black rounded-xl text-xl p-4"
            >
              Add TaskGroup
            </button>
          </div>

          <div>
            {showAddGroupForm && (
              <div className="overlay">
                <form onSubmit={handleAddTaskGroup}>
                  <input
                    type="text"
                    name="taskGroupName"
                    placeholder="Task Group Name"
                  />
                  <button type="submit">Add</button>
                  <button type="button" onClick={handleHideForm}>
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>

          <div>
            <p className="bg-white text-black rounded-xl text-xl p-4">
              {username}
            </p>
          </div>
        </div>
        <div className="w-[100%] h-[94%] flex justify-between items-center">
          <div className="w-[60%] h-[90%]  flex items-center space-x-6">
            {taskGroups.map((taskGroup) => (
              <Group
                key={taskGroup.tg_id}
                groupData={taskGroup}
                setTaskGroups={setTaskGroups}
              />
            ))}
          </div>

          {/*
<div className="w-[40%] h-[90%] flex flex-col justify-between">
            <div className="h-[44%] border-solid border-white border-4 rounded flex flex-col items-center py-4">
              <FavTabs />
            </div>
            <div className="h-[54%] border-solid border-white border-4 rounded flex flex-col items-center py-4">
              <div className="w-[90%]">
                <h1 className="text-4xl mb-4">Choice News</h1>
                <p className="text-justify mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </p>
                <a href="#">Link</a>
              </div>
            </div>
          </div>

           */}
        </div>
      </div>
    </div>
  );
}
