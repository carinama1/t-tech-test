import type { TeacherData } from "@/actions/teachers";

const TeacherInfo = ({
  userName,
  teacherData,
}: {
  userName: string;
  teacherData: TeacherData;
}) => {
  const { class: classData } = teacherData;

  return (
    <>
      <div className="text-sm text-black font-bold">{userName}</div>
      <div className="text-sm text-black max-w-[300px]">
        Anda ditugaskan untuk mengisi nilai mahasiswa di kelas{" "}
        <span className="font-bold">{classData.name}</span>
      </div>
      <h1 className="text-2xl font-semibold text-center">
        Aplikasi Penilaian Mahasiswa
      </h1>
      <div className="flex justify-between items-center mb-4">
        <div className="font-medium">Kelas: {classData.name}</div>
        <div className="text-right">
          <div>Guru: {userName}</div>
        </div>
      </div>
    </>
  );
};

export default TeacherInfo;
