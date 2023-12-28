// components/task.jsx
import Favicon from "./favicon";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Task({ taskData, user_id, setTasks, isBookmark }) {
  const supabase = createClientComponentClient();
  const [isChecked, setIsChecked] = useState(taskData.checked);

  async function handleCheckboxChange(event) {
    const { data, error } = await supabase
      .from("tasks")
      .update({ checked: event.target.checked })
      .eq("task_id", taskData.task_id)
      .select()
      .single();

    console.log(data);
    setIsChecked(event.target.checked);
    console.log("checked?", isChecked);
  }

  const handleDeleteTask = async (e) => {
    e.preventDefault();

    // delete task query
    let { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("task_id", taskData.task_id);

    // fetch tasks query
    let { data: fetchedTasks, error2 } = await supabase
      .from("tasks")
      .select()
      .eq("tg_id", taskData.tg_id);

    console.log(fetchedTasks);
    setTasks(fetchedTasks);
  };

  return (
    <div className="w-[90%] flex justify-center bg-white bg-opacity-30 rounded-lg py-4 overflow-hidden">
      <div className="flex w-[90%] justify-between space-x-4">
        {!isBookmark && (
          <input
            type="checkbox"
            className="w-[15%]"
            defaultChecked={isChecked}
            onChange={(e) => handleCheckboxChange(e)}
          ></input>
        )}
        {isBookmark && <Favicon taskData={taskData} />}
        <div className="w-[80%] flex">
          {isBookmark ? (
            <a href={isBookmark} target="_blank">
              <p className="text-black text-xl">{taskData.title}</p>
            </a>
          ) : (
            <p className="text-black text-xl">{taskData.title}</p>
          )}
        </div>
        <form type="submit" onSubmit={handleDeleteTask}>
          <Button>dlt</Button>
        </form>
      </div>
    </div>
  );
}
