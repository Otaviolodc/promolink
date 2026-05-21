export function StatsCard({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}