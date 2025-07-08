'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/hooks/use-app";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, translations, isAuthenticated, isSurveyCompleted } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(isSurveyCompleted ? '/dashboard' : '/survey');
    }
  }, [isAuthenticated, isSurveyCompleted, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="absolute top-4 right-4">
        <LanguageSwitcher />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-2">
          <CardHeader className="text-center">
            <Logo className="mx-auto mb-2" />
            <CardTitle className="font-headline text-2xl tracking-tight">{translations.login}</CardTitle>
            <CardDescription>{translations.tagline}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{translations.email}</Label>
                <Input id="email" type="email" placeholder="kullanici@ornek.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{translations.password}</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Giriş yapılıyor...' : translations.login}</Button>
              <div className="text-center text-sm text-muted-foreground">
                {translations.newHere}{' '}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  {translations.createAccount}
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
}
