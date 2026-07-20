import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - LocalPlus",
  description: "Privacy Policy for the LocalPlus mobile app.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-gray-800">
      <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: July 20, 2026</p>

      <p className="mt-8 leading-relaxed">
        This Privacy Policy describes how LocalPlus (&quot;we&quot;, &quot;us&quot;) collects, uses, and
        shares information when you use the LocalPlus mobile app (the &quot;App&quot;), which helps
        users in Thailand discover restaurants, book tables, track loyalty cards, browse events and
        news, and manage family chores and rewards.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Information We Collect</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed">
        <li>
          <span className="font-medium">Account information</span> — email address and password when
          you create an account.
        </li>
        <li>
          <span className="font-medium">Location data</span> — with your permission, your device
          location while using the App, to show nearby restaurants and businesses.
        </li>
        <li>
          <span className="font-medium">Camera access</span> — with your permission, used only to
          scan loyalty QR codes at participating businesses. We do not store camera images.
        </li>
        <li>
          <span className="font-medium">Booking and loyalty data</span> — reservations you make and
          loyalty cards you add within the App.
        </li>
        <li>
          <span className="font-medium">Push notification token</span> — a device identifier used to
          deliver notifications you opt into.
        </li>
        <li>
          <span className="font-medium">Usage data</span> — basic app usage information used to
          maintain and improve the service.
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">How We Use Information</h2>
      <p className="mt-4 leading-relaxed">
        We use the information above to operate the App&apos;s features — showing nearby businesses,
        processing bookings, tracking loyalty cards, displaying events and news, managing family
        rewards, and sending notifications you&apos;ve enabled. We do not sell your personal
        information.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Data Sharing</h2>
      <p className="mt-4 leading-relaxed">
        We share information with service providers who help us operate the App — including our
        backend and authentication provider (Supabase) and infrastructure hosting providers — solely
        to provide the App&apos;s functionality. These providers are not permitted to use your
        information for their own purposes.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Data Retention &amp; Deletion</h2>
      <p className="mt-4 leading-relaxed">
        We retain account and booking data for as long as your account is active. You may request
        deletion of your account and associated data at any time by contacting us at the email
        address below.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Children&apos;s Privacy</h2>
      <p className="mt-4 leading-relaxed">
        The App is not directed to children under 13, and we do not knowingly collect personal
        information from children under 13.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Changes to This Policy</h2>
      <p className="mt-4 leading-relaxed">
        We may update this Privacy Policy from time to time. We will post any changes on this page
        with a new &quot;Last updated&quot; date.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Contact Us</h2>
      <p className="mt-4 leading-relaxed">
        If you have questions about this Privacy Policy or wish to request deletion of your data,
        contact us at{" "}
        <a
          href="mailto:shannon.green.asia@gmail.com"
          className="text-orange-600 underline underline-offset-2"
        >
          shannon.green.asia@gmail.com
        </a>
        .
      </p>
    </main>
  );
}
