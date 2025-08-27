import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

type FormValues = {
  title: string;
  content: string;
  author?: string;
};

export default function Create() {
  const { register, handleSubmit } = useForm<FormValues>();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("http://localhost:4000/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        router.push("/");
      } else {
        console.error("Failed to create", await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input {...register("title", { required: true })} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea {...register("content", { required: true })} rows={8} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Author</label>
          <input {...register("author")} className="w-full border p-2 rounded" />
        </div>

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Publish</button>
      </form>
    </main>
  );
}
