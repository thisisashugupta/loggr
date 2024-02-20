"use client";

import { createBrowserClient } from '@supabase/ssr'
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import Favicon from "./favicon";

export default function Task({ taskData, user_id, setTasks, isBookmark }) {
  // const supabase = createClientComponentClient();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [isChecked, setIsChecked] = useState(taskData.checked);

  async function handleCheckboxChange(checkedValue) {
    console.log('checkedValue', checkedValue);
    await supabase // const { data, error } = await supabase
      .from("tasks")
      .update({ checked: checkedValue })
      .eq("task_id", taskData.task_id)
      .select()
      .single();
    setIsChecked(checkedValue);
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

    setTasks(fetchedTasks);
  };

  return (
    <div className="w-[90%] flex justify-center bg-white bg-opacity-30 rounded-lg py-4 overflow-hidden">
      <div className="flex w-[90%] justify-between items-center space-x-4">
        {!isBookmark && (
          
          <Checkbox 
            checked={isChecked} 
            onCheckedChange={handleCheckboxChange}
            />

        )}

        <div className="w-[80%] flex justify-start items-center">
          {isBookmark ? (
            <a href={isBookmark} target="_blank" >
              <p className="text-black text-xl hover:text-blue-500">{taskData.title}</p>
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
