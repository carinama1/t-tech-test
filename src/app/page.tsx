"use server";

import ShadcnTable from "@/components/ShadcnTable/Table";
import { createClient } from "@/lib/supabase/server";

import { getTeacherData } from "@/actions/teachers";
import { getStudentScores } from "@/actions/scores";

import handleSubmitScores from "./action";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Sedang Terjadi Kesalahan</div>;
  }

  const userName = user?.user_metadata?.name;
  const userId = user?.id;

  const { data: teacherData, error: teacherError } = await getTeacherData(
    userId
  );

  if (teacherError || !teacherData) {
    return <div>Sedang Terjadi Kesalahan</div>;
  }

  const { data: scoresData, error: scoresError } = await getStudentScores(
    teacherData.class.id
  );

  if (scoresError || !scoresData) {
    return <div>Sedang Terjadi Kesalahan</div>;
  }

  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <ShadcnTable
        userName={userName}
        teacherData={teacherData}
        scoresData={scoresData}
        onSubmit={handleSubmitScores}
      />
    </div>
  );
}
