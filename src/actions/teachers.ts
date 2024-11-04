"use server";

import type { PostgrestError } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export interface TeacherData {
  class: {
    id: number;
    name: string;
  };
}
interface GetTeacherResponse {
  data: TeacherData | null;
  error: PostgrestError | null;
}

export const getTeacherData = async (
  userId: string
): Promise<GetTeacherResponse> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("teachers")
    .select("assigned_class_id")
    .eq("auth_id", userId)
    .maybeSingle();

  if (!data || error) {
    return { data: null, error: error };
  } else {
    const { data: assigned_class_name } = await supabase
      .from("classes")
      .select("name")
      .eq("id", data?.assigned_class_id ?? 0);

    return {
      data: {
        class: {
          id: data?.assigned_class_id ?? 0,
          name: assigned_class_name?.[0]?.name ?? "",
        },
      },
      error: null,
    };
  }
};
