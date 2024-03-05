"use client";

import { useState } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { Checkbox } from "@/components/ui/checkbox"
import { Trash } from 'lucide-react'

export default function Task({ taskData, user_id, setTasks, isBookmark }) {

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [isChecked, setIsChecked] = useState(taskData.checked);

  async function handleCheckboxChange(checkedValue) {
    console.log('checkedValue', checkedValue);
    await supabase // const { data, error } = 
    .from("tasks")
    .update({ checked: checkedValue })
    .eq("task_id", taskData.task_id)
    .select()
    .single();
    setIsChecked(checkedValue);
  }

  const handleDeleteTask = async (e) => {
    e.preventDefault();
    try {
      await supabase
      .from("tasks")
      .delete()
      .eq("task_id", taskData.task_id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== taskData.task_id));
    } catch (error) {
        throw new Error(error);
    }
  };

  return (
    <div className="my-2 p-3 w-full flex items-center justify-between gap-2 rounded-lg bg-opacity-30 shadow overflow-hidden bg-white">

        {!isBookmark && (
          <Checkbox 
            className="rounded hover:bg-gray-400"
            checked={isChecked} 
            onCheckedChange={handleCheckboxChange}
            />
        )}

        <div className="max-w-auto flex justify-center items-center">
          {isBookmark ? (
            <a href={isBookmark} target="_blank" >
              <p className="text-black text-lg hover:text-blue-500">{taskData.title}</p>
            </a>
          ) : (
            <p className="w-full max-w-[200px] md:max-w-[170px] break-words text-black text-lg">{taskData.title}</p>
          )}
        </div>

        <form className="flex justify-end" type="submit" onSubmit={handleDeleteTask}>
          <button className='aspect-square hover:bg-red-400 p-1 rounded' type='submit'><Trash size={20} strokeWidth={2} /></button>
        </form>

    </div>
  );
}
