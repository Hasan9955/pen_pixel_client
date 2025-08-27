import { GetServerSideProps } from "next";

type Post = {
  _id: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
};

export default function PostPage({ post }: { post: Post | null }) {
  if (!post) return <div className="p-6">Post not found</div>;
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-600">{post.author} • {new Date(post.createdAt || "").toLocaleString()}</p>
      <div className="mt-6 prose">
        <p>{post.content}</p>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.params!;
  try {
    const res = await fetch(`http://localhost:5000/api/posts/${id}`);
    if (res.status === 404) return { props: { post: null } };
    const post = await res.json();
    return { props: { post } };
  } catch (err) {
    return { props: { post: null } };
  }
};
