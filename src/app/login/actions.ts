"use server";

import { createClient } from "@/lib/supabase/server";

export async function signOut() {
  const supabaseClient = await createClient();
  await supabaseClient.auth.signOut();

  return { success: true };
}

export async function signUp({
  fingerprintId,
  name,
}: {
  fingerprintId: string;
  name: string;
}) {
  const supabaseClient = await createClient();

  const email = `${fingerprintId}@dummy.dumdum`;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password: fingerprintId,
    options: {
      data: {
        name,
      },
    },
  });

  // Use Promise.all to fetch class_ids and subject_ids concurrently
  const classResponse = await supabaseClient.from("classes").select("id");

  if (classResponse.error || !classResponse.data) {
    console.error(classResponse.error);
  }

  const { data: class_ids } = classResponse;

  let randomClassId: number | null = null;

  if (!class_ids || class_ids.length === 0) {
    console.error("No class_ids found");
  } else {
    randomClassId = class_ids[Math.floor(Math.random() * class_ids.length)].id;
  }

  const { error: teacherError } = await supabaseClient.from("teachers").insert({
    assigned_class_id: randomClassId,
    name: name,
  });

  if (teacherError) {
    console.error(teacherError);
  }

  return { error };
}

export async function signIn({ fingerprintId }: { fingerprintId: string }) {
  const supabaseClient = await createClient();

  const email = `${fingerprintId}@dummy.dumdum`;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password: fingerprintId,
  });

  if (error) {
    console.error(error.code);
  }

  const errorMessage = error?.message;

  return { data, errorMessage };
}
