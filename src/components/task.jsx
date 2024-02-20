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
    <div className="w-[90%] flex justify-center bg-white bg-opacity-30 rounded-lg py-4 overflow-hidden">
      <div className="flex w-[90%] justify-between items-center space-x-4">
        {!isBookmark && (
          
          <Checkbox 
            className="hover:bg-gray-400"
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
          <button className='flex hover:bg-red-400 p-1 rounded' type='submit'><Trash size={20} strokeWidth={2} /></button>
        </form>

      </div>
    </div>
  );
}
