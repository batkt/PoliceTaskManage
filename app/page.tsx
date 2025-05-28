import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from '@/components/login-form';
import { ThemeToggle } from '@/components/theme-toggle';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login - Task Management System',
  description: 'Login to the Police Department Task Management System',
};

export default async function LoginPage() {
  const cookie = await cookies();
  const accessToken = cookie.get('accessToken')?.value || '';

  if (accessToken) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container relative flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute right-4 top-4 md:right-8 md:top-8">
          <ThemeToggle />
        </div>

        {/* Left side - Branding */}
        <div className="relative hidden h-full flex-col bg-primary p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative z-20 flex items-center gap-2 text-lg font-medium">
            <div className="rounded-full bg-white/90 p-1">
              <Image
                src="/tsagda.png?height=40&width=40"
                alt="ЦЕГ Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
            </div>
            <span className="text-xl font-bold">Цагдаагийн Ерөнхий Газар</span>
          </div>

          <div className="relative z-20 mt-auto">
            <div className="mb-4">
              <div className="mb-2 text-lg font-semibold">
                Даалгаврын удирдлагын систем
              </div>
              <div className="text-sm opacity-90">
                Цагдаагийн байгууллагын үйл ажиллагааг дэмжих, удирдлагын
                шийдвэр гаргалтыг хялбарчлах, ажлын гүйцэтгэлийг хянах,
                тайлагнах үйл явцыг автоматжуулах зорилготой систем.
              </div>
            </div>

            <blockquote className="space-y-2 border-l-4 border-white/30 pl-4">
              <p className="text-lg">
                "Хууль дээдлэн сахиж, ард түмэндээ үйлчилж, эх орноо хамгаална"
              </p>
              <footer className="text-sm">Цагдаагийн байгууллагын уриа</footer>
            </blockquote>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-1 w-1 rounded-full bg-white/80"></div>
              <div className="h-1 w-1 rounded-full bg-white/80"></div>
              <div className="h-1 w-1 rounded-full bg-white/80"></div>
              <div className="h-1 w-12 rounded-full bg-white/80"></div>
              <div className="h-1 w-1 rounded-full bg-white/80"></div>
              <div className="h-1 w-1 rounded-full bg-white/80"></div>
              <div className="h-1 w-1 rounded-full bg-white/80"></div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              {/* <div className="flex justify-center lg:hidden">
                <div className="mb-6 rounded-full bg-primary p-1">
                  <Image
                    src="/placeholder.svg?height=60&width=60"
                    alt="ЦЕГ Logo"
                    width={60}
                    height={60}
                    className="h-14 w-14"
                  />
                </div>
              </div> */}
            </div>
            <LoginForm />
            {/* <p className="px-8 text-center text-sm text-muted-foreground">
              Техникийн асуудал гарвал{" "}
              <Link
                href="/support"
                className="underline underline-offset-4 hover:text-primary"
              >
                Дэмжлэг
              </Link>{" "}
              хэсэгт хандана уу.
            </p> */}
            <div className="flex justify-center">
              <div className="text-center xl:hidden">
                {/* © Zev-TABS LLC © {moment(new Date()).format("YYYY")}. Бүх эрх */}
                хуулиар баталгаажсан
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
