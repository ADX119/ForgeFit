"use client";

import {
  Badge,
  Button,
  buttonClasses,
  Card,
  ConfirmDialog,
  EmptyState,
  ListRow,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  NumberStepper,
  PageHeader,
  ProgressBar,
  SelectField,
  Sheet,
  SheetContent,
  SheetTrigger,
  Skeleton,
  StatTile,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TextField,
} from "@forgefit/ui";
import { CalendarDays, ChevronRight, Dumbbell, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Brand } from "@/components/brand";
import { useToast } from "@/components/toast";

const tokens = [
  ["canvas", "bg-canvas", "App background"],
  ["surface", "bg-surface", "Cards, sheets"],
  ["raised", "bg-raised", "Inputs, nested panels"],
  ["line-strong", "bg-line-strong", "Input borders"],
  ["ink", "bg-ink", "Primary text"],
  ["muted", "bg-muted", "Secondary text"],
  ["primary", "bg-primary", "The main action"],
  ["secondary", "bg-secondary", "Links, info"],
  ["nutrition", "bg-nutrition", "Nutrition accent"],
  ["success", "bg-success", "Saved, positive"],
  ["warning", "bg-warning", "Offline, pending"],
  ["danger", "bg-danger", "Errors, destructive"],
] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

export function DesignGallery() {
  const toast = useToast();
  const [weight, setWeight] = useState<number | null>(60);
  const [reps, setReps] = useState<number | null>(8);
  const [emailError, setEmailError] = useState(false);

  return (
    <main className="mx-auto grid max-w-5xl gap-12 px-4 py-10 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        <Brand />
        <Badge tone="info">Development only</Badge>
      </div>
      <PageHeader
        eyebrow="Design system"
        title="ForgeFit components"
        description="Every shared component in its states. New screens are built only from these."
      />

      <Section title="Colour tokens">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tokens.map(([name, swatch, use]) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3"
            >
              <span className={`size-10 shrink-0 rounded-lg border border-line ${swatch}`} />
              <span>
                <span className="block text-sm font-medium text-ink">{name}</span>
                <span className="block text-xs text-muted">{use}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography">
        <Card className="grid gap-3">
          <p className="text-4xl font-extrabold tracking-tight">Display 62.5 kg</p>
          <p className="text-3xl font-bold tracking-tight">Page title</p>
          <p className="text-lg font-bold">Section heading</p>
          <p className="font-semibold">Card title</p>
          <p className="max-w-prose leading-6">
            Body text. Short sentences, plain words. The next action is always obvious.
          </p>
          <p className="text-sm font-semibold">Label</p>
          <p className="text-xs text-muted">Caption, muted, never below 12px</p>
          <p className="text-3xl font-bold tabular-nums">
            1,240 <span className="text-sm font-medium text-muted">kg volume</span>
          </p>
        </Card>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Start workout</Button>
          <Button variant="secondary">Edit routine</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="danger">
            <Trash2 className="size-4" /> Delete
          </Button>
          <Button loading>Saving…</Button>
          <Button disabled>Disabled</Button>
          <Button size="lg">Large (workout)</Button>
          <Button size="sm" variant="secondary">
            Small
          </Button>
          <Button size="icon" variant="ghost" aria-label="Edit">
            <Pencil className="size-4" />
          </Button>
          <a href="#buttons" className={buttonClasses({ variant: "secondary" })}>
            Link styled as a button
          </a>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Neutral</Badge>
          <Badge tone="primary">PR</Badge>
          <Badge tone="success">Saved</Badge>
          <Badge tone="warning">Offline · saved on phone</Badge>
          <Badge tone="danger">Failed</Badge>
          <Badge tone="info">New</Badge>
          <Badge tone="nutrition">Estimate</Badge>
        </div>
      </Section>

      <Section title="Stats and progress">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile label="Duration" value="52" unit="min" />
          <StatTile label="Volume" value="4,820" unit="kg" hint="+6% vs last week" />
          <StatTile label="Sets" value="18" />
        </div>
        <Card className="grid gap-2">
          <p className="text-sm text-muted">3 of 6 exercises</p>
          <ProgressBar value={3} max={6} label="Workout progress" />
        </Card>
      </Section>

      <Section title="Form fields">
        <Card className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Routine name"
            placeholder="Push Day"
            hint="Shown on Today and in history."
          />
          <TextField
            label="Email"
            type="email"
            defaultValue="not-an-email"
            error={emailError ? "Enter a valid email address." : undefined}
            onBlur={(event) => setEmailError(!event.target.value.includes("@"))}
          />
          <SelectField label="Rest between sets" defaultValue="90">
            <option value="60">60 seconds</option>
            <option value="90">90 seconds</option>
            <option value="120">2 minutes</option>
          </SelectField>
          <TextField label="Disabled" disabled defaultValue="Can't edit this" />
        </Card>
      </Section>

      <Section title="Number stepper (set logging)">
        <Card className="grid gap-4 sm:grid-cols-2">
          <NumberStepper
            label="Weight"
            unit="kg"
            value={weight}
            onChange={setWeight}
            step={2.5}
            decimals={2}
            max={1000}
          />
          <NumberStepper label="Reps" value={reps} onChange={setReps} max={100} />
          <p className="text-sm text-muted sm:col-span-2">
            Logged: {weight ?? "–"} kg × {reps ?? "–"} reps
          </p>
        </Card>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="routines">
          <TabsList aria-label="Train">
            <TabsTrigger value="routines">Routines</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="routines" className="mt-4 text-sm text-muted">
            Routines panel
          </TabsContent>
          <TabsContent value="exercises" className="mt-4 text-sm text-muted">
            Exercises panel
          </TabsContent>
          <TabsContent value="history" className="mt-4 text-sm text-muted">
            History panel
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Lists">
        <Card className="divide-y divide-line p-0">
          <ListRow
            leading={<Dumbbell className="size-5" />}
            title="Push Day"
            subtitle="6 exercises · ~55 min · last done Tue"
            trailing={<ChevronRight className="size-5 text-muted" />}
          />
          <ListRow
            leading={<CalendarDays className="size-5" />}
            title="Bench press 62.5 kg × 8"
            subtitle="New best · Tue"
            trailing={<Badge tone="primary">PR</Badge>}
          />
        </Card>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap gap-3">
          <ConfirmDialog
            trigger={<Button variant="secondary">Confirm dialog</Button>}
            title="Discard this workout?"
            description="12 logged sets will be deleted. This can't be undone."
            confirmLabel="Discard workout"
            destructive
            onConfirm={() => toast("success", "Workout discarded (demo).")}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Bottom sheet / drawer</Button>
            </SheetTrigger>
            <SheetContent title="Dumbbell bench press" description="Chest · Intermediate">
              <ol className="grid list-decimal gap-3 pl-5 text-sm leading-6 text-ink">
                <li>Lie on the bench with feet flat and shoulder blades pulled together.</li>
                <li>Lower the dumbbells to mid-chest with elbows about 45° from your body.</li>
                <li>Press up until your arms are straight, without locking out hard.</li>
              </ol>
            </SheetContent>
          </Sheet>
          <Menu>
            <MenuTrigger asChild>
              <Button variant="secondary" size="icon" aria-label="More actions">
                <MoreHorizontal className="size-5" />
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem onSelect={() => toast("success", "Swap (demo)")}>Swap exercise</MenuItem>
              <MenuItem onSelect={() => toast("success", "Skip (demo)")}>Skip exercise</MenuItem>
              <MenuSeparator />
              <MenuItem destructive onSelect={() => toast("error", "Discard (demo)")}>
                Discard workout
              </MenuItem>
            </MenuContent>
          </Menu>
          <Button variant="secondary" onClick={() => toast("success", "Routine saved.")}>
            Success toast
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast("error", "Couldn't save your routine. Your changes are still here. Try again.")
            }
          >
            Error toast
          </Button>
        </div>
      </Section>

      <Section title="Empty and loading states">
        <div className="grid gap-4 md:grid-cols-2">
          <EmptyState
            icon={<Dumbbell className="size-8" />}
            title="No workouts yet"
            description="Your history appears after your first session."
            action={<Button>Start a workout</Button>}
          />
          <Card className="grid content-start gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24" />
          </Card>
        </div>
      </Section>
    </main>
  );
}
