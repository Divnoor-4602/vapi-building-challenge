import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">Hospital Voice Agent</h1>
        <h2 className="text-3xl font-semibold text-gray-600">
          Bricolage Grotesque Heading Font
        </h2>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed">
          This is the Manrope font being used for body text. It&apos;s clean,
          readable, and modern - perfect for longer passages of text in your
          hospital voice agent application. The font provides excellent
          legibility across different screen sizes and devices.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-4 border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Feature One</h3>
            <p className="text-sm text-gray-600">
              Body text using Manrope font for clarity and readability.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="text-lg font-medium mb-2">Feature Two</h4>
            <p className="text-sm text-gray-600">
              Consistent typography throughout the application.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h5 className="text-base font-medium mb-2">Feature Three</h5>
            <p className="text-sm text-gray-600">
              Beautiful font pairing between headings and body text.
            </p>
          </div>
        </div>
      </div>
      <UserButton />
    </div>
  );
}
