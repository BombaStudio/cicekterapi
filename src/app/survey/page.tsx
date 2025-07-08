'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/Logo';

export default function SurveyPage() {
  const { completeSurvey, translations } = useApp();
  const router = useRouter();

  const [healthStatus, setHealthStatus] = useState('');
  const [dailyChallenges, setDailyChallenges] = useState<string[]>([]);
  const [helpBarriers, setHelpBarriers] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleChallengeChange = (checked: boolean, value: string) => {
    setDailyChallenges(prev => 
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };
  
  const handleBarrierChange = (checked: boolean, value: string) => {
    setHelpBarriers(prev => 
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const surveyData = {
      healthStatus,
      dailyChallenges,
      helpBarriers,
      additionalInfo
    };
    completeSurvey(surveyData);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-2xl shadow-lg border-2">
        <CardHeader className="text-center">
          <Logo className="mx-auto mb-4"/>
          <CardTitle className="font-headline text-3xl tracking-tight">{translations.surveyTitle}</CardTitle>
          <CardDescription className="text-base">{translations.surveyDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Health Status Question */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">{translations.survey.healthStatus}</Label>
              <RadioGroup onValueChange={setHealthStatus} value={healthStatus} className="flex flex-col space-y-2">
                {Object.entries(translations.survey.healthOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`health-${key}`} />
                    <Label htmlFor={`health-${key}`}>{value}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Daily Challenges Question */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">{translations.survey.dailyChallenges}</Label>
              <div className="space-y-2">
                {Object.entries(translations.survey.challengeOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox id={`challenge-${key}`} onCheckedChange={(checked) => handleChallengeChange(Boolean(checked), value)} />
                    <Label htmlFor={`challenge-${key}`}>{value}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Barriers Question */}
            <div className="space-y-3">
              <Label className="text-lg font-medium">{translations.survey.helpBarriers}</Label>
              <div className="space-y-2">
                {Object.entries(translations.survey.barrierOptions).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox id={`barrier-${key}`} onCheckedChange={(checked) => handleBarrierChange(Boolean(checked), value)} />
                    <Label htmlFor={`barrier-${key}`}>{value}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info Question */}
            <div className="space-y-3">
              <Label htmlFor="additional-info" className="text-lg font-medium">{translations.survey.additionalInfo}</Label>
              <Textarea
                id="additional-info"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder={translations.survey.additionalInfoPlaceholder}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={!healthStatus}>
              {translations.survey.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
