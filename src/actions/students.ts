import { createClient } from "@/lib/supabase/server";

const getStudents = async () => {
  const supabase = await createClient();
  const { data: studentIds, error: studentsError } = await supabase
    .from("students")
    .select("id");

  return { studentIds, studentsError };
};

export { getStudents };
