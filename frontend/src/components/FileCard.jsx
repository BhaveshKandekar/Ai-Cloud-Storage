export default function FileCard({ name, date }) {
  return (
    <div className="p-4 border rounded bg-white shadow hover:shadow-lg transition">
      <div className="font-medium text-lg">{name}</div>
      <div className="text-sm text-gray-500">{date}</div>
    </div>
  );
}
