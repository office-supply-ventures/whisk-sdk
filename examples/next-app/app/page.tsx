import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Whisk SDK Examples</h1>
        <Link href="/stats" className="text-primary underline underline-offset-4 hover:opacity-80">
          Steakhouse Stats Dashboard
        </Link>
      </main>
    </div>
  )
}
