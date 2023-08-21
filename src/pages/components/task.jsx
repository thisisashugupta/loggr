// import { supabase } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// views/task.jsx
export default function Task({ taskData, user_id, setTasks }) {
  const supabase = createClientComponentClient();

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
    <div className="w-[90%] flex justify-center bg-white rounded-lg py-4">
      <div className="flex w-[90%] justify-between">
        <input type="checkbox" className="w-[15%]"></input>
        <div className="w-[80%] flex">
          <p className="text-black text-2xl">{taskData.title}</p>
        </div>
        <form type="submit" onSubmit={handleDeleteTask}>
          <button className="text-black text-2l">dlt</button>
        </form>
      </div>
    </div>
  );
}
