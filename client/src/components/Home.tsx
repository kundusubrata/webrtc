export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold underline text-center mb-6">
        App is Running!
      </h1>
      <div className="flex space-x-4">
        <a
          href="/sender"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full"
        >
          Go to Sender
        </a>
        <a
          href="/receiver"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full"
        >
          Go to Receiver
        </a>
      </div>
    </div>
  );
}
