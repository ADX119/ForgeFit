import { LogOut } from "lucide-react";
import { Button, Card, PageHeader } from "@forgefit/ui";
import { InstallHelp } from "@/components/features/install-help";
import { ProfileForm } from "@/components/features/profile-form";
import { signOut } from "@/lib/actions/auth";
import { getCurrentProfile } from "@/lib/data/queries";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Profile & settings"
        title="Your ForgeFit baseline"
        description="The details behind your nutrition estimate and recipe choices."
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <h2 className="text-xl font-semibold">Personal details</h2>
          <p className="mt-2 mb-6 text-sm text-muted">Metric units · {profile.timezone}</p>
          <ProfileForm profile={profile} />
        </Card>
        <div className="grid content-start gap-5">
          <Card>
            <h2 className="text-xl font-semibold">Install the app</h2>
            <p className="mt-2 mb-5 text-sm leading-6 text-muted">
              Add ForgeFit to your home screen for faster access and a standalone window.
            </p>
            <InstallHelp />
          </Card>
          <Card>
            <h2 className="text-xl font-semibold">Account</h2>
            <p className="mt-2 mb-5 text-sm leading-6 text-muted">
              Sign out of ForgeFit on this device.
            </p>
            <form action={signOut}>
              <Button variant="secondary">
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
