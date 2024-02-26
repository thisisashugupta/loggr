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
    <div className="w-full flex justify-left bg-white bg-opacity-30 rounded-lg p-4 overflow-hidden">
      <div className="w-full flex gap-2 items-center justify-between">

        {!isBookmark && (
          <Checkbox 
            className="hover:bg-gray-400"
            checked={isChecked} 
            onCheckedChange={handleCheckboxChange}
            />
        )}

        <div className="max-w-[260px] flex justify-center items-center">
          {isBookmark ? (
            <a href={isBookmark} target="_blank" >
              <p className="text-black text-lg hover:text-blue-500">{taskData.title}</p>
            </a>
          ) : (
            <p className="w-full break-words text-black text-lg">{taskData.title}</p>
          )}
        </div>

        <form className="flex justify-end" type="submit" onSubmit={handleDeleteTask}>
          <button className='aspect-square hover:bg-red-400 p-1 rounded' type='submit'><Trash size={20} strokeWidth={2} /></button>
        </form>

      </div>
    </div>
  );
}
